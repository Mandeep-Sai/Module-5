const express = require("express");
require("dotenv").config();
const attendeesRoutes = require("./attendees");

const server = express();

const port = process.env.PORT;

server.use(express.json());
server.use("/attendees", attendeesRoutes);

server.listen(port, () => {
  console.log(`Server running on ${port}`);
});
