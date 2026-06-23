import { z } from "zod";
import { BlogService } from "../services/blog.service";
import { CreateBlogDTO } from "../dtos/blog.dto";
import { HttpException } from "../exceptions/http-exception";
import { Request, Response } from "express";
import { ApiResponseHelper } from "../utils/api-response";
const blogService = new BlogService();

export class BlogController {
    async createBlog(req: Request, res: Response) {
        try {
            const userId = req.user._id; // from authorized middleware
            req.body.authorId = String(userId); // set authorId to the logged-in user's ID
            const parseResult = CreateBlogDTO.safeParse(req.body); // validate and parse the request body
            if (!parseResult.success) {
                throw new HttpException(
                    400,
                    z.prettifyError(parseResult.error)
                );
            }
            const createdBlog = await blogService.createBlog(parseResult.data);
            return ApiResponseHelper.success(res, createdBlog, 200, "Blog created successfully");
        } catch (e: Error | any) {
            return ApiResponseHelper.error(
                res,
                e?.message || "Failed to get user info",
                e.status || 500
            );
        }
    }

    async getBlogsByAuthorId(req: Request, res: Response) {
        try {
            const authorId = req.user._id; // from authorized middleware
            const blogs = await blogService.getBlogsByAuthorId(authorId);
            return ApiResponseHelper.success(res, blogs, 200, "Blogs retrieved successfully");
        } catch (e: Error | any) {
            return ApiResponseHelper.error(
                res,
                e?.message || "Failed to get blogs",
                e.status || 500
            );
        }
    }
    async getPaginatedBlogs(req: Request, res: Response) {
        try {
            const { page = "1", limit = "10", search } = req.query; // ?
            const { data, pagination } = await blogService.getPaginatedBlogs(String(page), String(limit), search ? String(search) : undefined);
            return ApiResponseHelper.success(res, data, 200, "Blogs retrieved successfully", pagination);
        } catch (e: Error | any) {
            return ApiResponseHelper.error(
                res,
                e?.message || "Failed to get blogs",
                e.status || 500
            );
        }
    }
}