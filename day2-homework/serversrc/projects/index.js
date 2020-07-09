const express = require("express");
const mongoose = require("mongoose");
const q2m = require("query-to-mongo");
const projectSchema = require("./schema");

const router = express.Router();

// GET all projects
router.get("/", async (req, res) => {
  try {
    const query = q2m(req.query);
    //console.log(query);
    const projects = await projectSchema
      .find()
      .limit(query.options.limit)
      .skip(query.options.skip)
      .sort(query.options.sort);
    res.send(projects);
  } catch (error) {
    console.log(error);
  }
});

//GET project by ID
router.get("/:id", async (req, res) => {
  try {
    const project = await projectSchema.findById(req.params.id);
    res.send(project);
  } catch (error) {
    console.log(error);
  }
});

//POST
router.post("/", async (req, res, next) => {
  try {
    console.log(req.body);
    const newProject = new projectSchema(req.body);
    await newProject.save();
    res.send(req.body);
  } catch (error) {
    //next(error);
    res.send(error.errors);
  }
});

//POST checkmail
router.post("/checkEmail", async (req, res) => {
  const checkEmail = await projectSchema.find({ email: req.body.email });
  console.log(checkEmail);
  if (checkEmail.length !== 0) {
    res.send("student with same email exists");
  } else {
    res.send("email available");
  }
});

//EDIT or PUT by ID
router.put("/:id", async (req, res) => {
  try {
    await projectSchema.findByIdAndUpdate(req.params.id, req.body);
    res.send("Edited Successfully");
  } catch (error) {
    console.log(error);
  }
});

//DELETE by ID
router.delete("/:id", async (req, res) => {
  try {
    await projectSchema.findByIdAndDelete(req.params.id);
    res.send("Deleted Successfully");
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
