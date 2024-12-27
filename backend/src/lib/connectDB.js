import mongoose from 'mongoose';

export const connectDB = async ()=> {
    try {
        const res = await mongoose.connect(process.env.MONGODB_URI);
        console.log("mongodb connected : ", res.connection.host);
        
    } catch (error) {
        
    }
}