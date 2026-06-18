import { Worker } from "bullmq";
import redisConfig from "../config/redis.js";
import { getProduct, updateProduct } from "../services/productService.js";
import { classifyItemCategory } from "../services/geminiService.js";

const initProductWorker = () => {
  new Worker(
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

      // Mutate the database. This acts as the final source of truth.
      await updateProduct(productId, {
        category: optimalCategory,
        isCategorized: true,
      });
    },
    {
      ...redisConfig,
      limiter: {
        max: 10,
        duration: 60000,
      },
    },
  );
};

export default initProductWorker;
