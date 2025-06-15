const mongoose = require('mongoose')
require('dotenv').config()

// const MONGO_URI = process.env.MONGO_URI

function connectToMongoDb() {
    mongoose.connect(process.env.MONGO_URI)

    mongoose.connection.on("connected" , () => {
        console.log("Connected to MongoDB")
    })

    mongoose.connection.on("error", () => {
        console.log('Fail connecting to MongoDB')
    })
}

module.exports = {
    connectToMongoDb
}