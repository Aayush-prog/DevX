const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const path = require("path");
const nodemailer = require("nodemailer");
const signUp = async (req, res) => {
  const UserModel = mongoose.model("User");
  const resume = req.file ? path.basename(req.file.path) : null;
  try {
    const tag = await axios.get("http://localhost:8000/process-resume", {
      params: { file_url: "" },
    });
    const data = await UserModel.create({
      resume,
      tag,
    });
    res.status(200).json({ status: "success", msg: "updated tag", data: data });
  } catch (e) {
    res.status(400).json({ status: "failed", msg: e.message });
    return;
  }
};

module.exports = signUp;
