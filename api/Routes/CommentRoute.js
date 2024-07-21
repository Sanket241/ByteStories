import express from 'express';
const router = express.Router();
import { verifyToken } from '../Utills/verifyUser.js';

import { createComment, getPostComments, likeComment, editComment, deleteComment, getcomments } from '../Controllers/CommentController.js';

router.route('/create').post(verifyToken, createComment);
router.route('/getcomments').get(getcomments);
router.route('/getcomments/:postId').get(getPostComments);
router.route('/like/:commentId').patch(verifyToken, likeComment);
router.route('/edit/:commentId').patch(verifyToken, editComment);
router.route('/delete/:commentId').delete(verifyToken, deleteComment);


export default router;
