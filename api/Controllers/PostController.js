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

export const getPost = async(req,res,next)=>{
    try {
        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 9;
        const sortDirection = req.query.order === 'asc' ? 1 : -1;
        const posts = await Post.find({
          ...(req.query.userId && { userId: req.query.userId }),
          ...(req.query.category && { category: req.query.category }),
          ...(req.query.slug && { slug: req.query.slug }),
          ...(req.query.postId && { _id: req.query.postId }),
          ...(req.query.searchTerm && {
            $or: [
              { title: { $regex: req.query.searchTerm, $options: 'i' } },
              { content: { $regex: req.query.searchTerm, $options: 'i' } },
            ],
          }),
        })
          .sort({ updatedAt: sortDirection })
          .skip(startIndex)
          .limit(limit);

          const totalPosts = await Post.countDocuments();

          const now = new Date();
      
          const oneMonthAgo = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            now.getDate()
          );
      
          const lastMonthPosts = await Post.countDocuments({
            createdAt: { $gte: oneMonthAgo },
          });
      
          res.status(200).json({
            posts,
            totalPosts,
            lastMonthPosts,
          });
    } catch (error) {
        next(error);
    }
}

export const deletePost =async(req,res,next)=>{
  try {
    if(!req.user.isAdmin || req.user.id !== req.params.userId){
      return next(Errorhandler(401, 'Unauthorized Access'));
    }
    await Post.findByIdAndDelete(req.params.postId);
    res.status(200).json({message: 'Post Deleted Successfully'})
  } catch (error) {
    next(error)
  }
}
export const updatePost = async(req,res,next)=>{
  try {
    if(!req.user.isAdmin || req.user.id !== req.params.userId){
      return next(Errorhandler(401, 'Unauthorized Access'));
    }
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.postId,
      {
        $set: {
          title: req.body.title,
          content: req.body.content,
          category: req.body.category,
          image: req.body.image,
        },
      },
      { new: true }
    );
    res.status(200).json(updatedPost);


  } catch (error) {
    next(error)
    
  }
}