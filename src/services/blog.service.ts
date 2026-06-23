// src/services/blog.service.ts

import { CreateBlogDTO } from "../dtos/blog.dto";
import { BlogMongoRepository } from "../repositories/blog.repository";
import { HttpException } from "../exceptions/http-exception";
const blogRepository = new BlogMongoRepository();
export class BlogService {
    async createBlog(blogData: CreateBlogDTO) {
        const blog = await blogRepository.createBlog(blogData);
        if (!blog) {
            throw new HttpException(500, "Failed to create blog");
        }
        return blog;
    }
    async getBlogsByAuthorId(id: string) {
        const blogs = await blogRepository.getBlogByAuthorId(id);
        if (!blogs) {
            throw new HttpException(404, "No blogs found for this author");
        }
        return blogs;
    }

    async getAll() {
        const blogs = await blogRepository.getAll();
        if (!blogs) {
            throw new HttpException(404, "No blogs found");
        }
        return blogs;
    }

    async getPaginatedBlogs(page?: string, limit?: string, search?: string) {
        const currentPage = page ? parseInt(page) : 1;
        const currentLimit = limit ? parseInt(limit) : 10;

        const {data, total} = await blogRepository.getPaginatedBlogs(currentPage, currentLimit, search);
        if (!data ) {
            throw new HttpException(404, "No blogs found");
        }
        const totalPages = Math.ceil(total / currentLimit); // convert total to number of pages
        const pagination = {
                total,
                page: currentPage,
                limit: currentLimit,
                totalPages
        }
        return { data, pagination };
    }

    async getById(id: string) {
        const blog = await blogRepository.getById(id);
        if (!blog) {
            throw new HttpException(404, "Blog not found");
        }
        return blog;
    }
    // implement DTO per data 
    async updateById(id: string, data: any) {
        const blog = await blogRepository.updateById(id, data);
        if (!blog) {
            throw new HttpException(404, "Blog not found");
        }
        return blog;
    }

    async deleteById(id: string) {
        const blog = await blogRepository.deleteById(id);
        if (!blog) {
            throw new HttpException(404, "Blog not found");
        }
        return blog;
    }
}