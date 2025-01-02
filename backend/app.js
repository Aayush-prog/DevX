const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const axios = require("axios");

require("dotenv").config();
//routes
const login = require("./handlers/login");
const signUp = require("./handlers/signUp");
const developerRoute = require("./modules/developers/dev.route");
const clientRoute = require("./modules/client/client.route");
const jobsRoute = require("./modules/jobs/job.route");
//models
require("./models/userModel");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/images", express.static(path.join(__dirname, "public/images")));

mongoose
  .connect(process.env.mongo_connect, {})
  .then(() => console.log("mongo connected"))
  .catch((e) => console.log(e));

app.post("/login", login);
app.post("/signUp", signUp);
// app.use();
app.listen(8000, () => {
  console.log("server started");
});
