import mongoose from "mongoose";

const diagnosticProfileSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    centerName: String,
    labId: String,
  },
  { timestamps: true }
);

export default mongoose.model(
  "DiagnosticProfile",
  diagnosticProfileSchema
);