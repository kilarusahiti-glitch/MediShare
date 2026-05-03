import express from "express";
import protect from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";
import {
  addPrescription,
  getMyPrescriptions,
  getPatientPrescriptions,
} from "../controllers/prescriptionController.js";

const router = express.Router();

// Doctor adds prescription
router.post("/", protect, authorizeRoles("doctor"), addPrescription);

// Patient views their prescriptions
router.get("/mine", protect, authorizeRoles("patient"), getMyPrescriptions);

// Doctor views prescriptions of assigned patient
router.get("/patient/:patientId", protect, authorizeRoles("doctor"), getPatientPrescriptions);

export default router;
