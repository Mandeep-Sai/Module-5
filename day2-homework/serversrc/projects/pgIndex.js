const express = require("express");
const db = require("../db");

const router = express.Router();

router.get("/", async (req, res) => {
  const response = await db.query(`SELECT * FROM projects`);
  res.send(response.rows);
});

router.get("/:id", async (req, res) => {
  const response = await db.query(`SELECT * FROM projects WHERE studentid=$1`, [
    req.params.id,
  ]);
  if (response.rowCount === 0) return res.status(404).send("Not Found");
  res.send(response.rows);
});

router.post("/", async (req, res) => {
  const response = await db.query(
    `INSERT INTO projects (name, description, creationdate, repourl,studentid) 
                                       Values ($1, $2, $3, $4, $5)
                                       RETURNING *`,
    [
      req.body.name,
      req.body.description,
      req.body.creationdate,
      req.body.repoUrl,
      req.body.studentId,
    ]
  );

  console.log(response);
  res.send(response.rows[0]);
});

router.put("/:id", async (req, res) => {
  try {
    let content = [];
    let query = "UPDATE projects SET ";
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
  const response = await db.query(`DELETE FROM projects WHERE _id = $1`, [
    req.params.id,
  ]);

  if (response.rowCount === 0) return res.status(404).send("Not Found");

  res.send("OK");
});

module.exports = router;
