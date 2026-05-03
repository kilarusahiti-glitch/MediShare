import DoctorAppointment from "../models/DoctorAppointment.js";
import DiagnosticAppointment from "../models/DiagnosticAppointment.js";
import PatientProfile from "../models/PatientProfile.js";
import User from "../models/User.js";

// POST /api/appointments/doctor
export const bookDoctorAppointment = async (req, res) => {
  try {
    const { doctorId, date, time, note } = req.body;
    const doctor = await User.findById(doctorId);
    if (!doctor || doctor.role !== "doctor")
      return res.status(404).json({ message: "Doctor not found" });

    const appt = await DoctorAppointment.create({
      patient: req.user._id,
      doctor: doctorId,
      date, time, note,
    });
    res.status(201).json({ message: "Appointment booked", appointment: appt });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/appointments/doctor/mine  — patient sees their own doctor appointments
export const getMyDoctorAppointments = async (req, res) => {
  try {
    const appts = await DoctorAppointment.find({ patient: req.user._id })
      .populate("doctor", "email")
      .sort({ createdAt: -1 });
    res.json(appts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/appointments/doctor/patients  — doctor sees all their patients
export const getDoctorPatients = async (req, res) => {
  try {
    const appts = await DoctorAppointment.find({ doctor: req.user._id })
      .populate("patient", "email")
      .sort({ createdAt: -1 });

    // attach patient profile to each appointment
    const result = await Promise.all(appts.map(async (a) => {
      const profile = await PatientProfile.findOne({ user: a.patient._id });
      return { ...a.toObject(), patientProfile: profile };
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/appointments/doctor/patient/:patientId  — doctor views one patient's full record
export const getPatientRecord = async (req, res) => {
  try {
    const { patientId } = req.params;
    // verify this doctor has an appointment with this patient
    const appt = await DoctorAppointment.findOne({ doctor: req.user._id, patient: patientId });
    if (!appt) return res.status(403).json({ message: "Access denied" });

    const profile = await PatientProfile.findOne({ user: patientId });
    res.json({ profile });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/appointments/diagnostic
export const bookDiagnosticAppointment = async (req, res) => {
  try {
    const { diagnosticId, testName, date, time } = req.body;
    const center = await User.findById(diagnosticId);
    if (!center || center.role !== "diagnostic")
      return res.status(404).json({ message: "Diagnostic center not found" });

    const appt = await DiagnosticAppointment.create({
      patient: req.user._id,
      diagnostic: diagnosticId,
      testName, date, time,
    });
    res.status(201).json({ message: "Test booked", appointment: appt });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/appointments/diagnostic/mine  — patient sees their diagnostic appointments
export const getMyDiagnosticAppointments = async (req, res) => {
  try {
    const appts = await DiagnosticAppointment.find({ patient: req.user._id })
      .populate("diagnostic", "email")
      .sort({ createdAt: -1 });
    res.json(appts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/appointments/diagnostic/bookings  — diagnostic center sees all bookings
export const getDiagnosticBookings = async (req, res) => {
  try {
    const appts = await DiagnosticAppointment.find({ diagnostic: req.user._id })
      .populate("patient", "email")
      .sort({ createdAt: -1 });

    const result = await Promise.all(appts.map(async (a) => {
      const profile = await PatientProfile.findOne({ user: a.patient._id });
      return { ...a.toObject(), patientProfile: profile };
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
