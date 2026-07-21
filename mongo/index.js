require("dotenv").config()
const express = require("express");
const mongoDBConnection = require("./config/db");
const productCollection = require("./models/products.model");
const userCollection = require("./models/user.model");

const app = express();
app.use(express.json());

mongoDBConnection();

// new user

app.post("/users", async (req, res) => {
    try {
        const { user, age } = req.body

        const newUser = await userCollection.create({
            user, age
        });

        res.json(newUser);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


app.post("/products", async (req, res) => {

    const { productName, rate, author } = req.body

    try {
        // create product, save only the user's id in "author" field
        let product = await productCollection.create({
            productName, rate, author   // this is the user's _id
        });

        // get full user details
        product = await product.populate("author");

        res.json(product);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all products WITHOUT populate (only author id will show)
app.get("/products/raw", async (req, res) => {
    const products = await productCollection.find();
    res.json(products);
});

// Get all products WITH populate (full author details will show)
app.get("/products", async (req, res) => {
    const products = await productCollection.find().populate("author");
    res.json(products);
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});