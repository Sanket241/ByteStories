import express from 'express';
import { createPost } from '../Controllers/PostController.js';
import { verifyToken } from '../Utills/verifyUser.js';

const router = express.Router();

router.route('/create').post(verifyToken, createPost);

export default router