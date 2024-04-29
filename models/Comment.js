const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    text: {
        type: String
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post"
    }
})

module.exports = mongoose.model("Comment", commentSchema);