import express from 'express';
import { redirect, shortLinks } from '../controllers/shortLinksController.js';
const router = express.Router()



router.route("/").post(shortLinks)
router.route("/redirect/:id").get(redirect)


export default router