const express = require("express");
const jobRouter = express.Router();
const getJobs = require("./controller/getJobs");
const getJobById = require("./controller/getJobById");
jobRouter.get("/", getJobs);
jobRouter.get("/getJobById/:id", getJobById);
module.exports = jobRouter;
