# 📚 Libraries — Redis Practice Project

> **Node.js + Express + Redis (ioredis) — Hinglish Documentation**

![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=flat&logo=redis&logoColor=white)
![ES Modules](https://img.shields.io/badge/ES%20Modules-F7DF1E?style=flat&logo=javascript&logoColor=black)

---

## 📑 Table of Contents

- [Redis Kya Hai?](#-redis-kya-hai)
- [Production Mein Redis Setup](#-production-mein-redis-db-kaise-setup-karein)
- [Project Setup](#-project-setup)
- [Redis Methods — Explain + Examples](#-redis-methods--explain--examples)
- [System Design — Production Architecture](#️-system-design--production-architecture)
- [Quick Reference](#-quick-reference)

---

## 🔴 Redis Kya Hai?

Redis ek **open-source, in-memory data structure store** hai. Matlab ye data ko hard disk mein nahi, seedha **RAM (memory)** mein store karta hai — isliye ye bahut fast hota hai.

**Isko 3 cheezoin ke liye use karte hain:**
- **Cache** — Database ka response temporarily store karna
- **Session Store** — User login sessions rakhna
- **Message Queue** — Background jobs aur tasks manage karna

**Simple analogy:**

| | Kya hai | Speed |
|---|---|---|
| 🗄️ Database (MongoDB/MySQL) | Almirah — sab kuch permanently store | Dhundne mein time lagta hai |
| ⚡ Redis | Table ke upar rakhi cheez — temporary | Turant milti hai |

---

## 🏭 Production Mein Redis DB Kaise Setup Karein?

### Option 1 — Redis Cloud ⭐ (Recommended)

Sabse aasan, **free tier** available hai:

1. [redis.io/try-free](https://redis.io/try-free) par jaao
2. Free account banao
3. New Database create karo
4. **Host, Port aur Password** copy karo
5. `.env` file mein paste karo

### Option 2 — Railway / Render (Easy Deploy)

- [Railway.app](https://railway.app) ya [Render.com](https://render.com) par Redis plugin/service add karo
- Auto-generate hoga — `REDIS_URL` copy karo
- ioredis mein URL se connect karo:

```js
const redis = new Redis(process.env.REDIS_URL)
```

### Option 3 — AWS ElastiCache / GCP Memorystore

Large scale production ke liye managed Redis services:

- **AWS ElastiCache** — Amazon ka managed Redis
- **GCP Memorystore** — Google Cloud ka Redis
- Dono VPC ke andar hote hain — extra security

### .env File Setup

```env
PORT=3000
REDIS_HOST=redis-12345.c1.asia-northeast1-1.gce.cloud.redislabs.com
REDIS_PORT=12345
REDIS_PASSWORD=yourStrongPasswordHere
```

---

## 🚀 Project Setup

### Installation

```bash
git clone https://github.com/dharmapal25/Libraries.git
cd Libraries
npm install
```

### Dependencies

| Package | Version | Kaam |
|---------|---------|------|
| `express` | latest | HTTP server banane ke liye |
| `ioredis` | latest | Redis se connect karne ke liye |
| `dotenv` | latest | Environment variables load karne ke liye |

### Project Structure

```
Libraries/
  ├── src/
  │   └── app.js          ← Express app
  ├── server.js            ← Entry point (Redis + Server)
  ├── .env                ← Environment variables
  ├── package.json        ← ES Module (type: module)
  └── README.md
```

### Server Start Karo

```bash
node server.js
```

Ye messages dikhenge agar sab sahi hai:

```
Server connected to Redis!
Server is running on port 3000
```

---

## 📋 Redis Methods — Explain + Examples

### 1. String Commands

#### `set()` aur `get()`

Sabse basic operation — ek key mein ek value store karo.

```js
await redis.set("name", "Rahul")

const name = await redis.get("name")
console.log(name)  // "Rahul"
```

---

#### JSON Object Store Karna

Redis sirf strings store karta hai — object ko pehle `JSON.stringify` karo, wapas lete waqt `JSON.parse` karo.

```js
const obj = { name: "Flash", age: 20, isLogin: "false" }

await redis.set("obj", JSON.stringify(obj))

const data = await redis.get("obj")
console.log(JSON.parse(data))  // { name: "Flash", age: 20, isLogin: "false" }
```

---

#### `set()` with Expiry — OTP ke liye

`EX` parameter se seconds mein expiry set hoti hai.

```js
await redis.set("otp", "4525", "EX", 60)
// 60 seconds ke baad ye key automatically delete ho jaayegi
```

| Parameter | Matlab |
|-----------|--------|
| `"otp"` | Key ka naam |
| `"4525"` | Store hone wali value |
| `"EX"` | Expiry type (seconds) |
| `60` | 60 seconds = 1 minute |

---

### 2. List Commands

#### `rpush()` — Right se Add

List ke **end** mein item add karo. Pehla item pehle rehta hai — **FIFO queue** jaisa.

```js
await redis.rpush("fruits", "Orange", "greps", "banana")
// List: [ "Orange", "greps", "banana" ]
//        LEFT ←————————————————→ RIGHT
```

---

#### `lpush()` — Left se Add

List ke **beginning** mein item add karo. Latest item hamesha pehle aata hai.

```js
await redis.lpush("notifications", "New message")
await redis.lpush("notifications", "New like")
// List: [ "New like", "New message" ]  ← naya pehle
```

---

#### `lpop()` — Left se Remove

List ke sabse **pehle item** ko nikalo aur return karo. Queue processing ke liye.

```js
await redis.rpush("queue", "job1", "job2", "job3")

const first = await redis.lpop("queue")   // "job1"
const next  = await redis.lpop("queue")   // "job2"

// Ek saath multiple nikalo
const items = await redis.lpop("queue", 2)  // ["a", "b"]
```

---

#### `lrange()` — Items Dekho (Without Removing)

List ke items dekhne ke liye — **kuch delete nahi hota**. Start aur stop index do.

```js
await redis.rpush("students", "Rahul", "Priya", "Amit", "Sneha", "Ravi")
//  Index:   0       1       2       3       4    (positive)
//           -5      -4      -3      -2      -1   (negative)

const all    = await redis.lrange("students", 0, -1)   // saare
const first3 = await redis.lrange("students", 0, 2)    // pehle 3
const last2  = await redis.lrange("students", -2, -1)  // last 2
const middle = await redis.lrange("students", 1, 3)    // beech wale
```

---

#### `llen()` — List Ki Length

Kitne items hain list mein — sirf **count** return karta hai.

```js
await redis.rpush("tasks", "task1", "task2", "task3")

const length = await redis.llen("tasks")
console.log(length)  // 3
```

---

### 3. Utility Commands

#### `del()` — Key Delete Karo

Existing key ko delete karo. List reset karne se pehle use karo.

```js
await redis.del("fruits")
// Ab "fruits" key exist nahi karti
```

---

#### `exists()` — Key Hai Ya Nahi

`1` return karta hai agar key exist karti hai, `0` agar nahi.

```js
const exists = await redis.exists("fruits")

if (!exists) {
  await redis.rpush("fruits", "Orange", "greps", "banana")
}
```

---

#### `rename()` — Key Ka Naam Badlo

Ek key ko **atomically** doosre naam se rename karo. Temporary keys ke liye useful.

```js
await redis.rpush("fruits_temp", "Orange", "greps", "banana")
await redis.rename("fruits_temp", "fruits")
// fruits_temp ab exist nahi karti, fruits mein data aa gaya
```

---

### 4. Connection Events

Redis connection ke do important events hote hain:

```js
redis.on("connect", () => {
  console.log("Server connected to Redis!")
})

redis.on("error", (e) => {
  console.log("ERROR : ", e)
})
```

| Event | Kab fire hota hai |
|-------|-------------------|
| `"connect"` | Redis se successfully connected hone par |
| `"error"` | Connection fail ya koi error aane par |

---

## 🏗️ System Design — Production Architecture

### Overall Architecture

Production mein Redis ko directly database ki jagah nahi, balki ek **caching/helper layer** ki tarah use karte hain:

```
  [Client / Browser]
        ↓
  [Load Balancer]          ← Traffic distribute karta hai
        ↓
  [Node.js Servers]        ← Multiple instances (horizontal scaling)
     ↙         ↘
 [Redis]    [MongoDB/PostgreSQL]
  (Cache)      (Primary Database)
```

---

### Caching Strategy — Cache-Aside Pattern

Sabse common pattern production mein:

```
Request aaya → Redis mein dhundo (Cache Hit?)
     ↓ Nahi mila (Cache Miss)
MongoDB/DB se data lao
     ↓
Redis mein save karo (next time fast milega)
     ↓
Client ko response bhejo
```

```js
async function getUser(userId) {
  const cached = await redis.get(`user:${userId}`)
  if (cached) return JSON.parse(cached)           // ✅ Cache hit — fast

  const user = await db.findById(userId)          // 🐢 DB se lao
  await redis.set(`user:${userId}`, JSON.stringify(user), "EX", 300)
  return user
}
```

---

### Session Management

User login ke baad session Redis mein store karte hain:

```js
await redis.hset(`session:${userId}`, {
  token: "abc123",
  role: "admin",
  loginTime: Date.now()
})
await redis.expire(`session:${userId}`, 3600)  // 1 hour
```

---

### Rate Limiting

Ek user ek minute mein kitni baar request kar sakta hai — Redis se track karo:

```js
async function rateLimit(ip) {
  const key = `ratelimit:${ip}`
  const count = await redis.incr(key)
  if (count === 1) await redis.expire(key, 60)
  return count > 100  // true = block karo
}
```

---

### Job Queue (Email / Notification)

```js
// Producer — job daalo
await redis.rpush("email:queue", JSON.stringify({ to: "a@b.com", subject: "Welcome" }))

// Consumer — job uthao aur process karo
while (true) {
  const job = await redis.lpop("email:queue")
  if (!job) break
  await sendEmail(JSON.parse(job))
}
```

---

### Production Best Practices

| Practice | Kyun Zaroori Hai |
|----------|-----------------|
| Redis ko route ke **bahar** init karo | Har request par naya connection nahi banega |
| Hamesha **expiry set karo** (`EX`) | Memory overflow nahi hogi |
| **Error event** handle karo | Server crash hone se bachega |
| Keys meaningful rakho (`user:1`) | Debug aur manage karna aasaan hoga |
| `JSON.stringify` / `JSON.parse` use karo | Objects correctly store honge |
| `REDIS_URL` env mein rakho | Credentials code mein nahi aayenge |

---

## ⚡ Quick Reference

| Command | Kaam | Example |
|---------|------|---------|
| `set(key, val)` | Value store karo | `redis.set("name", "Rahul")` |
| `get(key)` | Value lao | `redis.get("name")` |
| `set(..., "EX", n)` | Expiry ke saath store | `redis.set("otp", "123", "EX", 60)` |
| `del(key)` | Key delete karo | `redis.del("fruits")` |
| `exists(key)` | Key hai ya nahi | `redis.exists("fruits")` |
| `rpush(key, ...)` | List mein right se add | `redis.rpush("q", "job1")` |
| `lpush(key, ...)` | List mein left se add | `redis.lpush("q", "item")` |
| `lpop(key)` | Left se nikalo | `redis.lpop("queue")` |
| `lrange(k, s, e)` | Items dekho (readonly) | `redis.lrange("list", 0, -1)` |
| `llen(key)` | List ki length | `redis.llen("tasks")` |
| `rename(old, new)` | Key rename karo | `redis.rename("temp", "final")` |

---

<div align="center">

Made with ❤️ by [dharmapal25](https://github.com/dharmapal25)

</div>