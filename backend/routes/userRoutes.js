import express from 'express'
import protectRoute from '../middleware/protectRoute.js';
import { getUserData } from '../controllers/userControllers.js';

const router = express.Router();

router.get('/data', protectRoute, getUserData)

export default router