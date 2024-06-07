import User from '../Models/AuthModel.js';
import bcrypt from 'bcryptjs';

export const signup = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'Please fill all fields' });
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = new User({ username, email, password:hashedPassword });
        await newUser.save();
        res.status(200).json({ message: 'User created successfully' });

    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

export const signin = async (req, res, next) => {
    res.send('Signin route');
    console.log('Signin route');
};

export const google = async (req, res, next) => {
    res.send('Google route');
    console.log('Google route');
};


export const test = async (req, res, next) => {
    console.log('test route auth');
    res.send('Test route');
};