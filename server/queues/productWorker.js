import { Worker } from "bullmq";
import redisClient from "../config/redis.js";
import { getProduct, updateProduct } from "../services/productService.js";
import { classifyItemCategory } from "../services/geminiService.js";

const initProductWorker = () => {
  console.log("Initializing standard production BullMQ Worker...");

  return new Worker(
    "tagging-queue",
    async (job) => {
      if (job.name !== "classify-product") return;

      const { productId } = job.data;
      const product = await getProduct(productId);
      if (!product) return;

      const optimalCategory = await classifyItemCategory(
        product.name || "",
        product.description || "",
      );

      await updateProduct(productId, {
        category: optimalCategory,
        isCategorized: true,
      });
    },
    {
      connection: redisClient,
      limiter: {
        max: 10,
        duration: 60000,
      },
      drainDelay: 5,
    },
  );
};

export default initProductWorker;
