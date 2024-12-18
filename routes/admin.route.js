import express from 'express';

const router = express.Router();
import { adminController } from '../controllers/admin.controller';
import { validateRequest } from '../middlewares/validation.middleware';
import { authMiddleware } from '../middlewares/auth.middleware';

router.get('/get-teachers', adminController.getTeachers);

// router.post('/sign-up',
//   validateRequest,
//   authController.signUp
// );

// router.delete('/sign-out', authMiddleware, authController.signOut)

export default router;