const bcrypt = require('bcrypt');
const User = require('../models/User');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../utils/token');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
//Uploads Imamges
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploadsUser/');
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        const filename = Date.now() + '-' + Math.round(Math.random() * 1E9) + ext;
        cb(null, filename);
    }
});

const upload = multer({ storage: storage });
module.exports = {
    upload,
    register: async (req, res) => {
        try {
            const { email, username, password } = req.body;

            const user = await User.findOne({ email: email });
            if (user) {
                console.log("Email already exists");
                return res.status(400).json({ EC: 1, EM: "Email already exists", DT: null });
            }

            const hashed = await bcrypt.hash(password, 10);

            const newUser = new User({
                email,
                username,
                password: hashed,
            });
            newUser.id = newUser._id.toString();
            await newUser.save();
            console.log("User registered successfully");
            res.status(201).json({ EC: 0, EM: "Register successful", DT: null });
        } catch (error) {
            res.status(500).json({ message: "Error registering user", error });
        }
    },

    login: async (req, res) => {
        try {
            const { email, password } = req.body;

            const user = await User.findOne({ email: email });
            if (!user) {
                console.log("Email not found");
                return res.status(400).json({ EC: 1, EM: "Username or password is incorrect", DT: null });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                console.log("Password is incorrect");
                return res.status(400).json({ EC: 1, EM: "Username or password is incorrect", DT: null });
            }

            const accessToken = generateAccessToken(user);
            const refreshToken = generateRefreshToken(user);

            console.log("Login successful");
            return res.status(200).json({
                EC: 0,
                EM: "Login successful",
                DT: {
                    accessToken,
                    refreshToken
                }
            });
        } catch (error) {
            console.log("Error during login: ", error);
            return res.status(500).json({ EC: -1, EM: "Internal Server Error", DT: error });
        }
    },

    refreshToken: async (req, res) => {
        try {
            const { email, refresh_token } = req.body;
            if (!email || !refresh_token) {
                return res.status(400).json({ EC: 1, EM: "Missing email or refresh_token", DT: null });
            }

            const user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({ EC: 1, EM: "User not found", DT: null });
            }

            const verify = verifyRefreshToken(refresh_token);
            if (!verify || verify.email !== email) {
                return res.status(400).json({ EC: 2, EM: "Invalid refresh token", DT: null });
            }

            const newAccessToken = generateAccessToken(user);
            return res.status(200).json({
                EC: 0,
                EM: "Refresh token successful",
                DT: {
                    accessToken: newAccessToken
                }
            });

        } catch (error) {
            console.log("Error: ", error);
            return res.status(500).json({ EC: -1, EM: "Internal Server Error", DT: error });
        }
    },



    createUser: async (req, res) => {
        try {
            const { email, username, password, role } = req.body;
            const user = await User.findOne({ email: email });
            // Check email is already in use
            if (user) {
                console.log("This email is already in use");
                return res
                    .status(400)
                    .json({ EC: 1, EM: "Email already exists", DT: null });
            }
            const userImage = req.file?.filename || null;

            //Hashed pass

            const hashedPassword = await bcrypt.hash(password, 10);


            const newUser = new User({
                email: email,
                username: username,
                password: hashedPassword,
                role: role,
                userImage: userImage,
            });
            newUser.id = newUser._id.toString();

            newUser.save();
            console.log("User created successfully");
            return res.status(200).json({ EC: 0, EM: "User created successfully", DT: newUser });
        } catch (error) {
            console.log("Error: ", error);
            return res.status(500).json({ EC: -1, EM: "Internal Server Error", DT: error });
        }
    },


    getAllUser: async (req, res) => {
        try {
            const users = await User.find({});
            console.log("User list");
            return res.status(200).json({ EC: 0, EM: "User created successfully", DT: users });
        } catch (e) {
            console.log(`Error: ${e}`);
            return res.status(500).json({ EC: -1, EM: "Internal Server Error", DT: e });

        }
    },
    deleteUser: async (req, res) => {
        try {
            const { id } = req.body;
            if (!id || id === '') {
                console.log("Invalid id");
                return res.status(400).json({ EC: 1, EM: "Invalid id", DT: null });
            }
            const user = await User.findByIdAndDelete(id);
            if (user.userImage) {
                const filePath = path.join(__dirname, '../uploadsUser/', user.userImage);
                fs.unlink(filePath, (err) => {
                    if (err) {
                        console.error("Failed to delete image file:", err);
                    } else {
                        console.log("Image file deleted successfully");
                    }
                });
            }
            console.log("User deleted successfully");
            return res.status(200).json({ EC: 0, EM: "User deleted successfully", DT: user });

        } catch (e) {
            console.log(`Error: ${e}`);
            return res.status(500).json({ EC: -1, EM: "Internal Server Error", DT: e });
        }
    }
}

