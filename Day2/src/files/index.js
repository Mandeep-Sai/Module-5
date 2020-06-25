const express = require('express')
const multer = require('multer')
const fse = require('fs-extra')
const {createReadStream} = require('fs-extra')
const {join} = require('path')

const router = express.Router()
const upload = multer({})

const imagesFolderPath = join(__dirname,"../../public/images")

router.post("/upload",upload.single("meme"),async(req,res,next)=>{
    console.log(req.file)
    console.log(imagesFolderPath)
    try {
        await fse.writeFile(join(imagesFolderPath,req.file.originalname), req.file.buffer)
        
    } catch (error) {
        
    }
    res.send('ok')
})

router.post("/uploadMultiple",upload.array("multipleImages"),async(req,res,next)=>{
   console.log(req.files)
   try {
       const arrayOfPromises = req.files.map(image => fse.writeFile(join(imagesFolderPath,image.originalname), image.buffer)) 
       await Promise.all(arrayOfPromises) 
       res.send('ok')
   } catch (error) {
       console.log(error)
   }
})

router.get("/:name/download",(req,res,next)=>{
    const source = createReadStream(join(imagesFolderPath,`${req.params.name}`))
    res.setHeader('Content-Disposition',`attachment; filename =${req.params.name}`)
    source.pipe(res)

    // source.on("error",error =>{
    //     next(error)
    // })
})

module.exports = router