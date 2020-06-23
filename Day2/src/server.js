const express = require('express')

const userRoutes = require('./users')

const server = express()

server.use(express.json()) // prse the bodieswhen they are JSON
server.use("/users" , userRoutes)

server.listen(3001, ()=>{
    console.log('Server running on 3001')
})