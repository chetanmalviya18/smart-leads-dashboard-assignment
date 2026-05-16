import { Router } from 'express';
import { register, login, getMe, getUsers } from '../controllers/authController';
import { authenticate, authorize } from '../middleware/auth';
import { registerValidation, loginValidation } from '../middleware/validation';

const router = Router();

router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.get('/me', authenticate, getMe);
router.get('/users', authenticate, authorize('admin'), getUsers);

export default router;
