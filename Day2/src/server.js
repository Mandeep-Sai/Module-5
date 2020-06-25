const express = require('express')
const endpoints = require('express-list-endpoints')
const {join} = require('path')

const userRoutes = require('./users')
const filesRoutes = require('./files')
const publicFolderPath = join(__dirname ,"../public/images")
const server = express()
const port = process.env.PORT

server.use(express.json()) // prse the bodieswhen they are JSON
server.use("/users" , userRoutes)
server.use("/files",filesRoutes)
server.use(express.static(publicFolderPath))
console.log(endpoints(server))

server.listen(port, ()=>{
    console.log(`Server running on ${port}`)
})