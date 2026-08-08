import express from 'express';
import { signup, login, getMe } from '../controllers/authController.js';
import { requireAuth } from '../middleware/auth.js';
import { validateSignup, validateLogin } from '../middleware/validators.js';

const router = express.Router();

router.post('/signup', validateSignup, signup);
router.post('/login', validateLogin, login);
router.get('/me', requireAuth, getMe);

export default router;