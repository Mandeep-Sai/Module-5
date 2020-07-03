const express = require("express");
const mediaRoutes = require("./media");
const reviewsRoutes = require("./reviews");
const cors = require("cors");

const server = express();

const port = process.env.PORT;
server.use(cors());
server.use(express.json());
server.use("/media", mediaRoutes);
server.use("/reviews", reviewsRoutes);

server.listen(port, () => {
  console.log("server running on ", port);
});
