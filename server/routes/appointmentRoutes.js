import express from "express";
import protect from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";
import {
  bookDoctorAppointment,
  getMyDoctorAppointments,
  getDoctorPatients,
  getPatientRecord,
  bookDiagnosticAppointment,
  getMyDiagnosticAppointments,
  getDiagnosticBookings,
} from "../controllers/appointmentController.js";

const router = express.Router();

// Patient books doctor appointment
router.post("/doctor", protect, authorizeRoles("patient"), bookDoctorAppointment);

// Patient views their doctor appointments
router.get("/doctor/mine", protect, authorizeRoles("patient"), getMyDoctorAppointments);

// Doctor views all their patients
router.get("/doctor/patients", protect, authorizeRoles("doctor"), getDoctorPatients);

// Doctor views one patient's full record
router.get("/doctor/patient/:patientId", protect, authorizeRoles("doctor"), getPatientRecord);

// Patient books diagnostic test
router.post("/diagnostic", protect, authorizeRoles("patient"), bookDiagnosticAppointment);

// Patient views their diagnostic appointments
router.get("/diagnostic/mine", protect, authorizeRoles("patient"), getMyDiagnosticAppointments);

// Diagnostic center views all bookings
router.get("/diagnostic/bookings", protect, authorizeRoles("diagnostic"), getDiagnosticBookings);

export default router;
