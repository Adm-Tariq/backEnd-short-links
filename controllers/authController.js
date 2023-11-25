import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import cors from "cors"
import mongoose from "mongoose"
import session from 'express-session';

import express from "express"
import connectDB from './config/dbConn.js';
import corsOptions from "./config/corsOptions.js"

import authRoute from "./routes/auth.routes.js"
import shortRoute from "./routes/short.routes.js"
import profileRoute from "./routes/profile.routes.js"
import verifyAccount from "./routes/verifyAccount.routes.js"

import isCurrentUser from "./middleware/isCurrentUser.js"
import activateAccount from "./middleware/activateAccount.js"

const app = express()
dotenv.config()
connectDB()

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
}))


app.use(cors(corsOptions))


app.use(cookieParser())
app.use(express.json())


app.use("/api/u", authRoute)
app.use("/api/shortlink", shortRoute)
app.use("/api/profile", isCurrentUser, activateAccount, profileRoute)
app.use("/api/verifyaccount", isCurrentUser, verifyAccount)

app.get('*', (req, res) => {
    res.send({ message: "error" })
})


mongoose.connection.once("open", () => {
    console.log("Connect To MongoDB");
    let port = process.env.PORT || 5000
    app.listen(port, () => {
        console.log("Server Start On Port ", port);
    })
})

mongoose.connection.on("error", (error) => {
    console.log(error);
});
