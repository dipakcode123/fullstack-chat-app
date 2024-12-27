import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import { User } from "../models/user.model.js";
import bcryptjs from 'bcryptjs'


export const signup = async (req, res) => {
    const { fullName, email, password } = req.body;
    try {
        if (!email || !password || !fullName) {
            return res.status(400).json({ success: false, message: "All fields are required." })
        }
        if (password.length < 6) {
            return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
        }

        const userFind = await User.findOne({ email });

        if (userFind) {
            return res.status(400).json({ success: false, message: "User already exist." });
        }

        // generate jwta
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        const newUser = new User({
            fullName,
            email,
            password: hashedPassword
        })

        if (newUser) {
            // jwt token here
            generateToken(newUser._id, res);
            await newUser.save();

            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic
            })

        } else {
            res.status(400).json({ message: "Invalid user data" });
        }

    } catch (error) {
        console.log("Error in login controller", error.message);
        return res.status(500).json({ success: false, message: "Internal server error" })
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "Invalid Credentials." });
        }

        const isPasswordCorrect = await bcryptjs.compare(password, user.password);

        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid creadentials" });
        }

        generateToken(user._id, res);

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic
        });

    } catch (error) {
        console.log("Error in login controller", error.message);
        res.status(500).json({ success: false, message: "Internal server error." });
    }
}

export const logout = (req, res) => {
    try {
        res.cookie('jwt', "", { maxAge: 0 })

        res.status(200).json({ message: "Logged out successfully." })
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, message: "Internal server error." });
    }
}

export const updateProfile = async (req, res) => {

    try {
        const { profilePic } = req.body;
        const userId = req.user._id;

        if (!profilePic) {
            return res.status(400).json({ message: "Profile pic is required" });
        }

        const uploadResponse = await cloudinary.uploader.upload(profilePic);
        const updatedUser = await User.findByIdAndUpdate(userId, { profilePic: uploadResponse.secure_url }, { new: true });

        res.status(200).json(updatedUser);

    } catch (error) {
        console.log("Error in update profile: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const checkAuth = (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log("Error in check auth", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}