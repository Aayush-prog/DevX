const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const axios = require("axios");
const nodemailer = require("nodemailer");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();

// Routes
const login = require("./handlers/login");
const signUp = require("./handlers/signUp");
const developerRoute = require("./modules/developers/dev.routes");
const clientRoute = require("./modules/client/client.routes");
const jobsRoute = require("./modules/jobs/job.routes");
const uploadMiddleware = require("./middleware/upload");
const forgotPassword = require("./handlers/forgotPass");
const auth = require("./middleware/auth");
const user = require("./handlers/user");
const getUserByID = require("./handlers/getUserById");
const settings = require("./handlers/settings");
// Models
require("./models/userModel");
require("./models/jobModel");
require("./models/applicationModel");
require("./models/reviewModel");
require("./models/msgModel");

// Initialize Express
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  },
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(
  "/images",
  express.static(path.join(__dirname, "public/profile-pictures"))
);
app.use("/resumes", express.static(path.join(__dirname, "public/resumes")));
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));
// Database Connection
mongoose
  .connect(process.env.mongo_connect, {})
  .then(() => console.log("mongo connected"))
  .catch((e) => console.log(e));

// Routes
app.post("/login", login);
app.post("/signUp/:role", uploadMiddleware, signUp);
app.post("/settings", uploadMiddleware, settings);
app.post("/forgot-password", forgotPassword.forgotPassword);
app.post("/reset-password/:token", forgotPassword.resetPassword);
app.use("/developer", developerRoute);
app.use("/client", clientRoute);
app.use("/jobs", jobsRoute);
app.get("/getUser/:id", getUserByID);
app.use(auth);
app.get("/user", user);

// WebSocket Logic
io.on("connection", (socket) => {
  console.log("New user connected:", socket.id);

  // Handle room creation or joining
  socket.on("start_chat", async (data) => {
    const { userId1, userId2 } = data;
    const MessageModel = mongoose.model("Message");
    const UserModel = mongoose.model("User");
    const updateUser1 = await UserModel.findByIdAndUpdate(
      userId1,
      {
        $addToSet: { chats: userId2 },
      },
      { new: true }
    );

    const updateUser2 = await UserModel.findByIdAndUpdate(
      userId2,
      {
        $addToSet: { chats: userId1 },
      },
      { new: true }
    );
    // Generate a unique room ID based on user IDs
    const roomId = [userId1, userId2].sort().join("_"); // Ensures consistent room ID order
    socket.join(roomId);

    console.log(`User ${socket.id} joined room: ${roomId}`);

    // Notify other users in the room (optional)
    socket.to(roomId).emit("user_joined", { userId: userId1 });
    // Load past messages from database for this room
    try {
      const pastMessages = await MessageModel.find({ roomId }).sort({
        timestamp: 1,
      });
      socket.emit("past_messages", pastMessages);
    } catch (error) {
      console.error("Error fetching past messages:", error);
    }
  });

  // Handle sending messages
  socket.on("send_message", async (data) => {
    const { roomId, message, senderId } = data;
    const MessageModel = mongoose.model("Message");
    try {
      // Save message to DB
      const newMessage = await MessageModel.create({
        roomId,
        senderId,
        message,
      });

      io.to(roomId).emit("receive_message", {
        senderId,
        message,
        messageId: newMessage._id,
      });
      console.log(`Message saved to db and sent to room ${roomId}: ${message}`);
    } catch (error) {
      console.error("Error saving message to database:", error);
      // consider informing user that the message was not saved.
    }
  });
  // Handle file upload
  socket.on("send_media", async (data) => {
    const { roomId, senderId, fileData, fileType, fileName } = data;
    const MessageModel = mongoose.model("Message");
    try {
      if (!fileData) {
        console.error("File data is missing.");
        return;
      }

      // Generate file path and name
      const filePath = path.join(
        __dirname,
        "public/uploads",
        Date.now() + "-" + fileName
      );

      // Create a buffer from the base64 data
      const buffer = Buffer.from(fileData, "base64");

      // Write the file to the disk
      await fs.writeFile(filePath, buffer);
      console.log("File saved successfully:", filePath);

      // Generate a URL from the file
      const mediaUrl = `${path.basename(filePath)}`;

      // Save message metadata to the DB
      const newMediaMessage = await MessageModel.create({
        roomId,
        senderId,
        mediaUrl,
      });

      // Emit to the room
      io.to(roomId).emit("receive_media", {
        senderId,
        mediaUrl,
        messageId: newMediaMessage._id,
      });
      console.log("Media metadata saved to db.");
    } catch (error) {
      console.error("Error saving media to database:", error);
    }
  });
  // Handle client disconnection
  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// Start the server
server.listen(8000, () => {
  console.log("Server started on port 8000");
});
