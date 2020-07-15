const express = require("express");
const studentRoutes = require("./students/index");
const pgStudentRoutes = require("./students/pgindex");
const pgProjectsRoutes = require("./projects/pgindex");
const projectRoutes = require("./projects");
// const reviewsRoutes = require('./reviews')
const cors = require("cors");
const dotenv = require("dotenv");
const endpoints = require("express-list-endpoints");
const {
  invalidIdHandler,
  invalidNameHandler,
  catchAllHandler,
} = require("./errorHandling");
const mongoose = require("mongoose");
const db = require("./db");
dotenv.config();

const server = express();
server.use(cors());
// server.use()
server.use(express.json());
server.use("/students", studentRoutes);
server.use("/pg/students", pgStudentRoutes);
server.use("/pg/projects", pgProjectsRoutes);
server.use("/projects", projectRoutes);
// server.use("/reviews")

server.use(invalidIdHandler);
server.use(invalidNameHandler);
server.use(catchAllHandler);
/*
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
*/

server.listen(3003, () => {
  console.log("Running on 3003");
});
