import express from 'express';

const router = express.Router();
import { validateRequest } from '../middlewares/validation.middleware';
import { authMiddleware } from '../middlewares/auth.middleware';
import { teacherController } from '../controllers/teacher.controller';
import { studentController } from '../controllers/student.controller';
import { parentController } from '../controllers/parent.controller';

router.get('/teacher-profile/:id', authMiddleware, teacherController.getProfile);

router.put('/teacher-profile/:id', authMiddleware, teacherController.updateProfile);

router.delete('/teacher-profile/:id', authMiddleware, teacherController.deleteProfile);

router.get('parent-profile/:id', authMiddleware, parentController.getProfile);

router.put('parent-profile/:id', authMiddleware, parentController.updateProfile);

router.delete('parent-profile/:id', authMiddleware, parentController.deleteProfile);

router.get('/student-profile/:id', authMiddleware, studentController.getProfile);

router.put('/student-profile/:id', authMiddleware, studentController.updateProfile);

router.delete('/student-profile/:id', authMiddleware, studentController.deleteProfile);

// router.delete('/sign-out', authMiddleware, authController.signOut)

export default router;