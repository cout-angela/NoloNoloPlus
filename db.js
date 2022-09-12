const mongoose = require("mongoose");
const dbString = require('./dbString')

module.exports = async function connection() {
    try {
        await mongoose.connect(dbString);
        console.log("connected to database");
    } catch (error) {
        console.log("could not connect to database");
        console.log(error);
    }
};