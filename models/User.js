const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    Profile: {
        type: mongoose.Types.Schema.ObjectId,
        ref: "Profile"
    },
    Posts: [
        {
            type: mongoose.Types.Schema.ObjectId,
            ref: "Post"
        }
    ]
})

module.exports = mongoose.model("User", userSchema);