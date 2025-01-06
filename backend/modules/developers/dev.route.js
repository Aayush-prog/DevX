const express = require("express");
const auth = require("../../middleware/auth");
const devDashboard = require("./controllers/devDashboard");
const developerRouter = express.Router();
developerRouter.use(auth);
developerRouter.get("/dashboard", devDashboard);

module.exports = developerRouter;
