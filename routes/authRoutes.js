import express from 'express';

const router = express.Router();
import { authController } from '../controllers/authControllers';
import { validateRequest } from '../middlewares/validation.middleware';
import { authMiddleware } from '../middlewares/auth.middleware';

router.post('/sign-up',
  validateRequest,
  authController.signUp
);

router.post('/sign-in',
  validateRequest,
  authController.signIn
);

router.delete('/sign-out', authMiddleware, authController.signOut)

export default router;