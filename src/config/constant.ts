// src/config/constant.ts
import dotenv from "dotenv";
dotenv.config();

export const PORT = process.env.PORT || 8088;
export const MOCK_DB = process.env.MOCK_DB || "mock";
export const MONGODB_URI = process.env.MONGODB_URI 
    || "mongodb://localhost:27017/class36b";
export const SECRET_KEY = process.env.SECRET_KEY    
    || "merosecretjwtkey";

export const EMAIL_USER: string =
    process.env.EMAIL_USER || "example@gmail.com";
export const EMAIL_PASS: string =
    process.env.EMAIL_PASS || "password123";
export const CLIENT_URL: string =
    process.env.CLIENT_URL || 'http://localhost:3000';
// same as 
// export{
//     PORT,
//     MOCK_DB
// }