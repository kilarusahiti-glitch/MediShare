import mongoose from "mongoose";

const prescriptionSchema = new mongoose.Schema({
  patient:  { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  doctor:   { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  medicines: [
    {
      name:     { type: String, required: true },
      dosage:   { type: String },
      duration: { type: String },
    }
  ],
  notes:    { type: String, default: "" },
}, { timestamps: true });

export default mongoose.model("Prescription", prescriptionSchema);
