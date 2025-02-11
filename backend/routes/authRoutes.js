import express from 'express'
import { register, login, logout, verifyUser, verifyOtp } from '../controllers/authControllers.js';
import protectRoute from '../middleware/protectRoute.js';

const router = express.Router();

router.post('/register', register)
router.post('/login', login)
router.post('/logout', logout)
router.post('/sent-verify-otp', protectRoute, verifyUser)
router.post('/verify-account', protectRoute, verifyOtp)

export default router