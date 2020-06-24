const express = require('express')

const userRoutes = require('./users')

const server = express()
const port = process.env.PORT

server.use(express.json()) // prse the bodieswhen they are JSON
server.use("/users" , userRoutes)

server.listen(port, ()=>{
    console.log(`Server running on ${port}`)
})