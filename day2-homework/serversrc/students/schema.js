const { Schema, model } = require("mongoose");

const studentSchema = new Schema({
  name: String,
  surname: String,
  email: String,
  dateOfBirth: String,
  country: String,
});

module.exports = model("student", studentSchema);
