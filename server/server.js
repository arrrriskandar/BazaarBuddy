import express from "express";
import connectDB from "./config/db.js";
import "dotenv/config";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
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
app.use("/api/chat", chatRoutes);

const onlineUsers = new Map();

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;

  if (userId) {
    onlineUsers.set(userId, socket.id);
  }

  // Handle sending notifications
  socket.on("send_notification", (data) => {
    const { receiverId, message } = data;
    const recipientSocketId = onlineUsers.get(receiverId);

    if (recipientSocketId) {
      io.to(recipientSocketId).emit("receive_notification", { message });
    }
  });

  // Handle sending notifications
  socket.on("send_message", (data) => {
    const { receiverId, popUpMessage, newMessage } = data;
    const recipientSocketId = onlineUsers.get(receiverId);

    if (recipientSocketId) {
      io.to(recipientSocketId).emit("receive_message", {
        popUpMessage,
        newMessage,
      });
    }
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    const userIdToRemove = [...onlineUsers.entries()].find(
      ([, socketId]) => socketId === socket.id
    )?.[0];

    if (userIdToRemove) {
      onlineUsers.delete(userIdToRemove);
    }
  });
});

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
