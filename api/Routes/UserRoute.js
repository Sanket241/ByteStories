import express from 'express';
import { test, updateUser, deleteUser, signout } from '../Controllers/UserController.js';

import { verifyToken } from '../Utills/verifyUser.js';

const router = express.Router();


router.get('/test', test)
router.put('/update/:userId', verifyToken, updateUser);
router.delete('/delete/:userId', verifyToken, deleteUser);
router.post('/signout',signout);

export default router;