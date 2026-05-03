import express from "express";
import protect from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";
import { getPatientProfile } from "../controllers/patientController.js";

const router = express.Router();

router.get("/profile", protect, authorizeRoles("patient"), getPatientProfile);

export default router;
