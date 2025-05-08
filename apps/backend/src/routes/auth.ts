import express from 'express';
import { loginUser } from '../controllers/auth/login';
import { registerUser } from '../controllers/auth/register';

const router = express.Router();

router.post('/login', loginUser);
router.post('/register', registerUser);

export default router;