// src/routes/user.route.ts
import { UserController } from "../controllers/user.controller";
import { Router } from "express";
import { authorizedMiddleware } from "../middlewares/authorized.middleware";
import { uploads } from "../middlewares/upload.middleware";
const userController = new UserController();
const router = Router();

router.post("/register", userController.createUser);
router.post("/login", userController.loginUser);

router.put(
    "/update",
    authorizedMiddleware, // user should be logged in -> req.user
    uploads.single("profileImage"), // multer for file upload -> req.file
    userController.updateUser
);
router.get(
    "/whoami",
    authorizedMiddleware, // user should be logged in -> req.user
    userController.whoami
);


router.post(
    "/request-password-reset",
    userController.sendResetPasswordEmail
);

router.post(
    "/reset-password/:token",
    userController.resetPassword
);
export default router;