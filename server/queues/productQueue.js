import { Queue } from "bullmq";
import redisClient from "../config/redis.js";

// Uses the centralized single socket descriptor layout
const productQueue = new Queue("tagging-queue", {
  connection: redisClient,
});

export default productQueue;
