import express from 'express';
import { test, updateUser } from '../Controllers/UserController.js';

import { verifyToken } from '../Utills/verifyUser.js';

const router = express.Router();


router.get('/test', test)
router.route('/update:userId').put(verifyToken, updateUser)

export default router;