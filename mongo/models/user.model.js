const Mongoose = require("mongoose");

const usersSchema = new Mongoose.Schema({
    user:String,
    age : Number
})

const userCollection = Mongoose.model("users",usersSchema);

module.exports = userCollection