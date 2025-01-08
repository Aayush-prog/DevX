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
const developerRoute = require("./modules/developers/dev.route");
const clientRoute = require("./modules/client/client.route");
const jobsRoute = require("./modules/jobs/job.route");
const uploadMiddleware = require("./middleware/upload");
const forgotPassword = require("./handlers/forgotPass");
const auth = require("./middleware/auth");
const user = require("./handlers/user");

// Models
require("./models/userModel");
require("./models/jobModel");

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

// Database Connection
mongoose
  .connect(process.env.mongo_connect, {})
  .then(() => console.log("mongo connected"))
  .catch((e) => console.log(e));

// Routes
app.post("/login", login);
app.post("/signUp/:role", uploadMiddleware, signUp);
app.post("/forgot-password", forgotPassword.forgotPassword);
app.post("/reset-password/:token", forgotPassword.resetPassword);
app.use("/developer", developerRoute);
app.use("/client", clientRoute);

app.use(auth);
app.get("/user", user);

// WebSocket Logic
io.on("connection", (socket) => {
  console.log("New user connected:", socket.id);

  // Handle room creation or joining
  socket.on("start_chat", (data) => {
    const { userId1, userId2 } = data;

    // Generate a unique room ID based on user IDs
    const roomId = [userId1, userId2].sort().join("_"); // Ensures consistent room ID order
    socket.join(roomId);

    console.log(`User ${socket.id} joined room: ${roomId}`);

    // Notify other users in the room (optional)
    socket.to(roomId).emit("user_joined", { userId: userId1 });
  });

  // Handle sending messages
  socket.on("send_message", (data) => {
    const { roomId, message, senderId } = data;

    console.log(`Message sent to room ${roomId}: ${message}`);
    io.to(roomId).emit("receive_message", { senderId, message });
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
