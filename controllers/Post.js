const cloudinary = require("cloudinary").v2;
const fs = require('fs');

exports.createPost = async (req, res) => {
    try {
        const folderName = "Social Media";
        const image = req.file.path;

        console.log(req.file);
        console.log(image);

        const response = await cloudinary.uploader.upload(image,
            {
                folder: folderName,
                resource_type: "auto"
            }
        )
        console.log(response);


        fs.unlink(image, function (err) {
            if (err) throw err;
            console.log('File deleted!');
        });

        res.json({
            success: true,
            imageUrl: response.secure_url
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