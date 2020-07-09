const { Schema, model } = require("mongoose");
const mongoose = require("mongoose");
const valid = require("validator");

const projectSchema = new Schema({
  name: {
    type: String,
  },
  description: {
    type: String,
  },
  startDate: {
    type: Date,
  },
  endDate: {
    type: Date,
  },
});

//const studentModel = mongoose.model("student", studentSchema);

//module.exports = studentModel;
module.exports = model("project", projectSchema);
