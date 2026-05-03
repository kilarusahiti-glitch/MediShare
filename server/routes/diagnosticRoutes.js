import express from "express";
import protect from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";
import { getDiagnosticProfile } from "../controllers/diagnosticController.js";

const router = express.Router();

router.get("/profile", protect, authorizeRoles("diagnostic"), getDiagnosticProfile);

export default router;