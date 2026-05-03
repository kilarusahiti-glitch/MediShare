import PatientProfile from "../models/PatientProfile.js";

export const getPatientProfile = async (req, res) => {
  const profile = await PatientProfile.findOne({ user: req.user._id });
  res.json(profile);
};