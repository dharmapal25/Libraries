import app from "./src/app.js";
import Radis from "ioredis";

const PORT = process.env.PORT;

const redis = new Radis({
    port: process.env.REDIS_PORT,
    host: process.env.REDIS_HOST,
    password: process.env.REDIS_PASSWORD
});

app.get("/", async (req, res) => {
    res.send("Hello world!");

})

// Connection & Error

redis.on("connect", () => {
    console.log("Server connected to Redis!");
})

redis.on("error", (e) => {
    console.log("ERROR : ", e)
})

// ------


// set key & value
await redis.set("name", "Rahul")

// get
const name = await redis.get("name")
console.log(name) // "Rahul"

// --------


// Object to JSON --> Redis
const obj = {
    name: "Flash",
    age: 20,
    Islogin: "false"
}

await redis.set("obj", JSON.stringify(obj))

let objData = await redis.get("obj");
console.log(JSON.parse(objData));;

// -----


// expire in 1min
await redis.set("otp", "4525", "EX", 60) // 1min
console.log(await redis.get("otp"));

// -----

// rpush() — Right se add karo  ||  lpush() left se add    (list)

// await redis.rpush("fruits", "apple")
// await redis.rpush("fruits", "mango")

await redis.del("fruits");

await redis.rpush("fruits", "Orange", "greps", "banana")
console.log(await redis.llen("fruits"));
console.log(await redis.lrange("fruits", 0, -1));

// -----

await redis.del("fruits_temp"); //  fruits_temp -> fruits
await redis.rpush("fruits_temp", ["Orange", "greps", "banana"]);

// atomically rename
await redis.rename("fruits_temp", "fruits");
console.log(await redis.lrange("fruits", 0, -1));

// -----


// lpop() — Left se nikalo lpop(key),lpop(key, delete_count)

await redis.rpush("queue", "job1", "job2", "job3")
// [ job1, job2, job3 ]

const first = await redis.lpop("queue")
console.log(first)  // "job1"
// [ job2, job3 ]

const next = await redis.lpop("queue")
console.log(next)   // "job2"
// [ job3 ]

// Ek saath 2 items nikalo
await redis.rpush("queue", "a", "b", "c", "d")
const items = await redis.lpop("queue", 2)
console.log(items)  // ["a", "b"]

// --------


// exists() 
const exists = await redis.exists("fruits");

if (!exists) {
  await redis.rPush("fruits", ["Orange", "greps", "banana"]);
}

// -----


// lrange() — Items dekho (without removing)    --  lrange(key, start, stop)

await redis.rpush("students", "Rahul", "Priya", "Amit", "Sneha", "Ravi")
// [ Rahul, Priya, Amit, Sneha, Ravi ]
//    0       1      2     3      4     (positive index)
//   -5      -4     -3    -2     -1     (negative index)

// Saare items
const all = await redis.lrange("students", 0, -1)
console.log(all)   // ["Rahul", "Priya", "Amit", "Sneha", "Ravi"]

// Pehle 3
const first3 = await redis.lrange("students", 0, 2)
console.log(first3)  // ["Rahul", "Priya", "Amit"]

// Last 2
const last2 = await redis.lrange("students", -2, -1)
console.log(last2)   // ["Sneha", "Ravi"]

// Beech wale (index 1 se 3 tak)
const middle = await redis.lrange("students", 1, 3)
console.log(middle)  // ["Priya", "Amit", "Sneha"]


// lrange sirf **dekhta hai**, kuch remove nahi karta — readonly operation hai

// -----


// llen() — List ki length  -  llen(key)


await redis.rpush("tasks", "task1", "task2", "task3")

const length = await redis.llen("tasks")
console.log(length)  // 3


app.listen(PORT, () => {
    console.log("Server is running..");
})