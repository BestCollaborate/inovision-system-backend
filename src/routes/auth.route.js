import express from 'express';

const router = express.Router();
import { authController } from '../controllers/auth.controllers';
import { validateRequest } from '../middlewares/validation.middleware';
import { authMiddleware } from '../middlewares/auth.middleware';

router.post('/student-signup',
  validateRequest,
  authController.studentSignUp
);

router.post('/teacher-signup',
  validateRequest,
  authController.signUp
);

router.post('/sign-in',
  validateRequest,
  authController.signIn
);

router.post('/google-signup',
  validateRequest,
  authController.googleSignUp
);

router.post('/google-signin',
  validateRequest,
  authController.googleSignIn
);

router.put('/create-profile/:id', authController.createProfile);

router.post("/google-signin", 
  validateRequest,
  authController.googleSignIn
)

router.delete('/sign-out', authMiddleware, authController.signOut)

export default router;