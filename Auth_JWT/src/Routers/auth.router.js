const express = require("express");
const authRouter = express.Router();
const { userRegister } = require("../controllers/auth.controller");


authRouter.post("/register", userRegister);

module.exports = authRouter;