import express from 'express';
import userController from '../controllers/UserController.js';
import authenticate from '../middlewares/authenticate.js';
import authorize from '../middlewares/authorize.js';

const router = express.Router();
router.get('/', authenticate, authorize(['admin']), userController.getAll);
router.get('/me', authenticate, authorize([]), userController.getMe);

export default router;
