import express from 'express';

const router = express.Router();

import { authMiddleware } from '../middlewares/auth.middleware';

const { storeLecture, getLectures, updateLecture, deleteLecture, getFreeLecture } = require('../controllers/lecture.controller');

router.post('/', authMiddleware, storeLecture);
router.get('/', authMiddleware, getLectures);
router.put('/:uid', authMiddleware, updateLecture);
router.delete('/', authMiddleware, deleteLecture);    
router.get('/free', authMiddleware, getFreeLecture);

export default router;