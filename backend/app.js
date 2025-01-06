const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const axios = require("axios");
const nodemailer = require("nodemailer");
require("dotenv").config();
//routes
const login = require("./handlers/login");
const signUp = require("./handlers/signUp");
const developerRoute = require("./modules/developers/dev.route");
const clientRoute = require("./modules/client/client.route");
const jobsRoute = require("./modules/jobs/job.route");
const uploadMiddleware = require("./middleware/upload");
const forgotPassword = require("./handlers/forgotPass");
//models
require("./models/userModel");

const app = express();
app.use(cors());
app.use(express.json());
app.use(
  "/images",
  express.static(path.join(__dirname, "public/profile-pictures"))
);
app.use("/resumes", express.static(path.join(__dirname, "public/resumes")));
mongoose
  .connect(process.env.mongo_connect, {})
  .then(() => console.log("mongo connected"))
  .catch((e) => console.log(e));

app.post("/login", login);
app.post("/signUp/:role", uploadMiddleware, signUp);
app.post("/forgot-password", forgotPassword.forgotPassword);
app.post("/reset-password/:token", forgotPassword.resetPassword);
// app.use();
app.listen(8000, () => {
  console.log("server started");
});
