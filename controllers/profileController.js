import User from "../modules/user.modules.js";
import shortUrl from "../modules/ShortLink.modules.js"
import jwt from 'jsonwebtoken';


const profile = async (req, res) => {
    const currentUser = req.cookies.currentUser
    if (!currentUser) {
        return res.status(401).json({ message: "Unauthorized" })
    }

    const decoded = await jwt.verify(currentUser, process.env.JWT_TOKEN_KEY)
    const findUser = await User.findOne({ _id: decoded.user_info }, { password: 0, _id: 0 })
    if (!findUser) {
        return res.status(401).json({ message: "Unauthorized" })
    }

    res.send({ profile_data: findUser })
}

const userLinks = async (req, res) => {
    const currentUser = req.cookies.currentUser

    if (!currentUser) {
        return res.status(401).json({ message: "Unauthorized" })
    }

    const decoded = await jwt.verify(currentUser, process.env.JWT_TOKEN_KEY)

    const findUrl = await shortUrl.find({ user_id: decoded.user_info }, { _id: 0, user_id: 0 })

    if (findUrl <= 0) {
        return res.status(401).json({ message: "There are no shortened links" })
    }

    res.status(200).json({ urls: findUrl })

}

export { profile, userLinks }