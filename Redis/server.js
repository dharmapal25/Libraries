import app from "./src/app.js";
import Radis from "ioredis";

const PORT = process.env.PORT;

const redis = new Radis({
    port : process.env.REDIS_PORT,
    host : process.env.REDIS_HOST,
    password : process.env.REDIS_PASSWORD
});

app.get("/", async (req, res) => {
    res.send("Hello world!");

  
})

redis.on("connect",()=> {
   console.log("Server connected to Redis!");
})

redis.on("error",(e)=> {
    console.log("ERROR : ",e)
})


await redis.set("name", "Rahul")


const name = await redis.get("name")
console.log(name) // "Rahul"



app.listen(PORT, () => {
    console.log("Server is running..");
})