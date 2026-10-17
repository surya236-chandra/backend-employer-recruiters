import { Router } from 'express';
import { login, logout, register, showLogin, showRegister } from '../controllers/authController.js';
import { redirectIfAuthenticated, requireRecruiter } from '../middleware/auth.js';

const router = Router();
router.get('/login', redirectIfAuthenticated, showLogin);
router.post('/login', redirectIfAuthenticated, login);
router.get('/register', redirectIfAuthenticated, showRegister);
router.post('/register', redirectIfAuthenticated, register);
router.post('/logout', requireRecruiter, logout);
export default router;
