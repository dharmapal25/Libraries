const express = require("express");
require("dotenv").config();
const app = express();
const cookieParser = require("cookie-parser");
const authRouter = require("./Routers/auth.router");

app.use(express.json());
app.use(cookieParser());

app.use("/api",authRouter);

app.get("/", (req, res) => {
    res.send("Hello world!");
    
});



module.exports = app;