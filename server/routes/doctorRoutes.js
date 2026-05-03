import express from "express";
import protect from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";
import { getDoctorProfile } from "../controllers/doctorController.js";

const router = express.Router();

router.get("/profile", protect, authorizeRoles("doctor"), getDoctorProfile);

export default router;