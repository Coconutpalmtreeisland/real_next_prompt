// MongoDB 데이터베이스에 연결을 시도, 연결 상태를 유지
import mongoose from 'mongoose';

let isConnected = false; // 연결 상태 추적

export const connectToDB = async () => {    // connectToDB라는 비동기 함수를 정의하여 데이터베이스에 연결
    mongoose.set('strictQuery', true);  // 스키마에 정의되지 않은 필드 무시

    if (isConnected) {
        console.log('MongoDB is already connected');
        return;
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            dbName: "share_prompt",
            // useNewUrlParser: true,
            // useUnifiedTopology: true,
        })

        isConnected = true;

        console.log('MongoDB connected');
    } catch (error) {
        console.log(error);
    }
}