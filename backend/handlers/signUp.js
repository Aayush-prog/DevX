const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const path = require("path");
const nodemailer = require("nodemailer");
const signUp = async (req, res) => {
  const UserModel = mongoose.model("User");
  const { role } = req.params;
  const { name, email, description, phone, password, confirmpass } = req.body;
  const image = req.file ? path.basename(req.file.path) : null;
  console.log(req.body);
  const encPass = await bcrypt.hash(password, 10);
  try {
    const data = await UserModel.create({
      name,
      description,
      email,
      phone,
      password: encPass,
      image,
      role,
    });
    // Send Welcome Email
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Welcome to Our Platform!",
      html: `<h1>Welcome, ${name}!</h1>
             <p>Thank you for registering on our platform. We are thrilled to have you here!</p>
             <p>If you have any questions or need assistance, feel free to contact us.</p>
             <p>Best regards,<br>DevX</p>`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Error sending email:", error);
      } else {
        console.log("Email sent:", info.response);
      }
    });
    res.status(200).json({ status: "success", msg: "registered", data: data });
  } catch (e) {
    res.status(400).json({ status: "failed", msg: e.message });
    return;
  }
};

module.exports = signUp;
