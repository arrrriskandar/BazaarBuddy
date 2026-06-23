import "dotenv/config";
import express from "express";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import stripeRoutes from "./routes/stripeRoutes.js";
import cors from "cors";
import { Server } from "socket.io";
import http from "http";
import initProductWorker from "./queues/productWorker.js";
import productQueue from "./queues/productQueue.js";
import redisClient from "./config/redis.js"; // Import the client instance to disconnect it explicitly

const app = express();
const server = http.createServer(app);

const FE_URL = process.env.FE_URL || "http://localhost:3000";

const io = new Server(server, {
  cors: {
    origin: FE_URL,
    methods: ["GET", "POST"],
  },
});

const url = `https://bazaarbuddy-ev54.onrender.com`;
setInterval(() => {
  fetch(url).then(() => console.log("Self-ping successful"));
}, 600000); // 10 minutes

// Connect Database
connectDB();

const workerInstance = initProductWorker();

app.use(express.json());
app.use(cors());

// Routes
app.use("/api/user", userRoutes);
app.use("/api/product", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/review", reviewRoutes);
app.use("/api/notification", notificationRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/stripe", stripeRoutes);

const onlineUsers = new Map();

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  if (userId) onlineUsers.set(userId, socket.id);

  socket.on("send_notification", (data) => {
    const { receiverId, notification } = data;
    const recipientSocketId = onlineUsers.get(receiverId);
    if (recipientSocketId) {
      io.to(recipientSocketId).emit("receive_notification", { notification });
    }
  });

  socket.on("send_message", (data) => {
    const { receiverId, popUpMessage, newMessage, chatId } = data;
    const recipientSocketId = onlineUsers.get(receiverId);
    if (recipientSocketId) {
      io.to(recipientSocketId).emit("receive_message", {
        popUpMessage,
        newMessage,
        chatId,
      });
    }
  });

  socket.on("disconnect", () => {
    const userIdToRemove = [...onlineUsers.entries()].find(
      ([_, socketId]) => socketId === socket.id,
    )?.[0];
    if (userIdToRemove) onlineUsers.delete(userIdToRemove);
  });
});

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Optimized structural tearing system for Render Zero-Downtime lifecycle
const gracefulShutdown = async (signal) => {
  console.log(
    `Received ${signal}. Shutting down BullMQ connections gracefully...`,
  );

  try {
    // 1. Close structural wrappers
    await productQueue.close();
    if (workerInstance) {
      await workerInstance.close();
    }
    // 2. Terminate the raw background client socket pool
    await redisClient.quit();

    console.log("Redis connections closed cleanly.");
    process.exit(0);
  } catch (error) {
    console.error("Error during Redis graceful shutdown:", error);
    process.exit(1);
  }
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));
