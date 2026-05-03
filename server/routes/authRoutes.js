import express from "express";
import { register, login } from "../controllers/authController.js";

const router = express.Router();

router.post("/register/:role", register);
router.post("/login/:role", login);

export default router;
