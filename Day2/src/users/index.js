const express = require('express')
const fs = require('fs')
const path = require("path")
const uniqid = require('uniqid')

const router = express.Router()
const usersFilePath = path.join(__dirname ,"users.json")


router.get("/", (req,res)=>{
    const bufferFileContent = fs.readFileSync(usersFilePath)
    const fileContent = bufferFileContent.toString()
    console.log(fileContent)
    // console.log(__dirname+`\\users.json`) /* bad way */
    // console.log(path.join(__dirname , "users.json")) /* good way */
    res.send(JSON.parse(fileContent))
})

router.get('/:id',(req,res)=>{
    const bufferFileContent = fs.readFileSync(usersFilePath)
    const usersArray = JSON.parse(bufferFileContent.toString())
    console.log(usersArray)
    // const id = req.params.id
    const user = usersArray.filter(element => element.id === parseInt(req.params.id))
    res.send(user)
})


router.post("/",(req,res)=>{
    console.log(req.body)
    const newUser = {...req.body,id:uniqid()}
    const bufferFileContent = fs.readFileSync(usersFilePath)
    const usersArray = JSON.parse(bufferFileContent.toString())
    usersArray.push(newUser)
    // fs.writeFileSync(usersFilePath ,JSON.stringify(usersArray))
    // res.status(201).send(newUser)
})


router.put("/:id",(req,res)=>{
    const bufferFileContent = fs.readFileSync(usersFilePath)
    const usersArray = JSON.parse(bufferFileContent.toString())
    const filteredArray = usersArray.filter(element => element.id !== req.params.id)
    const user = req.body
    user.id = req.params.id
    filteredArray.push(user)
    fs.writeFileSync(usersFilePath , JSON.stringify(filteredArray) )
    res.send('Edited Sucessfully')
})

router.delete("/:id",(req,res)=>{
    const bufferFileContent = fs.readFileSync(usersFilePath)
    const usersArray = JSON.parse(bufferFileContent.toString())

    const filteredArray = usersArray.filter(element => element.id !== req.params.id)
    fs.writeFileSync(usersFilePath , JSON.stringify(filteredArray) )
    res.send('Deleted')
})




module.exports = router