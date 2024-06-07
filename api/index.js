import express from 'express';
const app = express();
import dotenv from 'dotenv';
dotenv.config();
import Mongodb from './db/Conn.js';
import authRouter from './Routes/AuthRoute.js';
import userRouter from './Routes/UserRoute.js';
import cors from 'cors';
const port = process.env.PORT || 3000;


app.use(express.json());
app.use(cors());
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);

app.use((err, req, res, next)=>{
    const StatusCode = err.StatusCode || 500;
    const message = err.message || 'Internal Server Error';
    res.status(StatusCode).json({message});
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