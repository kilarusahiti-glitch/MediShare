import Report from "../models/Report.js";
import DoctorAppointment from "../models/DoctorAppointment.js";

// POST /api/reports/upload  — diagnostic uploads a report for a patient
export const uploadReport = async (req, res) => {
  try {
    const { patientId, doctorId, fileName, fileUrl, fileType, fileSize, notes } = req.body;
    const report = await Report.create({
      patient:    patientId,
      diagnostic: req.user._id,
      doctor:     doctorId || null,
      fileName, fileUrl, fileType, fileSize, notes,
    });
    res.status(201).json({ message: "Report uploaded", report });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/reports/mine  — patient sees their own reports
export const getMyReports = async (req, res) => {
  try {
    const reports = await Report.find({ patient: req.user._id })
      .populate("diagnostic", "email")
      .populate("doctor", "email")
      .sort({ createdAt: -1 });
    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/reports/patient/:patientId  — doctor views reports of an assigned patient
export const getPatientReports = async (req, res) => {
  try {
    const { patientId } = req.params;
    const appt = await DoctorAppointment.findOne({ doctor: req.user._id, patient: patientId });
    if (!appt) return res.status(403).json({ message: "Access denied" });

    const reports = await Report.find({ patient: patientId })
      .populate("diagnostic", "email")
      .sort({ createdAt: -1 });
    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/reports/uploaded  — diagnostic sees all reports they uploaded
export const getUploadedReports = async (req, res) => {
  try {
    const reports = await Report.find({ diagnostic: req.user._id })
      .populate("patient", "email")
      .sort({ createdAt: -1 });
    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
