const express = require("express");
const jobRouter = express.Router();
const getJobs = require("./controller/getJobs");
const getJobById = require("./controller/getJobById");
const hire = require("./controller/hire");
jobRouter.get("/", getJobs);
jobRouter.get("/getJobById/:id", getJobById);
jobRouter.post("/hire/:applicationId", hire);
module.exports = jobRouter;
