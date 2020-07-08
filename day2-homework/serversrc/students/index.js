const express = require("express");
const mongoose = require("mongoose");
const studentSchema = require("./schema");
const q2m = require("query-to-mongo");

const router = express.Router();

// GET all students
router.get("/", async (req, res) => {
  try {
    const query = q2m(req.query);
    //console.log(query);
    const students = await studentSchema
      .find()
      .limit(query.options.limit)
      .skip(query.options.skip)
      .sort(query.options.sort);
    res.send(students);
  } catch (error) {
    console.log(error);
  }
});

//GET student by ID
router.get("/:id", async (req, res) => {
  try {
    const student = await studentSchema.findById(req.params.id);
    res.send(student);
  } catch (error) {
    console.log(error);
  }
});

//POST
router.post("/", async (req, res, next) => {
  try {
    const checkEmail = await studentSchema.find({ email: req.body.email });
    //console.log(checkEmail);
    if (checkEmail.length !== 0) {
      res.status(409).send("student with same email exists");
    } else {
      const newStudent = new studentSchema(req.body);
      await newStudent.save();
      res.send("Posted Successfully");
    }
  } catch (error) {
    //next(error);
    res.send(error.errors);
  }
});

//POST checkmail
router.post("/checkEmail", async (req, res) => {
  const checkEmail = await studentSchema.find({ email: req.body.email });
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
    await studentSchema.findByIdAndUpdate(req.params.id, req.body);
    res.send("Edited Successfully");
  } catch (error) {
    console.log(error);
  }
});

//DELETE by ID
router.delete("/:id", async (req, res) => {
  try {
    await studentSchema.findByIdAndDelete(req.params.id);
    res.send("Deleted Successfully");
  } catch (error) {
    console.log(error);
  }
});
module.exports = router;
