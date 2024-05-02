const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post"
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    isLiked:{
        type: Boolean, 
        default: false
    }
})

module.exports = mongoose.model("Like", likeSchema);