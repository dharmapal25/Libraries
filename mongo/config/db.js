const mongo = require("mongoose");

const mongoDBConnection = async ()=> {
    try{
        await mongo.connect(process.env.MONGO_URI)
        console.log("Database connected")

    }catch(err) {
        console.log("Database connection fail")
    }
}

module.exports = mongoDBConnection