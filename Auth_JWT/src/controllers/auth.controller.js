const mongoose = require("mongoose");
const UsersCollection = require("../models/user.model");
const jwt = require("jsonwebtoken");


// refresh token -> Best practice to store refresh token in  httpOnly cookie or redis 
// acess token -> Best practice to store access token in memory


// /api/register
const userRegister = async (req, res) => {
    const { name, email, password } = req.body;


    if (!name || !email || !password) {
        return res.status(400).json({
            msg: "All fields are required"
        });
    }

    // Check if user already exists
    const userExists = await UsersCollection.findOne({ email });
    if (userExists) {
        return res.status(400).json({
            msg: "User already exists"
        });
    }

    const user = await UsersCollection.create({
        name,
        email,
        password
    });

    const userId = user._id;

    // console.log("userId : ", userId);

    const refreshToken = jwt.sign(
        { id: userId },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );

    const acessToken = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "15m" }
    );

    const inMemory = acessToken;

    res.cookie("refreshToken", refreshToken);

    res.status(201).json({
        msg: "User registered successfully",
        user,
        "acessToken": inMemory
    })
}

// /api/refresh
const refresh = async (req, res) => {

    let Token = req.cookies.refreshToken

    if (!Token) {
        return res.status(401).json({
            msg: "Unauthorized",
        })
    }

    let decode = jwt.verify(
        Token,
        process.env.JWT_SECRET
    )

    let refreshId = await UsersCollection.findById(decode.id);

    const acessToken = jwt.sign(
        { id: refreshId.id, email: refreshId.email },
        process.env.JWT_SECRET,
        { expiresIn: "15m" }
    )

    // In axios header inside
    let inHeadMemory = acessToken

    res.send({
        "token": inHeadMemory
    })

}

// /api/logout
const logout = (req, res) => {
    const Token = req.cookies

    if (!Token.refreshToken) {
        return res.send({
            msg: "unauthorized"
        })
    }

    res.clearCookie("refreshToken").clearCookie("acessToken").send({
        msg : "logout Successfully!"
    })

}

module.exports = { userRegister, refresh,logout };