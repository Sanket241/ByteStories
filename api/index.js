import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import Mongodb from './db/Conn.js';
import cookieParser from 'cookie-parser';
import authRouter from './Routes/AuthRoute.js';
import userRouter from './Routes/UserRoute.js';
import postRouter from './Routes/PostRoute.js';
import commentRouter from './Routes/CommentRoute.js';
import path from 'path';
const port = process.env.PORT || 3000;

const __dirname = path.resolve();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/post', postRouter);
app.use('/api/comment', commentRouter);


app.use(express.static(path.join(__dirname, '/client/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
})



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