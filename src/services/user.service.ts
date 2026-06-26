// src/services/user.service.ts
import { UserMongoRepository } from "../repositories/user.repository";
import { CreateUserDto, LoginUserDto, UpdateUserDto } from "../dtos/user.dto";
import { HttpException } from "../exceptions/http-exception";
import bycrypt from "bcryptjs"; // to hash password
import { IUser } from "../models/user.model";
// jwt for token generation
import jwt from "jsonwebtoken";
import { CLIENT_URL, SECRET_KEY } from "../config/constant";
import { sendEmail } from "../config/email";

const userRepository = new UserMongoRepository();
export class UserService {
    async createUser(userData: CreateUserDto) {
        // Check if username or email already exists
        const existingUserByUsername = await userRepository.findByUsername(
            userData.username
        );
        if (existingUserByUsername) {
            throw new HttpException(400, "Username already exists");
        }
        const existingUserByEmail = await userRepository.findByEmail(userData.email);
        if (existingUserByEmail) {
            throw new HttpException(400, "Email already exists");
        }
        // Hash the password before saving
        const hashedPassword = await bycrypt.hash(userData.password, 10);
        const userToCreate = {
            ...userData,
            password: hashedPassword,
        };
        const createdUser = await userRepository.create(userToCreate as any);
        return createdUser;
    }

    async loginUser(loginData: LoginUserDto) {
        const user = await userRepository.findByEmail(loginData.email);
        if (!user) {
            throw new HttpException(400, "Invalid email or password");
        }
        const isPasswordValid = await bycrypt.compare(
            loginData.password,
            user.password
        ); // compare hashed password
        if (!isPasswordValid) {
            throw new HttpException(400, "Invalid email or password");
        }
        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role }, // payload
            SECRET_KEY,
            { expiresIn: "30d" }
        );
        return { user, token };
    }
    async updateUser(id: string, updateData: UpdateUserDto) {
        const user = await userRepository.findById(id);
        if (!user) {
            throw new HttpException(404, "User not found");
        }
        if(updateData.email && updateData.email !== user.email) {
            const existingUserByEmail = await userRepository.findByEmail(updateData.email);
            if (existingUserByEmail) {
                throw new HttpException(400, "Email already exists");
            }
        }
        if(updateData.username && updateData.username !== user.username) {
            const existingUserByUsername = await userRepository.findByUsername(updateData.username);
            if (existingUserByUsername) {
                throw new HttpException(400, "Username already exists");
            }
        }
        if (updateData.password) {
            updateData.password = await bycrypt.hash(updateData.password, 10);
        }
        const updatedUser = await userRepository.update(id, updateData);
        return updatedUser;
    }


    async sendResetPasswordEmail(email?: string) {
        if (!email) {
            throw new HttpException(400, "Email is required");
        }
        const user = await userRepository.findByEmail(email);
        if (!user) {
            throw new HttpException(404, "User not found");
        }
        const token = jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn: '1h' }); // 1 hour expiry
        const resetLink = `${CLIENT_URL}/reset-password?token=${token}`;
        const html = `<p>Click <a href="${resetLink}">here</a> to reset your password. This link will expire in 1 hour.</p>`;
        await sendEmail(user.email, "Password Reset", html);
        return { user, token };

    }

    async resetPassword(token?: string, newPassword?: string) {
        try {
            if (!token || !newPassword) {
                throw new HttpException(400, "Token and new password are required");
            }
            const decoded: any = jwt.verify(token, SECRET_KEY);
            const userId = decoded.id;
            const user = await userRepository.findById(userId);
            if (!user) {
                throw new HttpException(404, "User not found");
            }
            const hashedPassword = await bycrypt.hash(newPassword, 10);
            await userRepository.update(userId, { password: hashedPassword });
            return user;
        } catch (error) {
            throw new HttpException(400, "Invalid or expired token");
        }
    }
}