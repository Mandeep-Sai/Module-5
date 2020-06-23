const express = require('express')
const studentRoutes = require('./students/index')
const cors = require('cors')

const server = express()
server.use(cors())
// server.use()
server.use(express.json()) 
server.use("/students" , studentRoutes)

server.listen(3001,()=>{
    console.log('Running on 3001')
})