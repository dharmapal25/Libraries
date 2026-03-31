const express = require("express");
const authRouter = express.Router();
const { userRegister,refresh,logout } = require("../controllers/auth.controller");


authRouter.post("/register", userRegister);

authRouter.get("/refresh", refresh);

authRouter.get("/logout",logout);

module.exports = authRouter;