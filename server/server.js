import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes.js";
import patientRoutes from "./routes/patientRoutes.js";
import doctorRoutes from "./routes/doctorRoutes.js";
import diagnosticRoutes from "./routes/diagnosticRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import prescriptionRoutes from "./routes/prescriptionRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

app.use("/api/auth",          authRoutes);
app.use("/api/patient",       patientRoutes);
app.use("/api/doctor",        doctorRoutes);
app.use("/api/diagnostic",    diagnosticRoutes);
app.use("/api/appointments",  appointmentRoutes);
app.use("/api/reports",       reportRoutes);
app.use("/api/prescriptions", prescriptionRoutes);

app.get("/", (req, res) => {
  res.send("API Running...");
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });
