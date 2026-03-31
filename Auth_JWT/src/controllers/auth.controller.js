const mongoose = require("mongoose");
const UsersCollection = require("../models/user.model");
const jwt = require("jsonwebtoken");

const userRegister = async (req, res) => {
    const { name, email, password } = req.body;


    if (!name || !email || !password) {
        return res.status(400).json({
            msg: "All fields are required"
        });
    }

    // Check if user already exists
    const userExists = await UsersCollection.findOne({ email });
    // if (userExists) {
    //     return res.status(400).json({
    //         msg: "User already exists"
    //     });
    // }

    const refreshToken = jwt.sign(
        { id : userExists._id },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );

    const acessToken = jwt.sign(
        { id : userExists._id, email: userExists.email },
        process.env.JWT_SECRET,
        { expiresIn: "15m" }
    );


    res.cookie("refreshToken", refreshToken);




    const user = await UsersCollection.create({
        name,
        email,
        password
    });

    res.status(201).json({
        msg: "User registered successfully",
        userExists,
        acessToken,
    })

}


module.exports = { userRegister }