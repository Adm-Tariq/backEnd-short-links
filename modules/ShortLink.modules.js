import mongoose from "mongoose";

const shortLinkSchema = new mongoose.Schema({
    user_id: {
        type: String,
        require: true,
        default: "unknown"
    },
    link: {
        type: String,
        require: true
    },
    shortLink: {
        type: String,
        require: true
    },
    visits: {
        type: Number,
        default: 0
    }
}, { timestamps: true })
const ShortLinks = mongoose.model('shortLinks', shortLinkSchema)

export default ShortLinks