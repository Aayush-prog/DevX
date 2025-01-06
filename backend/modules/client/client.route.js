const express = require("express");
const auth = require("../../middleware/auth");
const clientRouter = express.Router();
const clientDashboard = require("./controllers/clientDashboard");

clientRouter.use(auth);
clientRouter.get("/dashboard", clientDashboard);

module.exports = clientRouter;
