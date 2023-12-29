import express from 'express';

import UserController from '../controllers/user.js';
import checkAuth from '../middleware/check-auth.js';

const router = express.Router();
router.post('/signup', UserController.user_signup);

router.post('/login', UserController.user_login);

router.delete('/:userId', checkAuth, UserController.user_delete);
router.get('/isAdmin/:userId', checkAuth, UserController.user_isadmin)

export default router;
