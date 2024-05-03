const jwt = require("jsonwebtoken");
const Post = require("../models/Post");
const Comment = require("../models/Comment");
require("dotenv").config();

exports.commentCreate = async (req, res) => {
    try {
        // Gather PostID, and Comment to add Comment on a Post
        const { postId, comment } = req.body;

        // Validate if Both PostID, and Comment Exists
        if (!postId || !comment) {
            return res.status(402).json({
                success: false,
                message: "All Fields are Required"
            })
        }

        // Extract UserID from Token
        const token = req.cookies.token;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        // Validate UserID
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "User Not LoggedIn"
            })
        }

        // Create a New Comment
        const newComment = await Comment.create({
            user: userId,
            post: postId,
            text: comment
        });

        // Update the Post with the Newly Created Comment
        const updatedPost = await Post.findByIdAndUpdate(
            postId,
            {
                $push: {
                    comments: newComment._id
                }
            },
            { new: true }
        ).populate("likes").populate("comments").exec();

        res.status(200).json({
            success: true,
            message: "Comment Added Successfully",
            post: updatedPost
        })
    }
    catch (error) {
        console.log("An Error Occurred While Creating Comment ", error);

        res.status(500).json({
            success: false,
            message: "An Error Occurred While Creating Comment",
            error: error.message
        })
    }
}