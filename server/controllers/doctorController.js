import DoctorProfile from "../models/DoctorProfile.js";

export const getDoctorProfile = async (req, res) => {
  const profile = await DoctorProfile.findOne({ user: req.user._id });
  res.json(profile);
};