const express = require("express");
const auth = require("../../middleware/auth");
const clientRouter = express.Router();
const clientDashboard = require("./controllers/clientDashboard");
const createJob = require("./controllers/createJob");
const delJob = require("./controllers/delJob");
const editJob = require("./controllers/editJob");

clientRouter.use(auth);
clientRouter.get("/dashboard", clientDashboard);
clientRouter.post("/createJob", createJob);
clientRouter.delete("/delJob/:jobId", delJob);
clientRouter.patch("/editJob/:jobId", editJob);
module.exports = clientRouter;
