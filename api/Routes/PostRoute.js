import express from 'express';
import { createPost, getPost } from '../Controllers/PostController.js';
import { verifyToken } from '../Utills/verifyUser.js';

const router = express.Router();

router.route('/create').post(verifyToken, createPost);
router.route('/getpost').get(getPost);

export default router