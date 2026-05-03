import express from "express";
import protect from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";
import {
  uploadReport,
  getMyReports,
  getPatientReports,
  getUploadedReports,
} from "../controllers/reportController.js";

const router = express.Router();

// Diagnostic uploads a report
router.post("/upload", protect, authorizeRoles("diagnostic"), uploadReport);

// Patient views their own reports
router.get("/mine", protect, authorizeRoles("patient"), getMyReports);

// Doctor views reports of an assigned patient
router.get("/patient/:patientId", protect, authorizeRoles("doctor"), getPatientReports);

// Diagnostic views all reports they uploaded
router.get("/uploaded", protect, authorizeRoles("diagnostic"), getUploadedReports);

export default router;
