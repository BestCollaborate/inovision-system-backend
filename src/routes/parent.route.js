import express from 'express';

const router = express.Router();
import { authMiddleware } from '../middlewares/auth.middleware';
import { parentController } from '../controllers/parent.controller';

router.post('/create-student',
  parentController.createStudent
);

router.get('/get-child/:id',
  parentController.getChild
);

router.put('/change-child/:id',
  parentController.changeChild
);

router.delete('/delete-child/:id',
  parentController.deleteChild
);

// router.delete('/sign-out', authMiddleware, authController.signOut)

export default router;