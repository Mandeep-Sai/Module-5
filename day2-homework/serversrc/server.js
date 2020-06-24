const express = require('express')
const studentRoutes = require('./students/index')
const projectRoutes = require('./projects')
const cors = require('cors')
const endpoints = require('express-list-endpoints')
const {invalidIdHandler,catchAllHandler} = require('./errorHandling')

const server = express()
server.use(cors())
// server.use()
server.use(express.json()) 
server.use("/students" , studentRoutes)
server.use("/projects",projectRoutes)

server.use(invalidIdHandler)
server.use(catchAllHandler)

console.log(endpoints(server))
server.listen(3001,()=>{
    console.log('Running on 3001')
})