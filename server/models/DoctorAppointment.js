import mongoose from "mongoose";

const doctorAppointmentSchema = new mongoose.Schema({
  patient:  { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  doctor:   { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date:     { type: String, required: true },
  time:     { type: String, required: true },
  note:     { type: String, default: "" },
  status:   { type: String, enum: ["Confirmed", "Pending", "Cancelled"], default: "Confirmed" },
}, { timestamps: true });

export default mongoose.model("DoctorAppointment", doctorAppointmentSchema);
