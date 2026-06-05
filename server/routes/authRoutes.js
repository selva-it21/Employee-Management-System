import { Router } from "express";
import { changepassword, login, session } from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";

const authRouter = Router();

authRouter.post("/login", login)
authRouter.get("/session", protect, session)
authRouter.post("/change-password", protect, changepassword)

export default authRouter
