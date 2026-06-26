// src/controllers/user.controller.ts
import { UserService } from "../services/user.service";
import { HttpException } from "../exceptions/http-exception";
import { z } from "zod";
import { CreateUserDto, LoginUserDto, UpdateUserDto } from "../dtos/user.dto";
import { ApiResponseHelper } from "../utils/api-response";
import { Request, Response } from "express";

const userService = new UserService();

export class UserController {
    async createUser(req: Request, res: Response) {
        try{
            const parseResult = CreateUserDto.safeParse(req.body);
            if(!parseResult.success){
                throw new HttpException(
                    400, 
                    z.prettifyError(parseResult.error)
                );
            }
            const createdUser = await userService.createUser(parseResult.data);
            return ApiResponseHelper.success(res, createdUser, 201, "User created");
        }catch(e: Error | unknown | any){
            return ApiResponseHelper.error(
                res, 
                e?.message || "Failed to create user", 
                e.status || 500
            );
        }
    }

    async loginUser(req: Request, res: Response) {
        try{
            const parseResult = LoginUserDto.safeParse(req.body);
            if(!parseResult.success){
                throw new HttpException(
                    400, 
                    z.prettifyError(parseResult.error)
                );
            }
            const { user, token } = await userService.loginUser(parseResult.data);
            return ApiResponseHelper
                .success(res, { user, token }, 200, "Login successful");
        }catch(e: Error | unknown | any){
            return ApiResponseHelper.error(
                res, 
                e?.message || "Failed to login user", 
                e.status || 500
            );
        }
    }
    async updateUser(req: Request, res: Response) {
        try{
            const userId = req.user?._id;
            const filename = req.file?.filename;
            const parseResult = UpdateUserDto.safeParse(req.body);
            if(!parseResult.success){
                throw new HttpException(
                    400, 
                    z.prettifyError(parseResult.error)
                );
            }
            const updateData = {
                ...parseResult.data,
                ...(filename && { imageUrl: "/uploads/" + filename })
            }
            const updatedUser = await userService.updateUser(userId, updateData);
            return ApiResponseHelper.success(res, updatedUser, 200, "User updated");
        }catch(e: Error | unknown | any){
            return ApiResponseHelper.error(
                res, 
                e?.message || "Failed to update user", 
                e.status || 500
            );
        }
    }

    async whoami(req: Request, res: Response) {
        try{
            const user = req.user;
            if(!user){
                throw new HttpException(401, "Unauthorized");
            }
            return ApiResponseHelper.success(res, user, 200, "User info retrieved");
        }catch(e: Error | unknown | any){
            return ApiResponseHelper.error(
                res, 
                e?.message || "Failed to get user info", 
                e.status || 500
            );
        }
    }

    async sendResetPasswordEmail(req: Request, res: Response) {
        try {
            const email = req.body.email;
            // can be replaced with DTO
            if (!email) {
                throw new HttpException(400, "Email is required");
            }
            const { token, user } = await userService.sendResetPasswordEmail(email);
            return ApiResponseHelper.success(res,
                { token, user }, 200, "Reset password email sent successfully");
        } catch (error: Error | any) {
            return ApiResponseHelper.error(res, error.message || "Internal Server Error", error.status || 500);
        }
    }
    async resetPassword(req: Request, res: Response) {
        try {
            const token = req.params.token as string;
            const { newPassword } = req.body;
            // can be replaced with DTO
            if (!token || !newPassword) {
                throw new HttpException(400, "Token and new password are required");
            }
            const updatedUser = await userService.resetPassword(token, newPassword);
            return ApiResponseHelper.success(res, updatedUser, 200, "Password reset successfully");
        } catch (error: Error | any) {
            return ApiResponseHelper.error(res, error.message || "Internal Server Error", error.status || 500);
        }
    }
}