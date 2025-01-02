const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const path = require("path");
const signUp = async (req, res) => {
  const UserModel = mongoose.model("User");
  const { role } = req.params;
  const { name, email, phone, password, confirmpass } = req.body;
  const image = req.file ? path.basename(req.file.path) : null;
  console.log(req.body);
  const encPass = await bcrypt.hash(password, 10);
  try {
    const data = await UserModel.create({
      name,
      email,
      phone,
      password: encPass,
      image,
      role,
    });
    res.status(200).json({ status: "success", msg: "registered", data: data });
  } catch (e) {
    res.status(400).json({ status: "failed", msg: e.message });
    return;
  }
};

module.exports = signUp;
