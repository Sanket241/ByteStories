import User from '../Models/AuthModel.js';
import bcrypt from 'bcryptjs';
import { Errorhandler } from '../Utills/Error.js';
import jwt from 'jsonwebtoken';


export const test = async (req, res, next) => {
  console.log('test route auth');
  res.send('Test route');
};


export const signup = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return next(Errorhandler(400, 'Please fill all the fields'));
        }
        const hashedPassword = bcrypt.hashSync(password, 12);
        const newUser = new User({ username, email, password:hashedPassword });
        await newUser.save();
        res.status(200).json({ message: 'User created successfully' });

    } catch (error) {
        next(error);
    }
};

export const signin = async (req, res, next) => {
  try {
    const {email, password} = req.body;
    if(!email || !password || email === '' || password === ''){
      return next(Errorhandler(400, 'Please fill all the fields'));
    }
    const check = await User.findOne({email})
    if(!check){
      return next(Errorhandler(400, 'Invalid credentials'));
    }
    const isMatch =  bcrypt.compareSync(password, check.password);
    if(!isMatch){
      return next(Errorhandler(400, 'Invalid credentials'));
    }
    const token = jwt.sign(
      {id: check._id, isAdmin: check.isAdmin}, process.env.JWT_SECRET, {expiresIn:'1h'})

    const { password: pass, ...rest } = check._doc;

    res.status(200).cookie('access_token',token, {httpOnly:true}).json(rest);


  } catch (error) {
    next(error)
  }
};

export const google = async (req, res, next) => {
  const { email, name, googlePhotoUrl } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      const token = jwt.sign(
        { id: user._id, isAdmin: user.isAdmin },
        process.env.JWT_SECRET
      );
      const { password, ...rest } = user._doc;
      res
        .status(200)
        .cookie('access_token', token, {
          httpOnly: true,
        })
        .json(rest);
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcrypt.hashSync(generatedPassword, 12);
      const newUser = new User({
        username:
          name.toLowerCase().split(' ').join('') +
          Math.random().toString(9).slice(-4),
        email,
        password: hashedPassword,
        profilePicture: googlePhotoUrl,
      });
      await newUser.save();
      const token = jwt.sign(
        { id: newUser._id, isAdmin: newUser.isAdmin },
        process.env.JWT_SECRET
      );
      const { password, ...rest } = newUser._doc;
      res
        .status(200)
        .cookie('access_token', token, {
          httpOnly: true,
        })
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};