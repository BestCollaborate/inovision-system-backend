import express from 'express';

const router = express.Router();

import authRoutes from './authRoutes';
import lectureRoutes from './lecture.route';

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoutes,
  },
  {
    path: '/lecture',
    route: lectureRoutes,
  }
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
