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

exports.commentUpdate = async (req, res) => {
    try {
        const { postId, commentId, comment } = req.body;
        console.log("postID", postId);
        console.log("postID", commentId);
        console.log(comment)

        if (!postId, !commentId || !comment) {
            return res.status(401).json({
                success: false,
                message: "All Fields Are Required"
            })
        }

        const updatedComment = await Comment.findOneAndUpdate(
            { post: postId, _id: commentId },
            {
                $set: {
                    text: comment
                }
            },
            { new: true }
        )

        res.status(200).json({
            success: true,
            message: "Comment Updated Successfully",
            comment: updatedComment
        })
    }
    catch (error) {
        console.log("An Error Occurred While Updating Comment", error);

        res.status(500).json({
            success: false,
            message: "An Error Occurred While Updating Comment",
            error: error.message
        })
    }
}

exports.commentDelete = async (req, res) => {
    try {
        const { postId, commentId } = req.body;
        console.log("Post ID -", postId);
        console.log("CommentId - ", commentId);

        if (!postId || !commentId) {
            return res.status(401).json({
                success: false,
                message: "All Fields are Required"
            })
        }
        console.log("Both Validated");

        const updatedPost = await Post.findByIdAndUpdate(
            postId,
            {
                $pull: {
                    comments: commentId
                }
            },
            { new: true }
        ).populate("comments").exec();
        console.log("Updated Post Updated", updatedPost);

        await Comment.findByIdAndDelete(commentId);


        res.status(200).json({
            success: true,
            message: "Comment Deleted Successfully",
            post: updatedPost
        })
    }
    catch (error) {
        console.log("An Error Occurred While Deleting the Comment");

        res.status(500).json({
            status: false,
            message: "An Error Occurred While Deleting the Comment"
        })
    }
}

exports.commentPostAll = async (req, res) => {
    try {
        const { postId } = req.body;

        if (!postId) {
            return res.status(401).json({
                success: false,
                message: "All Fields are Required"
            })
        }

        let allPostComments = await Comment.find({ post: postId });

        if (!allPostComments) {
            return res.status(401).json({
                success: false,
                message: "The Post Contains no Comments"
            })
        }

        res.status(200).json({
            success: true,
            message: "All Comments of The Post Gathered",
            comments: allPostComments
        })
    }
    catch (error) {
        console.log("An Error Occurred While Getting All The Comments of a Post", error);

        res.status(500).json({
            success: false,
            message: "An Error Occurred While Getting All The Comments of a Post",
            error: error.message
        })
    }
}