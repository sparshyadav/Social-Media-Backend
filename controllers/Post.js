const cloudinary = require("cloudinary").v2;
const fs = require('fs');
const Post = require("../models/Post");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.createPost = async (req, res) => {
    try {
        // Taking Folder Name on Cloudinary, and File Path of the File
        const folderName = "Social Media";
        const image = req.file.path;

        // Uploading the File on Clodinary in the Requested Folder
        const response = await cloudinary.uploader.upload(image, {
            folder: folderName,
            resource_type: "auto"
        });

        // Delete the local file after uploading to Cloudinary
        fs.unlinkSync(image);

        // Take Caption from the Request Body
        const { caption } = req.body;

        // Create a New Post
        const newPost = await Post.create({
            imageUrl: response.secure_url,
            caption
        });

        // Verify Cookie to Get User and Gather User ID
        const decode = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
        const userId = decode.id;

        // Update the User with Post ID
        const updatedUser = await User.findByIdAndUpdate(
            { _id: userId },
            { $push: { Posts: newPost._id } },
            { new: true }
        ).populate("Posts").exec();

        res.json({
            success: true,
            data: newPost,
            user: updatedUser
        });
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: "An Error Occurred While Creating Post",
            error: error.message
        });
    }
};
