const Mongoose = require("mongoose");

const productsSchema = new Mongoose.Schema({
    productName:String,
    rate : Number,
    author : {
        type : Mongoose.Schema.Types.ObjectId,
        ref : "users"
    }
})

const productCollection = Mongoose.model("products",productsSchema);
module.exports = productCollection