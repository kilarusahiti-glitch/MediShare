import Prescription from "../models/Prescription.js";
import DoctorAppointment from "../models/DoctorAppointment.js";

// POST /api/prescriptions  — doctor adds prescription for a patient
export const addPrescription = async (req, res) => {
  try {
    const { patientId, medicines, notes } = req.body;
    const appt = await DoctorAppointment.findOne({ doctor: req.user._id, patient: patientId });
    if (!appt) return res.status(403).json({ message: "Access denied" });

    const prescription = await Prescription.create({
      patient:  patientId,
      doctor:   req.user._id,
      medicines, notes,
    });
    res.status(201).json({ message: "Prescription added", prescription });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/prescriptions/mine  — patient sees their prescriptions
export const getMyPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Prescription.find({ patient: req.user._id })
      .populate("doctor", "email")
      .sort({ createdAt: -1 });
    res.json(prescriptions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/prescriptions/patient/:patientId  — doctor views prescriptions of assigned patient
export const getPatientPrescriptions = async (req, res) => {
  try {
    const { patientId } = req.params;
    const appt = await DoctorAppointment.findOne({ doctor: req.user._id, patient: patientId });
    if (!appt) return res.status(403).json({ message: "Access denied" });

    const prescriptions = await Prescription.find({ patient: patientId })
      .populate("doctor", "email")
      .sort({ createdAt: -1 });
    res.json(prescriptions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
