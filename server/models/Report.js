import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
  patient:    { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  diagnostic: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  doctor:     { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  fileName:   { type: String, required: true },
  fileUrl:    { type: String, required: true },
  fileType:   { type: String },
  fileSize:   { type: String },
  notes:      { type: String, default: "" },
}, { timestamps: true });

export default mongoose.model("Report", reportSchema);
