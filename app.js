const express = require("express");
const bodyParser = require("body-parser");
const feedRoutes = require("./routes/feed");
const mongoose = require("mongoose");
const app = express();
const path = require("path");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");

const MONGODB_URI =
  "mongodb+srv://thaihoang03082003:123@cluster0.e45cmto.mongodb.net/feed";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      new Date().toISOString().toString().replaceAll(":", "-") +
        "-" +
        file.originalname
    );
  },
});

// file filter whether file is images
//
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  )
    cb(null, true);
  else cb(null, false);
};

// parser body of request
app.use(bodyParser.json());

// set name of file and filter whether this file is images, upload file through "req.file"
app.use(multer({ storage: storage, fileFilter: fileFilter }).single("image"));

// public some folder
app.use("/images", express.static(path.join(__dirname, "images")));

// configuring access permission
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/feed", feedRoutes);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  res.status(status).json({ message: message });
});

const main = async () => {
  await mongoose.connect(MONGODB_URI);
  app.listen(8080, (error) => {
    console.log("server running on : http://localhost8080");
  });
};

main();
