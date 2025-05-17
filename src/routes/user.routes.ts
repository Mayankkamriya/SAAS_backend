import express from 'express';
import { getAllUsers, createUser, userLogin } from '../controllers/user.controller';
import { authenticate, authorizeRoles } from '../middleware/authMiddleware';


const router = express.Router();

router.get('/', authenticate, authorizeRoles("ADMIN", "VENDOR"), getAllUsers);
router.post('/signup', createUser);
router.post('/login', userLogin);

export default router;
