const redisURL = process.env.REDIS_URL;

const redisConfig = {
  connection: {
    url: redisURL || "redis://127.0.0.1:6379",
    // Required to bypass handshake errors on secure managed clouds like Render Key Value
    tls: process.env.REDIS_URL?.startsWith("rediss://") ? {} : undefined,
  },
};
export default redisConfig;
