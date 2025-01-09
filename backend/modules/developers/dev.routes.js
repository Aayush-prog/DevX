const express = require("express");
const auth = require("../../middleware/auth");
const devDashboard = require("./controllers/devDashboard");
const getDev = require("./controllers/getDev");
const getDevById = require("./controllers/getDevById");
const developerRouter = express.Router();

developerRouter.get("/", getDev);
developerRouter.get("/:id", getDevById);
developerRouter.use(auth);
developerRouter.get("/dashboard", devDashboard);

module.exports = developerRouter;
