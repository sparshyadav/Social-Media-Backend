const cloudinary = require("cloudinary").v2;
const fs = require('fs');
const Post = require("../models/Post");
const User = require("../models/User");

exports.createPost = async (req, res) => {
    try {
        const folderName = "Social Media";
        const image = req.file.path;
        console.log("Consoling Req.File ->", req.file);

        const response = await cloudinary.uploader.upload(image,
            {
                folder: folderName,
                resource_type: "auto"
            }
        )

        fs.unlink(image, function (err) {
            if (err) throw err;
            console.log('File deleted!');
        });

        const { caption, user } = req.file;

        const newPost = await Post.create({
            imageUrl: response.secure_url,
            caption
        })
        console.log("New Post Creted")

        const updatedUser=null;
        try {
            updatedUser = await User.findOneAndUpdate(
                { username: user },
                {
                    $push: {
                        posts: newPost._id
                    }
                },
                { new: true }
            )
        }
        catch (error) {
            console.log(error);
            res.status(500).json({
                message: "An Error Occurred While Saving User Data"
            })
        }
        console.log("User Updated");

        res.json({
            success: true,
            data: newPost,
            user: updatedUser
        })

    }
    catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: "An Error Occurred While Creating Post",
            error: error.message
        })
    }
}