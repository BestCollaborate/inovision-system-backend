import express from 'express';

const router = express.Router();
import { adminController } from '../controllers/admin.controller';
import { validateRequest } from '../middlewares/validation.middleware';
import { authMiddleware } from '../middlewares/auth.middleware';

router.get("/get-user-count", adminController.getUserCount);

router.get('/get-teachers', adminController.getTeachers);

router.put('/update-teacher/:id', adminController.updateTeacher);

router.delete("/delete-teacher/:id", adminController.deleteTeacher);

router.get("/get-parents", adminController.getParents);

router.put("/update-parent/:id", adminController.updateParent); 

router.delete("/delete-parent/:id", adminController.deleteParent);

router.get("/get-students", adminController.getStudents);

router.put("/update-student/:id", adminController.updateStudent);

router.delete("/delete-student/:id", adminController.deleteStudent);

// router.post('/sign-up',
//   validateRequest,
//   authController.signUp
// );

// router.delete('/sign-out', authMiddleware, authController.signOut)

export default router;