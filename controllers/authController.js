import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

import User from "../modules/User.modules.js";
import emailValid from "../utility/valid/emailValid.js";
import passwordValid from "../utility/valid/passwordValid.js";

const register = async (req, res) => {
    const { firstName, lastName, email, password, re_password } = req.body;

    if (!firstName || !lastName || !email || !password || !re_password) {
        return res.status(400).json({ message: "All failed Is Required" })
    };

    if (!emailValid(email)) {
        return res.status(400).json({
            message: "Invalid email",
        });
    }

    if (!passwordValid(password)) {
        return res.status(400).json({
            message:
                "Please note that the password should contain the following elements:Uppercase letters (A-Z). Lowercase letters(a- z). Numbers(0 - 9). Special characters or symbols. ",
        })
    };

    if (password !== re_password) {
        return res.status(400).json({
            message: "Password is not match",
        });
    }

    let findUser = await User.findOne({ email: email })

    if (findUser) {
        return res.status(400).json({
            message: "Mail errors",
        });
    }

    const hashPassword = await bcrypt.hash(password, 10)
    let createUser = await User.create({ firstName, lastName, email, password: hashPassword })

    const token = await jwt.sign({ user_info: createUser._id }, process.env.JWT_TOKEN_KEY, { expiresIn: "1d" })
    const refreshToken = await jwt.sign({ user_info: createUser._id }, process.env.JWT_REFRESH_TOKEN_KEY, { expiresIn: "7d" })

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: 1000 * 60 * 60 * 24 * 7,
    })

    res.cookie("currentUser", token, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: 1000 * 60 * 60
    })

    res.status(201).send({ message: 'successful', token: token });
};

const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "All failed Is Required" })
    };

    if (!emailValid(email)) {
        return res.status(400).json({
            message: "Invalid email",
        });
    }


    let findUser = await User.findOne({ email: email })

    if (!findUser) {
        return res.status(400).json({
            message: "Error in email or password",
        });
    }

    const comparePassword = await bcrypt.compare(password, findUser.password)
    if (!comparePassword) {
        return res.status(400).json({
            message: "Error in email or password",
        });
    }

    const token = await jwt.sign({ user_info: findUser._id }, process.env.JWT_TOKEN_KEY, { expiresIn: "1d" })
    const refreshToken = await jwt.sign({ user_info: findUser._id }, process.env.JWT_REFRESH_TOKEN_KEY, { expiresIn: "7d" })

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: 1000 * 60 * 60 * 24 * 7,
    })

    res.cookie("currentUser", token, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: 1000 * 60 * 60
    })

    res.status(200).send({ message: 'successful', token: token });
};

const refreshToken = async (req, res) => {
    const cookies = req.cookies

    if (!cookies?.refreshToken) { return res.status(401).json({ message: "Unauthorized" }) }

    const decoded = await jwt.verify(cookies.refreshToken, process.env.JWT_REFRESH_TOKEN_KEY)
    if (!decoded) { return res.status(403).json({ status: "FAIL", message: "Forbidden" }) }

    const findUser = await User.findById(decoded.user_info)
    if (!findUser) { return res.status(401).json({ message: "Unauthorized" }) }

    const token = await jwt.sign({ user_info: findUser._id }, process.env.JWT_TOKEN_KEY, { expiresIn: "1h" })

    res.cookie("currentUser", token, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: 1000 * 60 * 60
    })

    res.status(200).send({ message: 'successful', token: token });
};

const logout = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.refreshToken && !cookies?.currentUser) return res.status(400).json({ message: "Unauthorized" })

    res.clearCookie("refreshToken", {
        httpOnly: true,
        sameSite: "None",
        secure: true
    })

    res.clearCookie("currentUser", {
        httpOnly: true,
        sameSite: "None",
        secure: true
    })



    res.json({ message: "success logout" })
}

export { register, login, refreshToken, logout };
