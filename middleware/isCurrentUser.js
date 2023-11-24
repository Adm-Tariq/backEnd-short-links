
const isCurrentUser = async (req, res, next) => {
    const currentUser = req.cookies.currentUser
    if (!currentUser) {
        return res.status(401).json({ message: "Unauthorized" })
    }
    next()
}


export default isCurrentUser