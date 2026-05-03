import DiagnosticProfile from "../models/DiagnosticProfile.js";

export const getDiagnosticProfile = async (req, res) => {
  const profile = await DiagnosticProfile.findOne({ user: req.user._id });
  res.json(profile);
};