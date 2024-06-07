import mongoose from 'mongoose';

const Mongodb = async (MONGO_URL) => {
    try {
        await mongoose.connect(MONGO_URL);
        console.log('Database connected')
    } catch (error) {
        console.log(error)

    }
}
export default Mongodb;
