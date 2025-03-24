import express from "express";
import connectDB from "./config/db.js";
import "dotenv/config";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import cors from "cors";
import { Server } from "socket.io";
import http from "http";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// Connect Database
connectDB();

app.use(express.json());
app.use(cors());

// Routes
app.use("/api/user", userRoutes);
app.use("/api/product", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/review", reviewRoutes);
app.use("/api/notification", notificationRoutes);

const onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  // Get userId from the query parameter
  const userId = socket.handshake.query.userId;
  console.log(`User with ID ${userId} connected`);

  // User joins with their ID
  if (userId) {
    onlineUsers.set(userId, socket.id);
    console.log(`${userId} is online`);
  }

  // Handle sending notifications
  socket.on("send_notification", (data) => {
    console.log("Notification received:", data);
    const recipientSocketId = onlineUsers.get(data.receiverId);
    if (recipientSocketId) {
      io.to(recipientSocketId).emit("receive_notification", data);
    }
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
    for (let [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        console.log(`${userId} disconnected`);
      }
    }
  });
});

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
