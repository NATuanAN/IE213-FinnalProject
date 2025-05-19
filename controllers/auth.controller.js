const bcrypt = require('bcrypt');
const User = require('../models/User');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../utils/token');
module.exports = {
    register: async (req, res) => {
        try {
            const { email, username, password } = req.body;

            const user = await User.findOne({ email: email });
            if (user) {
                console.log("Email already exisn    ts");
                res.status(400).json({ EC: 1, EM: "Email already exists", DT: null });
            }

            const hashed = await bcrypt.hash(password, 10);
            const newUser = new User({ email, username, password: hashed });
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
    }

};
