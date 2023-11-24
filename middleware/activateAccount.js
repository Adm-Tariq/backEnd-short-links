import User from "../modules/User.modules.js";
import jwt from 'jsonwebtoken';

const activateAccount = async (req, res, next) => {
    const currentUser = req.cookies.currentUser
    if (!currentUser) {
        return res.status(401).json({ message: "Unauthorized" })
    }

    const decoded = await jwt.verify(currentUser, process.env.JWT_TOKEN_KEY)

    const findUser = await User.findById(decoded.user_info)
    const isEnabled = findUser.isEnabled;

    if (!isEnabled) {
        return res.status(400).json({ message: "The account must be activated", link: "/verifyaccount" })
    }
    next()

}

export default activateAccount
