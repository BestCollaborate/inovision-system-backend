import express from 'express';

const router = express.Router();

import authRoutes from './auth.route';
import lectureRoutes from './lecture.route';
import adminRoutes from './admin.route';
import userRoutes from './user.route';

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoutes,
  },
  {
    path: '/lecture',
    route: lectureRoutes,
  },
  {
    path: '/admin',
    route: adminRoutes,
  },
  {
    path: '/users',
    route: userRoutes,
  }
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
