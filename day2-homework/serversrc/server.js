const express = require("express");
const studentRoutes = require("./students/index");
const projectRoutes = require("./projects");
// const reviewsRoutes = require('./reviews')
const cors = require("cors");
const endpoints = require("express-list-endpoints");
const { invalidIdHandler, catchAllHandler } = require("./errorHandling");
const mongoose = require("mongoose");

const server = express();
server.use(cors());
// server.use()
server.use(express.json());
server.use("/students", studentRoutes);
server.use("/projects", projectRoutes);
// server.use("/reviews")

server.use(invalidIdHandler);
server.use(catchAllHandler);

mongoose
  .connect("mongodb://localhost:27017/students_portfolio", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(
    server.listen(3002, () => {
      console.log("Running on 3002");
    })
  );
