import mongoose from "mongoose";

const patientProfileSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    fullName: String,
    phone: String,
    age: Number,
    gender: String,
    bloodGroup: String,
    insurance: String,
    emergencyName: String,
    emergencyPhone: String,
  },
  { timestamps: true }
);

export default mongoose.model("PatientProfile", patientProfileSchema);