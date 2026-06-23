// src/repositories/blog.repository.ts

import { Schema } from "mongoose";
import BlogModel from "../models/blog.model";

export interface IBlogRepository {
    getBlogByAuthorId(id: string);
    // 5 common repository
    createBlog(blogData: any);
    getAll();
    getById(id: string);
    updateById(id: string, data: any);
    deleteById(id: string);
    // pagination
    getPaginatedBlogs(page: number, limit: number, search?: string)
}

export class BlogMongoRepository implements IBlogRepository {
    async createBlog(blogData: any) {
        const newBlog = await BlogModel.create(blogData);
        return newBlog;
    }
    async getBlogByAuthorId(id: string) {
        const blogId = new Schema.Types.ObjectId(id);

        const blogs = await BlogModel
            .find({ authorId: blogId })
            .populate("authorId", "username email firstName");
        return blogs;
    }
    async getAll() {
        const blogs = await BlogModel.find().populate("authorId", "username email firstName");
        return blogs;
    }
    async getPaginatedBlogs(page: number, limit: number, search?: string) {
        const skip = (page - 1) * limit;
        // if page is 1, limit is 10, skip is 0, so it will return the first 10 blogs
        // if page is 3, limit is 10, skip is 20, so it will return the blogs from 21 to 30
        const query: any = {};
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: "i" } },
                { content: { $regex: search, $options: "i" } }
            ];
        }
        const blogs = await BlogModel.find(query)
            .skip(skip)
            .limit(limit)
            .populate("authorId", "username email firstName");
        const totalBlogs = await BlogModel.countDocuments(query);
        return {
            data: blogs,
            total: totalBlogs
        };
    }

    async getById(id: string) {
        const blog = await BlogModel.findById(id).populate("authorId", "username email firstName");
        return blog;
    }
    async updateById(id: string, data: any) {
        const blog = await BlogModel.findByIdAndUpdate(id, data, { new: true }).populate("authorId", "username email firstName");
        return blog;
    }
    async deleteById(id: string) {
        const blog = await BlogModel.findByIdAndDelete(id);
        return blog;
    }
}