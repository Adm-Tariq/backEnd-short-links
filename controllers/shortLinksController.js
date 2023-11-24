import isUrl from "is-url"
import jwt from "jsonwebtoken"

import shortUrl from "../modules/ShortLink.modules.js"
import generateRandomString from 'generate-random-string';

const shortLinks = async (req, res) => {
    const { link } = req.body
    if (!isUrl(link)) {
        return res.json({ message: "Enter a valid link" })
    }

    const randomString = generateRandomString(10);

    const cookies = req.cookies.currentUser;

    if (!cookies) {
        const createShortLink = await shortUrl.create({ link, shortLink: randomString })
        return res.json({ message: createShortLink })
    }

    const uid = await jwt.verify(cookies, process.env.JWT_TOKEN_KEY).user_info
    const urls = await shortUrl.create({ user_id: uid, link, shortLink: randomString })
    res.json({ message: urls })
}

const redirect = async (req, res) => {
    const urlId = req.params.id
    const url = await shortUrl.findOne({ shortLink: urlId })
    if (!url) {
        return res.status(404).json({ message: "not found url" })
    }

    const findVisits = await shortUrl.findOne({ shortLink: urlId })
    let visits = findVisits.visits
    visits += 1
    await shortUrl.updateOne({ shortLink: urlId }, { visits })
    res.json({ message: url.link })
}

export { shortLinks, redirect }