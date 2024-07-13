import express from 'express';
import { createPost, getPost, deletePost } from '../Controllers/PostController.js';
import { verifyToken } from '../Utills/verifyUser.js';

const router = express.Router();

router.route('/create').post(verifyToken, createPost);
router.route('/getpost').get(getPost);
router.route('/deletepost/:postId/:userId').delete(verifyToken,deletePost);


export default router