const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email) throw "No email provided";
    if (!password) throw "No password provided";

    const models = [
      mongoose.model("std"),
      mongoose.model("clg"),
      mongoose.model("restro"),
      mongoose.model("admin"),
    ];

    let user = null;
    let modelName = "";

    for (const model of models) {
      user = await model.findOne({ email });
      if (user) {
        console.log(user);
        modelName = model.modelName;
        break;
      }
    }

    if (!user) throw "No such user";
    const match = await bcrypt.compare(password, user.password);
    if (!match) throw "Password does not match";
    let jwtSalt;
    switch (modelName.toLowerCase()) {
      case "std":
        jwtSalt = process.env.jwt_salt;
        break;
      case "clg":
        jwtSalt = process.env.clg_salt;
        break;
      case "restro":
        jwtSalt = process.env.restro_salt;
        break;
      case "admin":
        jwtSalt = process.env.admin_salt;
        break;
      default:
        throw "Invalid user type";
    }
    const token = jwt.sign({ _id: user._id, type: modelName }, jwtSalt);

    res.status(200).json({
      status: "success",
      token,
      userType: modelName,
    });
  } catch (e) {
    res.status(400).json({ status: "failed", msg: e });
  }
};

module.exports = login;
