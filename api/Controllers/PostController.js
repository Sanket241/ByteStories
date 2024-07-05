import { Errorhandler } from '../Utills/Error.js';
import Post from '../Models/PostModel.js';
export const createPost = async (req, res, next) => {
    if (!req.user.isAdmin) {
        return next(Errorhandler(401, 'Unauthorized Access'));
    }
    if (!req.body.title || !req.body.content) {
        return next(Errorhandler(400, 'Title or Content is missing'));
    }
    const slug = req.body.title.split(' ').join('-').toLowerCase().replace(/[^a-zA-Z0-9-]/g, '');
    const newPost = new Post({
        ...req.body, slug, userId: req.user.id
    })
    try {
        const savepost = await newPost.save();
        res.status(201).json(savepost)
    } catch (error) {
        next(error)
        
    }
}