const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.auth = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token Missing"
            })
        }

        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decode;
        }
        catch (error) {
            return res.status(401).json({
                success: false,
                message: "Tokein is Invalid"
            })
        }

        next();
    }
    catch (error) {
        console.log("An Error Occurred While Authenticating the User -> ", error);
        res.status(500).json({
            success: false,
            message: "An Error Occurred While Authenticating the User",
            error: error.message
        })
    }
}