import express from "express";
import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

// 1. Initialize Redis connection outside of routes (Singleton pattern)
const redis = new Redis({
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: Number(process.env.REDIS_PORT) || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
});

// Redis connection event listeners
redis.on("connect", () => {
  console.log("Server connected to Redis!");
});

redis.on("error", (err) => {
  console.error("Redis connection error:", err);
});

// ----------------------------------------------------
// 2. STRING OPERATIONS
// ----------------------------------------------------

// Store a basic string value
app.post("/api/string/set", async (req, res) => {
  try {
    const { key, value } = req.body;
    await redis.set(key, value);
    res.json({ success: true, message: `Stored ${key} successfully` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Read a basic string value
app.get("/api/string/get/:key", async (req, res) => {
  try {
    const { key } = req.params;
    const value = await redis.get(key);
    res.json({ key, value });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Store JSON Objects using JSON.stringify
app.post("/api/user/save", async (req, res) => {
  try {
    const user = { name: "Flash", age: 20, isLogin: false };
    // Redis only stores strings, so convert object to string
    await redis.set("user:profile", JSON.stringify(user));
    res.json({ success: true, message: "User profile stored" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Retrieve and parse JSON Object using JSON.parse
app.get("/api/user/profile", async (req, res) => {
  try {
    const rawData = await redis.get("user:profile");
    if (!rawData) {
      return res.status(404).json({ message: "User not found" });
    }
    const parsedData = JSON.parse(rawData);
    res.json({ user: parsedData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Store temporary data with an expiry time (e.g. OTP valid for 60 seconds)
app.post("/api/otp/send", async (req, res) => {
  try {
    const otp = "4525";
    // "EX", 60 means the key will automatically delete after 60 seconds
    await redis.set("otp", otp, "EX", 60);
    res.json({ success: true, message: "OTP stored with 60s expiry" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ----------------------------------------------------
// 3. LIST OPERATIONS (FIFO Queues & Collections)
// ----------------------------------------------------

// rpush: Add elements to the end (Right side)
app.post("/api/list/rpush", async (req, res) => {
  try {
    await redis.rpush("fruits", "Orange", "Grapes", "Banana");
    res.json({ success: true, message: "Fruits added to the list" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// lpush: Add elements to the beginning (Left side)
app.post("/api/list/lpush", async (req, res) => {
  try {
    const { notification } = req.body;
    await redis.lpush("notifications", notification);
    res.json({ success: true, message: "Notification added at top" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// lpop: Remove and return the first element from the left
app.get("/api/list/lpop", async (req, res) => {
  try {
    const nextTask = await redis.lpop("notifications");
    res.json({ processedItem: nextTask });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// lrange: Read items by index range without removing them (0 to -1 reads all)
app.get("/api/list/items", async (req, res) => {
  try {
    const allFruits = await redis.lrange("fruits", 0, -1);
    res.json({ fruits: allFruits });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// llen: Get total item count in a list
app.get("/api/list/length", async (req, res) => {
  try {
    const length = await redis.llen("fruits");
    res.json({ count: length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ----------------------------------------------------
// 4. UTILITY COMMANDS (del, exists, rename)
// ----------------------------------------------------

// Check if a key exists
app.get("/api/key/exists/:key", async (req, res) => {
  try {
    const { key } = req.params;
    // Returns 1 if key exists, 0 if not
    const isPresent = await redis.exists(key);
    res.json({ exists: isPresent === 1 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a key
app.delete("/api/key/delete/:key", async (req, res) => {
  try {
    const { key } = req.params;
    await redis.del(key);
    res.json({ success: true, message: `Key ${key} deleted` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rename a key
app.post("/api/key/rename", async (req, res) => {
  try {
    const { oldKey, newKey } = req.body;
    await redis.rename(oldKey, newKey);
    res.json({ success: true, message: `Renamed ${oldKey} to ${newKey}` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ----------------------------------------------------
// 5. PRODUCTION PATTERNS
// ----------------------------------------------------

// Cache-Aside Pattern
app.get("/api/cache-aside/user/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const cacheKey = `user:${id}`;

    // 1. Check Redis Cache first
    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
      return res.json({ source: "cache", data: JSON.parse(cachedData) });
    }

    // 2. Cache Miss: Simulate database fetch
    const mockDbUser = { id, name: "Dharmapal", role: "Developer" };

    // 3. Save to Redis with 5 minutes (300 seconds) expiry
    await redis.set(cacheKey, JSON.stringify(mockDbUser), "EX", 300);

    return res.json({ source: "database", data: mockDbUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rate Limiting (Allow max 100 requests per minute per IP)
app.get("/api/rate-limit-check", async (req, res) => {
  try {
    const userIp = req.ip || "127.0.0.1";
    const limitKey = `ratelimit:${userIp}`;

    // Increment request count
    const requestCount = await redis.incr(limitKey);

    // Set expiry to 60 seconds on the first request
    if (requestCount === 1) {
      await redis.expire(limitKey, 60);
    }

    // Block if request count exceeds 100
    if (requestCount > 100) {
      return res.status(429).json({ error: "Too many requests. Please try again later." });
    }

    res.json({ allowed: true, currentRequests: requestCount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default redis;