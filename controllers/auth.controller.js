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
            // user.accessToken = accessToken;
            // user.refreshToken = refreshToken;

            // await user.save();
            console.log("Login successful");
            return res.status(200).json({
                EC: 0,
                EM: "Login successful",
                DT: {
                    accessToken,
                    refreshToken,
                    email: user.email,
                    username: user.username,
                    id: user.id,
                    role: user.role
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
    },
    updateUser: async (req, res) => {
        try {
            const { id, username, role } = req.body;
            if (!id || id === '') {
                console.log("Invalid id");
                return res.status(400).json({ EC: 1, EM: "Invalid id", DT: null });
            }
            const updateFiels = {
                username: username,
                role: role
            }
            const userImage = req.file?.filename || null;
            if (userImage) {
                updateFiels.userImage = userImage;
            }
            const updatedUser = await User.findByIdAndUpdate(id, updateFiels,
                { new: true, }
            );


            if (!updatedUser) {
                console.log("User Image not found");
                return res
                    .status(404)
                    .json({ EC: 1, EM: "User Image not found", DT: null });
            }

            console.log("User updated successfully");
            return res
                .status(200)
                .json({
                    EC: 0,
                    EM: "User updated successfully",
                    DT: updatedUser,
                });

        } catch (e) {
            console.log(`Error: ${e}`);
            return res.status(500).json({ EC: -1, EM: "Internal Server Error", DT: e });
        }
    },
    getUserWithPaginate: async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;

            const skip = (page - 1) * limit;
            const userList = await User.find().skip(skip).limit(limit);
            const safeUsers = userList.map(user => {
                const { password, ...rest } = user._doc;
                return rest;
            });
            const totalPages = await User.countDocuments();
            const results = {
                users: safeUsers,
                totalPages: totalPages,
            }
            return res.status(200).json({
                EC: 0,
                EM: "User updated successfully",
                DT: results,
            });

        } catch (error) {
            console.log(`Error: ${error}`);
            return res
                .status(500)
                .json({ EC: -1, EM: "Internal Server Error", DT: error });
        }
    },
    getUserbyId: async (req, res) => {
        try {
            const { id } = req.params; // lấy id từ URL param
            if (!id) {
                console.log("Id is not exist");
                return res.status(400).json({ EM: -1, DT: null, message: "Missing user id" });
            }

            const user = await User.findOne({ id: id });
            if (!user) {
                console.log("User is not exist");
                return res.status(404).json({ EM: -2, DT: null, message: "User not found" });
            }

            console.log("Get user by id:", id);
            return res.status(200).json({ EM: 0, DT: user });

        } catch (e) {
            console.error("Error in getUserbyId:", e);
            return res.status(500).json({ EM: -1, DT: null, message: "Server error" });
        }
    },
    postChangePassword: async (req, res) => {
        try {
            const { oldPassword, newPassword } = req.body;
            const { id } = req.params;
            if (!id || !oldPassword || !newPassword) {
                console.log("Missing required fields");
                return res.status(400).json({ EC: -1, EM: "Missing required fields", DT: null });
            }

            const user = await User.findById(id);
            if (!user) {
                console.log("User not found");
                return res.status(404).json({ EC: -2, EM: "User not found", DT: null });
            }

            const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);
            if (!isPasswordMatch) {
                console.log("Incorrect old password");
                return res.status(401).json({ EC: -3, EM: "Incorrect old password", DT: null });
            }
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            user.password = hashedPassword;
            await user.save();
            console.log("Password changed successfully");
            return res.status(200).json({ EC: 0, EM: "Password changed successfully", DT: null });
        }
        catch (err) {

        }
    }
}

