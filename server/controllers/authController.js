import bcrypt from "bcryptjs";
import User from "../models/User.js";
import PatientProfile from "../models/PatientProfile.js";
import DoctorProfile from "../models/DoctorProfile.js";
import DiagnosticProfile from "../models/DiagnosticProfile.js";
import generateToken from "../utils/generateTokens.js";

export const register = async (req, res) => {
  const { role } = req.params;
  try {
    const { email, password, ...profileData } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "An account with this email already exists. Please use a different email." });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: hashedPassword,
      role,
    });

    // Create profile based on role
    if (role === "patient") {
      await PatientProfile.create({ user: user._id, fullName: profileData.name, ...profileData });
    }

    if (role === "doctor") {
      await DoctorProfile.create({
        user: user._id,
        fullName: profileData.name,
        specialization: profileData.specialization,
        hospital: profileData.hospital,
        experience: profileData.experience,
      });
    }

    if (role === "diagnostic") {
      await DiagnosticProfile.create({ user: user._id, centerName: profileData.name, ...profileData });
    }

    res.json({ 
      message: "Registered successfully",
      token: generateToken(user._id, user.role),
      role: user.role
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: error.message || "Server Error" });
  }
};

export const login = async (req, res) => {
  const { role } = req.params;
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email, role });
    if (!user) {
      console.log(`Login failed: no user found with email=${email} role=${role}`);
      return res.status(400).json({ message: `No ${role} account found with that email` });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log(`Login failed: wrong password for email=${email} role=${role}`);
      return res.status(400).json({ message: "Incorrect password" });
    }

    let profileData = {};
    if (role === "doctor") {
      const profile = await DoctorProfile.findOne({ user: user._id });
      if (profile) {
        profileData = {
          name: profile.fullName,
          specialization: profile.specialization,
          hospital: profile.hospital,
          doctorId: profile.doctorId,
        };
      }
    } else if (role === "patient") {
      const profile = await PatientProfile.findOne({ user: user._id });
      if (profile) profileData = { name: profile.fullName };
    } else if (role === "diagnostic") {
      const profile = await DiagnosticProfile.findOne({ user: user._id });
      if (profile) profileData = { centerName: profile.centerName || profile.name, labId: profile.labId };
    }

    res.json({
      token: generateToken(user._id, user.role),
      role: user.role,
      email: user.email,
      ...profileData,
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Server Error" });
  }
};