const express = require("express");
const getQuestion = require("./controller/getQuestion");
const checkAns = require("./controller/checkAns");
const uploadQuestion = require("./controller/uploadQuestion");
const questionRouter = express.Router();

questionRouter.get("/", getQuestion);
questionRouter.post("/check", checkAns);
questionRouter.post("/upload", uploadQuestion);
module.exports = questionRouter;
