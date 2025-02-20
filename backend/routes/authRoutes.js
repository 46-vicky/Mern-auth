import express from 'express'
import { register, login, logout, verifyUser, verifyOtp, isAuthenticated, sendResetOtp, resetPassword } from '../controllers/authControllers.js';
import protectRoute from '../middleware/protectRoute.js';

const router = express.Router();

router.post('/register', register)
router.post('/login', login)
router.post('/logout', logout)
router.post('/sent-verify-otp', protectRoute, verifyUser)
router.post('/verify-account', protectRoute, verifyOtp)
router.get('/is-auth', protectRoute, isAuthenticated)
router.post('/send-reset-otp', sendResetOtp)
router.post('/verify-reset-otp', resetPassword)

export default router