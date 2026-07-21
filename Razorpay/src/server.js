require("dotenv").config();
const express = require("express");
const crypto = require("crypto");
const Razorpay = require("../config/Razorpay");

const PORT = process.env.PORT

const app = express();
app.use(express.json());
app.use(express.static('public'));


app.post("/api/order-verify", async (req, res) => {

    try {

        const { amount } = req.body

        const options = {
            amount: amount * 100, //  in paisa (₹500 = 50000)
            currency: 'INR',
            receipt: `receipt_${Date.now()}`,
        };

        const order = await Razorpay.orders.create(options);

        res.json({
            success: true,
            order
        })

    } catch (err) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }


})


app.post("/api/verify-payment",(req,res)=> {

    const { paymentId, orderId, signature } = req.body;

    // demo --- check ---
    console.log(req.body);
    res.send("Payment Successful!");
    
})

app.listen(PORT,()=> {
    console.log("Server is running..");
})