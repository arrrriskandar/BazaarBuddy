import express from "express";
import connectDB from "./config/db.js";
import "dotenv/config";
import userRoutes from "./routes/userRoutes.js";

const app = express();

// Connect Database
connectDB();

app.use(express.json());

// Routes
app.use("/api/user", userRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
