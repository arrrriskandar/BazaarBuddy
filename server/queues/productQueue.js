import { Queue } from "bullmq";
import redisConfig from "../config/redis.js";

// Registers 'tagging-queue' directly within the Redis memory layout
const productQueue = new Queue("tagging-queue", redisConfig);

export default productQueue;
