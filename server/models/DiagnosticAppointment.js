import mongoose from "mongoose";

const diagnosticAppointmentSchema = new mongoose.Schema({
  patient:    { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  diagnostic: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  testName:   { type: String, required: true },
  date:       { type: String, required: true },
  time:       { type: String, required: true },
  status:     { type: String, enum: ["Confirmed", "Pending", "Cancelled"], default: "Confirmed" },
}, { timestamps: true });

export default mongoose.model("DiagnosticAppointment", diagnosticAppointmentSchema);
