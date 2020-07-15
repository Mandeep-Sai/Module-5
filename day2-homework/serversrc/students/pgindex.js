const express = require("express");
const db = require("../db");

const router = express.Router();

router.get("/", async (req, res) => {
  const response = await db.query(`SELECT * FROM students`);
  res.send(response.rows);
});

router.get("/:id", async (req, res) => {
  const response = await db.query(`SELECT * FROM students WHERE _id=$1`, [
    req.params.id,
  ]);
  if (response.rowCount === 0) return res.status(404).send("Not Found");
  res.send(response.rows);
});

router.get("/:id/:email", async (req, res) => {
  console.log(req.params.email);
  const response = await db.query(
    `SELECT projects.name,projects.description,projects.liveurl FROM projects,students WHERE email=$1 AND projects.studentid = $2`,
    [req.params.email, req.params.id]
  );
  if (response.rowCount === 0) return res.status(404).send("Not Found");
  res.send(response.rows);
});

router.post("/", async (req, res) => {
  console.log(req.body);
  const checkMail = await db.query(`SELECT * FROM students WHERE email = $1`, [
    req.body.email,
  ]);
  if (checkMail.rowCount === 0) {
    const response = await db.query(
      `INSERT INTO students (name, surname, email, dob,country) 
                                       Values ($1, $2, $3, $4,$5)
                                       RETURNING *`,
      [
        req.body.name,
        req.body.surname,
        req.body.email,
        req.body.dateOfBirth,
        req.body.country,
      ]
    );
    console.log(response);
    res.send(response.rows[0]);
  } else {
    res.status(400).send("email exists");
  }
});

router.put("/:id", async (req, res) => {
  try {
    let content = [];
    let query = "UPDATE students SET ";
    for (element in req.body) {
      content.push(req.body[element]);
      query +=
        (content.length > 1 ? ", " : "") + element + " = $" + content.length;
    }
    content.push(req.params.id);
    query += " WHERE _id = $" + content.length + " RETURNING *";
    console.log(query);
    const result = await db.query(query, content);
    if (result.rowCount === 0) return res.status(404).send("Not Found");

    res.send(result.rows[0]);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

router.delete("/:id", async (req, res) => {
  const response = await db.query(`DELETE FROM students WHERE _id = $1`, [
    req.params.id,
  ]);

  if (response.rowCount === 0) return res.status(404).send("Not Found");

  res.send("OK");
});

module.exports = router;
