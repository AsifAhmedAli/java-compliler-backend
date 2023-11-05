const router = require("./routes/routes");
const express = require("express");
const crypto = require("crypto");
const cors = require("cors");
const { Router } = require("express");
const cookieParser = require("cookie-parser");
const socketio = require("socket.io");
const http = require("http");
// var bodyParser = require("body-parser");
// var multer = require("multer");
// var upload = multer();

// const conn = require("./conn/conn");
require("dotenv").config();

const app = express();
const server = http.createServer(app);
io = socketio(server);
app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// app.use(bodyParser.json());

// // for parsing application/xwww-
// app.use(bodyParser.urlencoded({ extended: true }));
// //form-urlencoded

// // for parsing multipart/form-data
// app.use(upload.array());
// app.use(express.static("public"));
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

const port = 3000;

app.use("/", router);
server.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});
