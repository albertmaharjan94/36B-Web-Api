// src/controller/admin/blog.controller.ts
// for eash type of role try to create role based controller
import { z } from "zod";
import { Request, Response } from "express";
import { BlogService } from "../../services/blog.service";
import { CreateBlogDTO } from "../../dtos/blog.dto";
import { ApiResponseHelper } from "../../utils/api-response";
const blogService = new BlogService();
interface QueryParams {
    page?: string;
    limit?: string;
    search?: string;
}

export class AdminBlogController {
    async createBlog(req: Request, res: Response) {
        try {
            const blogData = CreateBlogDTO.safeParse(req.body);
            if (!blogData.success) {
                return ApiResponseHelper
                    .error(res, z.prettifyError(blogData.error), 400);
            }
            const blog = await blogService.createBlog(blogData.data);
            return ApiResponseHelper.success(res, blog, 200,"Blog created successfully");
        } catch (error: Error | any | unknown) {
            return ApiResponseHelper.error(
                res,
                error.message || "Internal Server Error",
                error.status || 500
            );
        }
    }
    // rest
    async getBlogPaginated(req: Request, res: Response) {
        try {
            const { page, limit, search }: QueryParams = req.query;
            const { data, pagination } = await blogService.getPaginatedBlogs(
                page,
                limit,
                search
            );
            return ApiResponseHelper.success(res, data, 200, "Blogs retrieved successfully", pagination);
        } catch (error: Error | any | unknown) {
            return ApiResponseHelper.error(
                res,
                error.message || "Internal Server Error",
                error.status || 500
            );
        }
    }
    async getBlogById(req: Request, res: Response) {
        try {
            const { id }: { id?: string } = req.params;
            const blog = await blogService.getById(id);
            return ApiResponseHelper.success(res, blog, 200, "Blog retrieved successfully");
        } catch (error: Error | any | unknown) {
            return ApiResponseHelper.error(
                res,
                error.message || "Internal Server Error",
                error.status || 500
            );
        }
    }
    async updateBlogById(req: Request, res: Response) {
        try {
            const { id }: { id?: string } = req.params;
            const blogData = req.body;
            const blog = await blogService.updateById(id, blogData);
            return ApiResponseHelper.success(res, blog, 200, "Blog updated successfully");
        } catch (error: Error | any | unknown) {
            return ApiResponseHelper.error(
                res,
                error.message || "Internal Server Error",
                error.status || 500
            );
        }
    }
    async deleteBlogById(req: Request, res: Response) {
        try {
            const { id }: { id?: string } = req.params;
            const blog = await blogService.deleteById(id);
            return ApiResponseHelper.success(res, blog, 200,"Blog deleted successfully");
        } catch (error: Error | any | unknown) {
            return ApiResponseHelper.error(
                res,
                error.message || "Internal Server Error",
                error.status || 500
            );
        }
    }
}