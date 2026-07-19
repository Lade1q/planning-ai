import { Router } from "express";
import {
  registerController,
  loginController,
  refreshController,
  getMeController,
} from "../controllers/auth.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const authRouter = Router();

// Public routes
authRouter.post("/register", registerController);
authRouter.post("/login", loginController);
authRouter.post("/refresh", refreshController);

// Protected routes
authRouter.get("/me", authMiddleware, getMeController);

export { authRouter };
