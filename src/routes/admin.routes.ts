import express from 'express';
import { adminLogin, createAdmin } from '../controllers/admin.controller';
import { authenticate, authorizeRoles } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/login', adminLogin);
router.post("/create", authenticate, authorizeRoles("ADMIN"), createAdmin);


export default router;
