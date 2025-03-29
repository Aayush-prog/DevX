const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const path = require("path");
const nodemailer = require("nodemailer");
const axios = require("axios");

// Transporter created here to be reused.
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
const settings = async (req, res) => {
  console.log("here in settings");
  const UserModel = mongoose.model("User");
  const { name, email, description, phone, password, companyName } = req.body;

  // Get the image path if a new image is provided
  let image;
  if (req.files?.image && req.files.image.length > 0) {
    image = path.basename(req.files.image[0].path);
  }

  // Access the uploaded CV
  const resume = req.files?.resume?.[0]
    ? path.basename(req.files.resume[0].path)
    : null;
  const encPass = await bcrypt.hash(password, 10);
  try {
    const userExists = await UserModel.findOne({ email });
    if (!userExists) {
      return res
        .status(400)
        .json({ message: "User with that email doesnot exists." });
    }
    let userData;
    // Handle candidate signup with resume processing logic.

    if (userExists.role === "developer" && resume) {
      try {
        const fileURL = `http://localhost:8000/resumes/${resume}`;
        const encodedURL = encodeURIComponent(fileURL);
        const response = await axios.get(
          `http://127.0.0.1:8001/process-resume?file_url=${encodedURL}`
        );
        console.log(response.data);
        const tag = req.body.role;
        const skills = req.body.skills;
        const rate = req.body.rate;
        const { github, linkedIn, portfolio, location } = req.body;
        const tools = JSON.parse(req.body.tools);
        const softSkills = JSON.parse(req.body.softSkills);
        let updateData = {
          name,
          description,
          email,
          phone,
          password: encPass,
          resume,
          tag,
          rate,
          skills,
          location,
          github,
          linkedIn,
          portfolio,
          tools,
          softSkills,
        };
        if (image) {
          updateData.image = image;
        }
        userData = await UserModel.findByIdAndUpdate(req.user._id, updateData);
      } catch (e) {
        console.log("Error parsing resume ", e);
        return res.status(500).json({
          status: "failed",
          msg: "Failed to process resume.",
        });
      }
    } else if (userExists.role === "developer" && !resume) {
      try {
        const rate = req.body.rate;
        const { github, linkedIn, portfolio, location } = req.body;
        const tools = JSON.parse(req.body.tools);
        const softSkills = JSON.parse(req.body.softSkills);
        let updateData = {
          name,
          description,
          email,
          phone,
          password: encPass,
          rate,
          location,
          github,
          linkedIn,
          portfolio,
          tools,
          softSkills,
        };
        if (image) {
          updateData.image = image;
        }
        userData = await UserModel.findByIdAndUpdate(req.user._id, updateData);
      } catch (e) {
        console.log("Error parsing resume ", e);
        return res.status(500).json({
          status: "failed",
          msg: e,
        });
      }
    } else {
      // Handle other signup scenarios
      let org;
      if (userExists.role === "client" && companyName) {
        org = companyName;
      }
      let updateData = {
        name,
        description,
        email,
        phone,
        password: encPass,
        org,
      };
      if (image) {
        updateData.image = image;
      }
      userData = await UserModel.findByIdAndUpdate(req.user._id, updateData);
    }
    // Send Welcome Email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Details Changed!",
      html: `<h1>Hello, ${name}!</h1>
               <p>Your details have been updated.</p>
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
    res.status(200).json({ status: "success", msg: "updated", data: userData });
  } catch (e) {
    console.error("Signup error:", e);
    if (e.name === "ValidationError") {
      return res
        .status(400)
        .json({ status: "failed", msg: "Validation error:" + e.message });
    }
    return res.status(500).json({ status: "failed", msg: "Update failed." });
  }
};

module.exports = settings;
