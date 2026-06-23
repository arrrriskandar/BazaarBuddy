import Redis from "ioredis";

const redisURL = process.env.REDIS_URL || "redis://127.0.0.1:6379";

// Instantiate a single structural client instance
const redisClient = new Redis(redisURL, {
  maxRetriesPerRequest: null, // Mandatory option required by BullMQ
});

export default redisClient;
