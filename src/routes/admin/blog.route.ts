// src/routes/admin/blog.route.ts
// for each role try to create different route
import { Router } from "express";
import { AdminBlogController } from "../../controllers/admin/blog.controller";
import { authorizedMiddleware, isAdmin } from "../../middlewares/authorized.middleware";

const adminBlogRouter = Router();
const adminBlogController = new AdminBlogController();

// apply middlewares to all routes in this router
adminBlogRouter.use(authorizedMiddleware, isAdmin); // only admin can access these routes

// 5 common routes
adminBlogRouter.post(
    "/",
    adminBlogController.createBlog
);
adminBlogRouter.get(
    "/",
    adminBlogController.getBlogPaginated
);
adminBlogRouter.get(
    "/:id",
    adminBlogController.getBlogById
);
adminBlogRouter.put(
    "/:id",
    adminBlogController.updateBlogById
);
adminBlogRouter.delete(
    "/:id",
    adminBlogController.deleteBlogById
);

export default adminBlogRouter;