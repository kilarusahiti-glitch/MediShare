import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SplashScreen from "./pages/SplashScreen";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import PatientDashboard from "./pages/Patient/PatientDashboard";
import PatientProfileForm from "./pages/Patient/PatientProfileForm";
import DoctorDashboard from "./pages/Doctor/DoctorDashboard";
import DiagnosticDashboard from "./pages/Diagnostic/DiagnosticDashboard";

function AppInner() {
  const [splashDone, setSplashDone] = useState(false);

  const handleSplashDone = () => {
    setSplashDone(true);
  };

  return (
    <>
      {!splashDone && <SplashScreen onDone={handleSplashDone} />}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/patient-profile-form" element={<PatientProfileForm />} />
        <Route path="/patient/profile" element={<PatientProfileForm />} />
        <Route path="/patient/dashboard" element={<PatientDashboard />} />

        <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
        <Route path="/diagnostic/dashboard" element={<DiagnosticDashboard />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppInner />
    </BrowserRouter>
  );
}

export default App;