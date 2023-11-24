import express from 'express';
import { profile, userLinks } from '../controllers/profileController.js';
const router = express.Router()



router.route("/").get(profile)
router.route("/ulinks").get(userLinks)


export default router