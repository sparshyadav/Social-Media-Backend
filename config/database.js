const mongoose = require("mongoose");
require("dotenv").config();

exports.connectDatabase = () => {
    mongoose.connect(process.env.DATABASE_URL)
        .then(console.log("Database Connection Sucessfull"))
        .catch((error) => {
            console.log("An Error Occurred While Connection Database");
            console.log(error);
        })
}