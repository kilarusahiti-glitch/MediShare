import mongoose from "mongoose";

const medicineSchema = new mongoose.Schema({
  name: { type: String, required: true },
  dosage: String,
  stock: { type: Number, required: true },
  reminderThreshold: { type: Number, default: 5 },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  prescribedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
});

export default mongoose.model("Medicine", medicineSchema);
