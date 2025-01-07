const express = require("express");
const auth = require("../../middleware/auth");
const clientRouter = express.Router();
const clientDashboard = require("./controllers/clientDashboard");
const createJob = require("./controllers/createJob");
const delJob = require("./controllers/delJob");
const editJob = require("./controllers/editJob");

clientRouter.use(auth);
clientRouter.get("/dashboard", clientDashboard);
clientRouter.get("/createJob", createJob);
clientRouter.get("/delJob/:jobId", delJob);
clientRouter.get("/editJob/:jobId", editJob);
module.exports = clientRouter;
