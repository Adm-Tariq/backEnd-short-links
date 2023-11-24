
import express from 'express';
const router = express.Router()
import { login, logout, refreshToken, register } from "../controllers/authController.js"

router.route("/").post(register)
router.route("/login").post(login)
router.route("/refresh").get(refreshToken)
router.route("/logout").post(logout)

export default router