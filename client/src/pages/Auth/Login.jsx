import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

/* ─── Google Fonts injected inline ─── */
const FONT_LINK = "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Barlow:wght@300;400;500;600&display=swap";
const MATERIAL_LINK = "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined";

/* ─── Theme exactly matching Landing Page ─── */
const T = {
  bg:       "#f0f4fb",
  bgAlt:    "#e8eef8",
  navy:     "#0f2240",
  navyMid:  "#1a3a6b",
  blue:     "#2e6db4",
  blueSoft: "#5b9bd5",
  sky:      "#a8cef0",
  white:    "#ffffff",
  muted:    "rgba(15,34,64,0.5)",
};

const GLOBAL_CSS = `
  *, *::before, *::after { box-sizing: border-box; }
  body { margin: 0; font-family: 'Barlow', sans-serif; font-weight: 300; background: ${T.bg}; overflow-x: hidden; }

  @import url('${FONT_LINK}');

  /* ── Liquid Glass ── */
  .lg {
    background: rgba(255,255,255,0.45);
    background-blend-mode: luminosity;
    backdrop-filter: blur(18px);
    -webkit-backdrop-filter: blur(18px);
    box-shadow:
      inset 0 1.5px 1px rgba(255,255,255,0.85),
      inset 0 -1px 1px rgba(100,140,210,0.12),
      0 8px 32px rgba(46,109,180,0.10),
      0 2px 8px rgba(46,109,180,0.06);
    position: relative;
    overflow: hidden;
    border: 1px solid rgba(255,255,255,0.65);
  }
  .lg::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    padding: 1.2px;
    background: linear-gradient(160deg,
      rgba(255,255,255,0.85) 0%,
      rgba(180,210,255,0.35) 40%,
      rgba(255,255,255,0.10) 65%,
      rgba(200,220,255,0.55) 100%);
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    pointer-events: none;
  }

  .lg-strong {
    background: rgba(255,255,255,0.62);
    backdrop-filter: blur(40px);
    -webkit-backdrop-filter: blur(40px);
    box-shadow:
      inset 0 2px 2px rgba(255,255,255,0.9),
      inset 0 -1px 1px rgba(100,140,210,0.15),
      0 20px 60px rgba(46,109,180,0.14),
      0 4px 12px rgba(46,109,180,0.08);
    position: relative;
    overflow: hidden;
    border: 1px solid rgba(255,255,255,0.75);
  }
  .lg-strong::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    padding: 1.4px;
    background: linear-gradient(160deg,
      rgba(255,255,255,0.95) 0%,
      rgba(180,210,255,0.40) 40%,
      rgba(255,255,255,0.08) 65%,
      rgba(200,220,255,0.65) 100%);
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    pointer-events: none;
  }
  
  /* ── Input styling ── */
  .glass-input {
    width: 100%;
    padding: 14px 18px;
    border-radius: 12px;
    border: 1px solid rgba(46,109,180,0.2);
    background: rgba(255,255,255,0.6);
    backdrop-filter: blur(10px);
    font-family: 'Barlow', sans-serif;
    font-size: 1rem;
    color: ${T.navy};
    transition: all 0.3s ease;
    outline: none;
  }
  .glass-input:focus {
    background: #fff;
    border-color: ${T.blue};
    box-shadow: 0 0 0 3px rgba(46,109,180,0.15);
  }
  .glass-input::placeholder {
    color: rgba(15,34,64,0.4);
  }

  /* ── Animations ── */
  @keyframes fadeSlideUp {
    from { opacity: 0; transform: translateY(28px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes morphBlob {
    0%   { border-radius: 60% 40% 55% 45% / 50% 60% 40% 50%; transform: translate(0,0) scale(1); }
    50%  { border-radius: 40% 60% 45% 55% / 60% 40% 60% 40%; transform: translate(18px,12px) scale(1.06); }
    100% { border-radius: 55% 45% 60% 40% / 40% 55% 45% 60%; transform: translate(-8px,22px) scale(0.97); }
  }
  @keyframes morphBlob2 {
    0%   { border-radius: 50% 50% 60% 40% / 40% 60% 50% 50%; transform: translate(0,0) scale(1); }
    50%  { border-radius: 60% 40% 50% 50% / 55% 45% 65% 35%; transform: translate(-18px,-8px) scale(1.08); }
    100% { border-radius: 40% 60% 40% 60% / 60% 40% 45% 55%; transform: translate(8px,-18px) scale(0.95); }
  }
  @keyframes ringPulse {
    0%,100% { transform: scale(1); opacity: 1; }
    50%      { transform: scale(1.15); opacity: 0.35; }
  }

  .fade-up { animation: fadeSlideUp 0.8s cubic-bezier(0.16,1,0.3,1) both; }
  
  .btn-primary { transition: all 0.2s ease; }
  .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 12px 40px rgba(15,34,64,0.28) !important; }
  
  .grain {
    position: fixed; inset: 0; pointer-events: none; z-index: 200; opacity: 0.018;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    background-size: 128px 128px;
  }
`;

function BlobBg({ tint = "blue" }) {
  const blobs = tint === "blue" ? [
    { w: 520, h: 520, top: "-160px", left: "-120px",  color: "#c3daf5", blur: 90,  opacity: 0.7,  anim: "morphBlob  16s ease-in-out infinite alternate" },
    { w: 400, h: 400, bottom: "-100px", right: "-80px", color: "#d6eaf8", blur: 80,  opacity: 0.65, anim: "morphBlob2 20s ease-in-out infinite alternate" },
    { w: 280, h: 280, top: "45%", left: "55%",          color: "#b8d4f0", blur: 70,  opacity: 0.45, anim: "morphBlob  12s ease-in-out 3s infinite alternate" },
  ] : [
    { w: 360, h: 360, top: "-60px",    left: "-80px",  color: "#d0e6fa", blur: 80, opacity: 0.6, anim: "morphBlob  18s ease-in-out infinite alternate" },
    { w: 300, h: 300, bottom: "-60px", right: "-60px", color: "#bdd6f2", blur: 75, opacity: 0.55, anim: "morphBlob2 22s ease-in-out infinite alternate" },
  ];
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", zIndex: 0, pointerEvents: "none" }}>
      {blobs.map((b, i) => (
        <div key={i} style={{
          position: "absolute", width: b.w, height: b.h,
          top: b.top, left: b.left, right: b.right, bottom: b.bottom,
          background: b.color, borderRadius: "60% 40% 55% 45% / 50% 60% 40% 50%",
          filter: "blur(" + b.blur + "px)", opacity: b.opacity, animation: b.anim,
        }} />
      ))}
    </div>
  );
}

function MedIcon({ size = 44 }) {
  return (
    <div style={{ position: "relative", width: size, height: size, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "1.5px solid " + T.blueSoft, animation: "ringPulse 2.4s ease-in-out infinite" }} />
      <div style={{ position: "absolute", inset: -8, borderRadius: "50%", border: "1px solid rgba(91,155,213,0.2)", animation: "ringPulse 2.4s ease-in-out 0.5s infinite" }} />
      <svg width={size * 0.68} height={size * 0.68} viewBox="0 0 38 38" fill="none">
        <circle cx="19" cy="19" r="8.5" stroke={T.blue} strokeWidth="1.8" fill="none"/>
        <rect x="16.5" y="12.5" width="5" height="13" rx="1.5" fill={T.blue} opacity="0.9"/>
        <rect x="12.5" y="16.5" width="13" height="5" rx="1.5" fill={T.blue} opacity="0.9"/>
        {[["19","2","19","5.5"],["19","32.5","19","36"],["2","19","5.5","19"],["32.5","19","36","19"]].map(([x1,y1,x2,y2],i) => (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={T.blueSoft} strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
        ))}
      </svg>
    </div>
  );
}

const Login = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState("patient");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const validateField = (name, value) => {
    let message = "";

    if (name === "email") {
      if (!value.trim()) {
        message = "This field is required";
      } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const idRegex = /^[a-zA-Z0-9]+$/;

        if (!emailRegex.test(value) && !idRegex.test(value)) {
          message = "Enter valid email or ID";
        }
      }
    }

    if (name === "password") {
      if (!value.trim()) {
        message = "Password required";
      } else if (value.length < 6) {
        message = "Min 6 characters";
      }
    }

    return message;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailError = validateField("email", formData.email);
    const passwordError = validateField("password", formData.password);

    setErrors({
      email: emailError,
      password: passwordError,
    });

    if (emailError || passwordError) return;
    if (loading) return;
    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login/" + role,
        formData
      );

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("userRole", role);
      }

      if (role === "doctor") {
        const existingDoctors = JSON.parse(localStorage.getItem("registeredDoctors")) || [];
        const savedDoctor = existingDoctors.find(d => d.email?.toLowerCase() === res.data.email?.toLowerCase());
        const doctorEntry = {
          ...(savedDoctor || {}),
          name: res.data.name || savedDoctor?.name,
          email: res.data.email,
          specialization: res.data.specialization || savedDoctor?.specialization,
          hospital: res.data.hospital || savedDoctor?.hospital,
          doctorId: res.data.doctorId || savedDoctor?.doctorId,
        };
        localStorage.setItem("doctorProfile", JSON.stringify(doctorEntry));
        const idx = existingDoctors.findIndex(d => d.email?.toLowerCase() === res.data.email?.toLowerCase());
        if (idx >= 0) existingDoctors[idx] = doctorEntry;
        else existingDoctors.push(doctorEntry);
        localStorage.setItem("registeredDoctors", JSON.stringify(existingDoctors));
        navigate("/doctor/dashboard");
      } else if (role === "patient") {
        const existingProfile = JSON.parse(localStorage.getItem("patientProfile")) || {};
        const existingPatients = JSON.parse(localStorage.getItem("registeredPatients")) || [];
        const savedProfile = existingPatients.find(p => p.email?.toLowerCase() === res.data.email?.toLowerCase());
        const patientEntry = {
          ...existingProfile,
          ...(savedProfile || {}),
          name: res.data.name || savedProfile?.name || existingProfile.name,
          email: res.data.email,
        };
        localStorage.setItem("patientProfile", JSON.stringify(patientEntry));
        const pidx = existingPatients.findIndex(p => p.email?.toLowerCase() === res.data.email?.toLowerCase());
        if (pidx >= 0) existingPatients[pidx] = patientEntry;
        else existingPatients.push(patientEntry);
        localStorage.setItem("registeredPatients", JSON.stringify(existingPatients));
        navigate("/patient/dashboard");
      } else {
        const existingDiags = JSON.parse(localStorage.getItem("registeredDiagnostics")) || [];
        const savedDiag = existingDiags.find(d => d.email?.toLowerCase() === res.data.email?.toLowerCase());
        const resolvedCenterName = res.data.centerName || res.data.name || savedDiag?.centerName;
        const diagEntry = {
          ...(savedDiag || {}),
          centerName: resolvedCenterName,
          email: res.data.email,
          labId: res.data.labId || savedDiag?.labId,
        };
        localStorage.setItem("diagnosticProfile", JSON.stringify(diagEntry));
        const didx = existingDiags.findIndex(d => d.email?.toLowerCase() === res.data.email?.toLowerCase());
        if (didx >= 0) existingDiags[didx] = diagEntry;
        else existingDiags.push(diagEntry);
        localStorage.setItem("registeredDiagnostics", JSON.stringify(existingDiags));
        navigate("/diagnostic/dashboard");
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Login failed");
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      padding: "24px"
    }}>
      <style>{GLOBAL_CSS}</style>
      <link rel="stylesheet" href={FONT_LINK} />
      <link rel="stylesheet" href={MATERIAL_LINK} />
      
      <div className="grain" />
      <BlobBg />

      <div className="lg-strong fade-up" style={{
        width: "100%",
        maxWidth: 440,
        padding: "48px 40px",
        borderRadius: 32,
        zIndex: 2,
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
      }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <MedIcon size={38} />
          <span style={{
            fontFamily: "'Instrument Serif', serif",
            fontStyle: "italic",
            fontSize: "1.7rem",
            color: T.navy
          }}>
            Medi<span style={{ color: T.blue }}>Share</span>
          </span>
        </div>

        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <h2 style={{ fontSize: "1.8rem", fontWeight: 800, color: T.navy, letterSpacing: "-0.03em", margin: "0 0 8px 0" }}>
            Welcome Back
          </h2>
          <p style={{ color: T.muted, fontSize: "0.95rem", margin: 0, lineHeight: 1.5 }}>
            Sign in to access your dashboard and continue your healthcare journey.
          </p>
        </div>

        {/* Role Selector */}
        <div className="lg" style={{ display: "flex", padding: 6, borderRadius: 16, marginBottom: 32, width: "100%" }}>
          {["patient", "doctor", "diagnostic"].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRole(r)}
              style={{
                flex: 1,
                padding: "10px 0",
                borderRadius: 12,
                border: "none",
                background: role === r ? T.white : "transparent",
                color: role === r ? T.blue : T.muted,
                fontWeight: role === r ? 600 : 500,
                boxShadow: role === r ? "0 4px 12px rgba(46,109,180,0.12)" : "none",
                cursor: "pointer",
                transition: "all 0.3s ease",
                fontFamily: "'Barlow', sans-serif",
                textTransform: "capitalize",
                fontSize: "0.9rem"
              }}
            >
              {r}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ width: "100%", display: "flex", flexDirection: "column", gap: 18 }}>
          
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <label style={{ fontSize: "0.85rem", fontWeight: 600, color: T.navy }}>Email or ID</label>
              {errors.email && <span style={{ fontSize: "0.75rem", color: "#ef4444", fontWeight: 500 }}>{errors.email}</span>}
            </div>
            <input
              name="email"
              placeholder="Enter your credential"
              value={formData.email}
              onChange={handleChange}
              className="glass-input"
              style={{ borderColor: errors.email ? "#fca5a5" : "" }}
            />
          </div>

          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <label style={{ fontSize: "0.85rem", fontWeight: 600, color: T.navy }}>Password</label>
              {errors.password && <span style={{ fontSize: "0.75rem", color: "#ef4444", fontWeight: 500 }}>{errors.password}</span>}
            </div>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              className="glass-input"
              style={{ borderColor: errors.password ? "#fca5a5" : "" }}
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary" style={{
            width: "100%",
            marginTop: 14,
            padding: "16px",
            background: loading ? T.navyMid : T.navy,
            color: "#fff",
            border: "none",
            borderRadius: 9999,
            cursor: loading ? "not-allowed" : "pointer",
            fontWeight: 700,
            fontSize: "1.05rem",
            fontFamily: "'Barlow', sans-serif",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            boxShadow: "0 10px 30px rgba(15,34,64,0.18)",
            opacity: loading ? 0.8 : 1
          }}>
            {loading ? "Signing In..." : "Sign In to Portal"}
            {!loading && <span className="material-symbols-outlined" style={{ fontSize: 20 }}>arrow_forward</span>}
          </button>
        </form>

        <div style={{ marginTop: 32, fontSize: "0.9rem", color: T.muted }}>
          Don't have an account?{" "}
          <button onClick={() => navigate("/register")} style={{
            background: "none",
            border: "none",
            color: T.blue,
            cursor: "pointer",
            fontWeight: 600,
            fontFamily: "'Barlow', sans-serif",
            padding: 0,
            transition: "color 0.2s"
          }}
          onMouseOver={(e) => e.target.style.color = T.navy}
          onMouseOut={(e) => e.target.style.color = T.blue}>
            Create one
          </button>
        </div>

      </div>
    </div>
  );
};

export default Login;