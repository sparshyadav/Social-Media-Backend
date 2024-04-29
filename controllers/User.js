const User = require("../models/User");
const bcrypt = require("bcrypt");

exports.createUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status().json({
                success: false,
                message: "All Fields are Required"
            })
        }

        const hashpassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            username, email, password: hashpassword
        });

        res.status(200).json({
            success: true,
            message: "User Created Successfully",
            data: newUser
        })
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "An Error Occurred While Creating User",
            error: error.message
        })
    }
}