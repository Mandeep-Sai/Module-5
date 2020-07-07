const express = require("express");
const fs = require("fs");
const path = require("path");
const uniqid = require("uniqid");
const fse = require("fs-extra");
const multer = require("multer");
const { join } = require("path");

const upload = multer({});

const studentsFilePath = path.join(__dirname, "students.json");
const studentImagesPath = path.join(__dirname, "../../public/img/students");

const router = express.Router();

router.get("/", (req, res) => {
  const bufferFileContent = fs.readFileSync(studentsFilePath);
  const fileContent = bufferFileContent.toString();
  res.send(JSON.parse(fileContent)); // json parse used convert the html type to json type
});

router.get("/:id", (req, res) => {
  const bufferFileContent = fs.readFileSync(studentsFilePath);
  const studentsArray = JSON.parse(bufferFileContent.toString());
  const student = studentsArray.filter(
    (student) => student.id === req.params.id
  );
  res.send(student);
});

router.post("/", (req, res) => {
  console.log(req.body.email);
  const newStudent = { ...req.body, id: uniqid() };
  const bufferFileContent = fs.readFileSync(studentsFilePath);
  const studentsArray = JSON.parse(bufferFileContent.toString());
  console.log(studentsArray);
  // studentsArray.push(newStudent)
  // fs.writeFileSync(studentsFilePath ,JSON.stringify(studentsArray))
  // res.send(studentsArray)
  let count = 0;
  for (Student of studentsArray) {
    if (newStudent.email === Student.email) {
      count++;
    }
  }
  if (count === 0) {
    studentsArray.push(newStudent);
    fs.writeFileSync(studentsFilePath, JSON.stringify(studentsArray));
    res.status(201).send("ok");
  } else {
    console.log("EMAIL EXISTS");
    res.send("ERROR");
  }
});

router.post("/:id/uploadPhoto", upload.single("studentPhoto"), (req, res) => {
  console.log(studentImagesPath);
  try {
    fse.writeFile(
      join(
        studentImagesPath,
        `${req.params.id}.${req.file.originalname.split(".").pop()}`
      ),
      req.file.buffer
    );
    const bufferFileContent = fs.readFileSync(studentsFilePath);
    const studentsArray = JSON.parse(bufferFileContent.toString());

    studentsArray.forEach((student) => {
      if (student.id === req.params.id) {
        student["imageUrl"] = `http://localhost:3001/img/students/${
          req.params.id
        }.${req.file.mimetype.slice(-3)}`;
      }
    });
    fs.writeFileSync(studentsFilePath, JSON.stringify(studentsArray));
    res.send("uploaded successfully");
  } catch (error) {
    console.log(error);
  }
});

router.put("/:id", (req, res) => {
  const bufferFileContent = fs.readFileSync(studentsFilePath);
  const studentsArray = JSON.parse(bufferFileContent.toString());
  const filteredArray = studentsArray.filter(
    (element) => element.id !== req.params.id
  );
  const user = req.body;
  // user.id = req.params.id
  filteredArray.push(user);
  fs.writeFileSync(studentsFilePath, JSON.stringify(filteredArray));
  res.send("Edited Sucessfully");
});

router.delete("/:id", (req, res) => {
  const bufferFileContent = fs.readFileSync(studentsFilePath);
  const studentsArray = JSON.parse(bufferFileContent.toString());

  const filteredArray = studentsArray.filter(
    (element) => element.id !== req.params.id
  );
  fs.writeFileSync(studentsFilePath, JSON.stringify(filteredArray));
  res.send("Deleted");
});

module.exports = router;
