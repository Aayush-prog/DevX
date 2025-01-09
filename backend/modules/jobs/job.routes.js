const express = require("express");
const jobRouter = express.Router();
const getJobs = require("./controller/getJobs");
jobRouter.get("/", getJobs);

module.exports = jobRouter;
