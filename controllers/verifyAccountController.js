import otpGenerator from "otp-generator"
import sendEmail from "../utility/valid/sendEmail.js"
import jwt from 'jsonwebtoken';
import User from "../modules/user.modules.js";
import session from 'express-session';

let OTP = ''
const verifyAccount = async (req, res) => {
    const currentUser = req.cookies.currentUser
    if (!currentUser) { return res.status(401).json({ message: "Unauthorized" }) }

    const decoded = await jwt.verify(currentUser, process.env.JWT_TOKEN_KEY)
    const findUser = await User.findById(decoded.user_info)
    if (!findUser) { return res.status(401).json({ message: "Unauthorized" }) }

    if (findUser.isEnabled) {
        return res.status(401).json({ message: "The account has already been activated" })
    }

    const message = 'Thank you for logging in to our site! We appreciate your interest in our services To complete the registration process, please activate your account by copying this code'

    if (OTP !== '') {
        setTimeout(function () {
            OTP = ''
        }, 1000 * 60);
        return res.send({ message: "You can send another code after 1 minute" })
    }
    OTP = otpGenerator.generate(6, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false })
    sendEmail(findUser.email, OTP, "Account activation code", message)
    req.session.OTP = OTP;
    res.json({ message: 'A code has been sent to your email' })
}

const uec = async (req, res) => {

    const currentUser = req.cookies.currentUser
    if (!currentUser) { return res.status(401).json({ message: "Unauthorized" }) }

    const { code } = req.body
    const OTP = req.session.OTP;

    if (!code) {
        return res.status(400).json({ message: "All failed Is Required" })
    }

    if (!OTP) {
        return res.status(400).json({ message: "Unauthorized" })
    }

    if (Number(OTP) !== Number(code)) {
        return res.status(400).json({ message: "Invalid code" })
    }

    const decoded = await jwt.verify(currentUser, process.env.JWT_TOKEN_KEY)
    const findUser = await User.findById(decoded.user_info)
    if (!findUser) { return res.status(401).json({ message: "Unauthorized" }) }

    if (findUser.isEnabled) {
        return res.status(401).json({ message: "The account has already been activated" })
    }

    await User.updateOne({ _id: findUser._id }, { isEnabled: true })

    req.session.destroy();

    res.send({ message: "The account has been confirmed successfully" })
}

export { verifyAccount, uec }