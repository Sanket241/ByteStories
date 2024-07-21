import express from 'express';
const app = express();
import dotenv from 'dotenv';
dotenv.config();
import Mongodb from './db/Conn.js';
import cookieParser from 'cookie-parser';
import authRouter from './Routes/AuthRoute.js';
import userRouter from './Routes/UserRoute.js';
import postRouter from './Routes/PostRoute.js';
import commentRouter from './Routes/CommentRoute.js';
import cors from 'cors';
const port = process.env.PORT || 3000;


app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/post', postRouter);
app.use('/api/comment', commentRouter);

app.use((err, req, res, next)=>{
    const StatusCode = err.StatusCode || 500;
    const message = err.message || 'Internal Server Error';
    res.status(StatusCode).json({
        success: false,
        StatusCode,    
        message,
    });
})

const start=async()=>{
try {
    await Mongodb(process.env.MONGO_URL);
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
} catch (error) {
    console.log(error);
}
}
start();