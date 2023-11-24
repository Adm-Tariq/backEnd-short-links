import express from 'express';
import { verifyAccount, uec } from '../controllers/verifyAccountController.js';
const router = express.Router()

router.route("/").post(verifyAccount)
router.route("/uec").post(uec)

export default router