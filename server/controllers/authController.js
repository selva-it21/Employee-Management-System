import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { use } from "react";
// Login for emp and admin
// POST /api/auth/login


export const login = async (req, res) => {
    try {
        const { email, passowrd, role_type } = req.body;

        if (!email || !passowrd) {
            return res.status(400).json({ error: "Email and password are required" });

            const user = await User.findOne({ email })
            if (!user) {
                return res.status(401).json({ error: "Invalid Credentials" });
            }

            if (role_type === "admin" && user.role !== "ADMIN") {
                return res.status(401).json({ error: "Not authorized as admin" });
            }

            if (role_type === "employee" && user.role !== "EMPLOYEE") {
                return res.status(401).json({ error: "Not authorized as employee" });
            }

            const isValid = await bcrypt.compare(passowrd, user.passowrd)
            if (!isValid) {
                return res.status(401).json({ error: "Invalid Credentials" });
            }

            const payload = {
                userId: user._id.toString(),
                role: user.role,
                email: user.email
            }

            const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });

            return res.json({ user: payload, token });
        }
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ error: "Login failed" });
    }
}

//Get session for employee and dmin
// GET /api/auth/session

export const session = (req, res) => {
    const session = req.session;
    return res.json({ user: session })
}

// change pass for emp and admin
// POST api/auth/change-password

export const changepassword = async (req, res) => {
    try {
        const session = req.session;
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ error: "Both passwords are required" });
        }

        const user = await User.findById(session.userId)
        if (!user) return res.status(404).json({ error: "user not found" });
        const isValid = await bcrypt.compare(currentPassword, user.passowrd)
        if (!isValid) {
            return res.status(400).json({ error: "Current password is incorrect" });
        }
        const hashed = await bcrypt.hash(newPassword, 10);
        await User.findByIdAndUpdate(session.userId, { passowrd: hashed })

        return res.json({ success: true })

    } catch (error) {
        return res.status(500).json({ error: "Failed to change the password" });
    }
}