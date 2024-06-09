import User from '../Models/AuthModel.js';
import bcrypt from 'bcryptjs';
import { Errorhandler } from '../Utills/Error.js';
import jwt from 'jsonwebtoken';

export const signup = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return next(Errorhandler(400, 'Please fill all the fields'));
        }
        const hashedPassword = await bcrypt.hash(password, 12);
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
    if(!email || !password){
      return next(Errorhandler(400, 'Please fill all the fields'));
    }
    const check = await User.findOne({email})
    if(!check){
      return next(Errorhandler(400, 'Invalid credentials'));
    }
    const isMatch = await bcrypt.compare(password, check.password);
    if(!isMatch){
      return next(Errorhandler(400, 'Invalid credentials'));
    }
    const token = jwt.sign({email:check.email, id:check._id}, process.env.JWT_SECRET, {expiresIn:'1h'})

    const { password: pass, ...rest } = check._doc;

    res.status(200).cookie('access_token',token, {httpOnly:true}).json({message: 'User logged in successfully', rest, token});


  } catch (error) {
    next(error)
  }
};

export const google = async (req, res, next) => {
    res.send('Google route');
    console.log('Google route');
};


export const test = async (req, res, next) => {
    console.log('test route auth');
    res.send('Test route');
};