import express from 'express';
const router = express.Router();
import { verifyToken } from '../Utills/verifyUser.js';

import { createComment, getPostComments, likeComment, editComment, deleteComment, getcomments } from '../Controllers/CommentController.js';

router.post('/create', verifyToken, createComment);
router.get('/getcomments', getcomments);
router.get('/:postId', getPostComments);
router.put('/like/:commentId', verifyToken, likeComment);
router.put('/edit/:commentId', verifyToken, editComment);
router.delete('/delete/:commentId', verifyToken, deleteComment);



export default router;
