const express = require("express");
require("dotenv").config();
const attendeesRoutes = require("./attendees");
const mongoose = require("mongoose");
const cors = require("cors");

const server = express();

const port = process.env.PORT;
server.use(cors());
server.use(express.json());
server.use("/attendees", attendeesRoutes);

mongoose
  .connect("mongodb://localhost:27017/LinkedIn", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(
    server.listen(port, () => {
      console.log("Running on port", port);
    })
  );
