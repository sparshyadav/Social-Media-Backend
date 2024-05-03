const jwt = require("jsonwebtoken");
const Post = require("../models/Post");
const Like = require("../models/Like");
require("dotenv").config();

exports.likeUpdate = async (req, res) => {
    try {
        // Gather the PostId for the Post to be Liked
        const { postId } = req.body;

        // Validate postId
        if (!postId) {
            return res.status(401).json({
                success: false,
                message: "Post ID is Required"
            })
        }

        // From Token Extract UserId
        const token = req.cookies.token;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        // Check if the User has Already Liked the Post Before
        const isPostLiked = await Like.findOne({ user: userId, post: postId });

        if (!isPostLiked) {
            // If the Post is not Liked, Create a New Like
            const newLike = await Like.create({
                user: userId, post: postId
            })

            // Add the newLike ID into the Post
            const updatedPost = await Post.findByIdAndUpdate(postId,
                {
                    $push: {
                        likes: newLike._id
                    }
                },
                { new: true }
            ).populate("likes").exec();

            res.status(200).json({
                success: true,
                message: "Like Added Successfully",
                post: updatedPost
            })
        }
        else {
            // If the Post is Already Liked, Delete the Like
            await Like.findByIdAndDelete(isPostLiked._id);

            // From the Post Database, Remove the Like ID
            const updatedPost = await Post.findByIdAndUpdate(
                postId,
                {
                    $pull: {
                        likes: isPostLiked._id
                    }
                }
            )

            res.status(200).json({
                success: true,
                message: "Like Removed",
                post: updatedPost
            })
        }
    }
    catch (error) {
        console.log("An Error Occurred While Adding/Removing Like -> ", error);

        res.status(500).json({
            success: false,
            message: "An Error Occurred While Adding/Removing Like",
            error: error.message
        })
    }
}

