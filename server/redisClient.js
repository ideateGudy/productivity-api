import Redis from "ioredis";
import "dotenv/config";

let redisClient = null;

if (process.env.NODE_ENV !== "production") {
  redisClient = new Redis({
    host: "localhost",
    port: 6379,
  });

  redisClient.on("connect", () => console.log("✅ Redis connected (Dev)"));
  redisClient.on("error", (err) => console.error("❌ Redis error:", err));
}

export default redisClient;
