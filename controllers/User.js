const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Profile = require("../models/Profile");

exports.signupUser = async (req, res) => {
    try {
        // Gathering Details of the User
        const { username, email, password } = req.body;

        // Validing the User Details
        if (!username || !email || !password) {
            return res.status().json({
                success: false,
                message: "All Fields are Required"
            })
        }

        // Check if User Already Exists
        const checkIfUserExits = await User.findOne({ email });

        // If User Already Exists, Retur Error
        if (checkIfUserExits) {
            return res.status(400).json({
                success: false,
                message: "User Already Exists"
            })
        }

        // Hashing the Password
        const hashpassword = await bcrypt.hash(password, 10);

        // Creating the New User
        const newUser = await User.create({
            username, email, password: hashpassword
        });

        // Sending Response
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

exports.loginUser = async (req, res) => {
    try {
        // Gathering User Information
        const { email, password } = req.body;

        // Validating User Information
        if (!email || !password) {
            return res.status().json({
                success: false,
                message: "All Fields are Required"
            })
        }

        // Finding the User
        const user = await User.findOne({ email: email });

        // If User not Found, Return Error
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User Not Registered"
            })
        }
        // Checking the Password
        let isPasswordCorrect = await bcrypt.compare(password, user.password);

        // If Password not Correct, Return Error
        if (!isPasswordCorrect) {
            return res.status(402).json({
                success: false,
                message: "Password is Incorrect"
            })
        }

        // Creating a Token
        const token = jwt.sign({
            email: user.email,
            id: user._id,
            username: user.username
        },
            process.env.JWT_SECRET
        )

        // Sending a Cookie
        res.cookie("token", token, { httpOnly: true }).status(200).json({
            success: true,
            token,
            user,
            message: "User LoggedIn Successfully"
        })
    }
    catch (error) {
        console.log("An Error Occurred While Logging In the User -> ", error);
        res.status(500).json({
            success: false,
            message: "An Error Occurred While Logging In the User",
            error: error.message
        })
    }
}

exports.updateProfile = async (req, res) => {
    try {
        // Gather Information from Request Body
        const { firstName, lastName, bio } = req.body;

        // Validate the Gathered Information
        if (!firstName || !lastName || !bio) {
            return res.status(401).json({
                success: false,
                message: "All Fields are Required"
            })
        }

        const profile = await Profile.create({
            firstName, lastName, bio
        })

        const token = req.cookies.token;
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decode.id;

        const updatedUser = await User.findByIdAndUpdate(
            { _id: userId },
            {
                $push: {
                    Profile: profile._id
                }
            },
            { new: true }
        ).populate("Profile").exec();

        res.status(200).json({
            success: true,
            message: "Profile Updated Successfully",
            user: updatedUser
        })
    }
    catch (error) {

    }
}