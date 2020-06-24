const express = require('express')
const {check,validationResult } = require('express-validator')
const path = require('path')
const fs = require('fs')
const uniqid = require('uniqid')

const router = express.Router()
const projectsFilePath = path.join(__dirname,"projects.json")
const studentsFilePath = path.join(__dirname,'../students/students.json')


// router.get("/",(req,res)=>{
//     const bufferFileContent = fs.readFileSync(projectsFilePath)
//     const fileContent = bufferFileContent.toString()
//     res.send(JSON.parse(fileContent))
//     console.log(studentsFilePath)
// })

router.get('/:id',(req,res)=>{
        const bufferFileContent = fs.readFileSync(projectsFilePath)
        const projectsArray = JSON.parse(bufferFileContent.toString())
        const project = projectsArray.filter(project => project.id === req.params.id)
        res.send(project)
})

router.get("/", (req, res) => {
    const bufferFileContent = fs.readFileSync(projectsFilePath)
    const fileContent = JSON.parse(bufferFileContent.toString())
    if (req.query && req.query.name) {
      const filteredProjects = fileContent.filter(
        (project) =>
        project.hasOwnProperty("name") &&
        project.name.toLowerCase() === req.query.name.toLowerCase()
      )
      res.send(filteredProjects)
    } else {
      res.send(fileContent)
    }
  })

router.get('/:studentId/projects',(req,res)=>{
    // const studentId = req.params.studentId
    const studentProjects = []
    const bufferFileContent = fs.readFileSync(projectsFilePath)
    const fileContent = JSON.parse(bufferFileContent.toString())
    fileContent.forEach(project =>{
        if(project.studentId === req.params.studentId){
            studentProjects.push(project)
        }
    })
    res.send(studentProjects)

})

router.post('/',
[
    check("studentId").isLength({min : 15}).withMessage('Invalid Id'),
],
    (req,res,next)=>{
    const errors = validationResult(req)
    // console.log(errors)
    if(!errors.isEmpty()){
        const err = new Error()
        err.httpStatusCode = 404
        // err.message = errors.message
        next(err)
        console.log(err)
    }

    const newProject = {...req.body, id:uniqid()}
    const studentId = req.body.studentId
    const bufferFileContent = fs.readFileSync(projectsFilePath)
    const fileContent = bufferFileContent.toString()
    const projectsArray = JSON.parse(fileContent)
    projectsArray.push(newProject)
    fs.writeFileSync(projectsFilePath, JSON.stringify(projectsArray))

    // 
    const studentBufferFileContent = fs.readFileSync(studentsFilePath)
    const studentFileContent = JSON.parse(studentBufferFileContent.toString())
    studentFileContent.forEach(student =>{
        if(student.id === studentId){
            if(student.NumberOfProjects){
                student.NumberOfProjects +=1
            }else{
                student.NumberOfProjects = 1
            }
        }
    })

    fs.writeFileSync(studentsFilePath ,JSON.stringify(studentFileContent))

    res.send(studentFileContent)
        
})


router.put("/:id",(req,res)=>{
    const bufferFileContent = fs.readFileSync(projectsFilePath)
    const projectsArray = JSON.parse(bufferFileContent.toString())
    const filteredArray = projectsArray.filter(element => element.id !== req.params.id)
    const user = req.body
    user.id = req.params.id
    filteredArray.push(user)
    fs.writeFileSync(projectsFilePath , JSON.stringify(filteredArray) )
    res.send('Edited Sucessfully')
})

router.delete("/:id",(req,res)=>{
    const bufferFileContent = fs.readFileSync(projectsFilePath)
    const projectsArray = JSON.parse(bufferFileContent.toString())

    const filteredArray = projectsArray.filter(element => element.id !== req.params.id)
    fs.writeFileSync(projectsFilePath , JSON.stringify(filteredArray) )
    res.send('Deleted')
})





module.exports = router