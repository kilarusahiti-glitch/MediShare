import { useState, useEffect } from "react";
import "../../styles/patientDashboard.css";
import "../../styles/doctorDashboard.css";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

/* ─── Helpers ─── */
const getFileIcon = (type = "") => {
  if (type.includes("pdf")) return "📄";
  if (type.includes("image")) return "🖼️";
  if (type.includes("word") || type.includes("document")) return "📝";
  return "📁";
};

const openFile = (f) => {
  if (!f.content) { alert("File content not available. Ask the diagnostic center to re-upload."); return; }
  const w = window.open();
  if (w) {
    w.document.write(`<iframe src="${f.content}" style="border:none;width:100vw;height:100vh;"></iframe>`);
    w.document.body.style.margin = "0";
    w.document.title = f.name || "Report";
  } else {
    alert("Please allow popups to view this file.");
  }
};

/* ─── Appointment Detail Modal ─── */
const ApptDetailModal = ({ appt, onClose }) => {
  if (!appt) return null;
  const d = new Date(appt.date);
  const isToday = d.toDateString() === new Date().toDateString();
  const isPast  = d < new Date(new Date().setHours(0,0,0,0));
  const statusColor = isPast ? "#6b7a99" : isToday ? "#059669" : "#2e6db4";
  const statusBg    = isPast ? "#f4f6fb"  : isToday ? "#f0fdf4"  : "#f0f6ff";
  const statusLabel = isPast ? "Completed" : isToday ? "Today"   : "Upcoming";

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(15,28,53,0.45)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: 20, width: "100%", maxWidth: 420, boxShadow: "0 24px 48px rgba(15,28,53,0.18)", overflow: "hidden" }}>
        {/* Banner */}
        <div style={{ background: "linear-gradient(135deg,#0f2240,#1a3a6b)", padding: "24px 24px 20px", position: "relative" }}>
          <button onClick={onClose} style={{ position: "absolute", top: 14, right: 14, background: "rgba(255,255,255,0.12)", border: "none", borderRadius: "50%", width: 30, height: 30, cursor: "pointer", color: "#fff", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 52, height: 52, borderRadius: 14, background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 700, color: "#fff", flexShrink: 0 }}>
              {appt.patientName?.split(" ").map(n => n[0]).join("").substring(0,2)}
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 700, color: "#fff" }}>{appt.patientName}</h3>
              <span style={{ fontSize: "0.74rem", color: "rgba(168,206,240,0.8)" }}>{appt.patientEmail || "No email on file"}</span>
            </div>
          </div>
        </div>
        {/* Body */}
        <div style={{ padding: "20px 24px 24px", display: "flex", flexDirection: "column", gap: 12 }}>
          {/* Status pill */}
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <span style={{ fontSize: "0.72rem", fontWeight: 700, padding: "4px 12px", borderRadius: 9999, background: statusBg, color: statusColor }}>{statusLabel}</span>
          </div>
          {[
            { icon: "📅", label: "Date",           value: `${DAYS[d.getDay()]}, ${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}` },
            { icon: "🕐", label: "Time",           value: appt.time || "—" },
            { icon: "🏥", label: "Hospital",       value: appt.hospital || "—" },
            { icon: "🩺", label: "Specialization", value: appt.specialization || "—" },
            { icon: "📝", label: "Note",           value: appt.note || "No notes" },
          ].map(row => (
            <div key={row.label} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "10px 14px", background: "#f8faff", borderRadius: 10 }}>
              <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>{row.icon}</span>
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontSize: "0.67rem", fontWeight: 700, color: "#8a96b0", textTransform: "uppercase", letterSpacing: ".08em" }}>{row.label}</p>
                <p style={{ margin: 0, fontSize: "0.88rem", color: "#0f1c35", fontWeight: 500, marginTop: 2 }}>{row.value}</p>
              </div>
            </div>
          ))}
          <button onClick={onClose} style={{ marginTop: 4, width: "100%", padding: "11px", background: "#0f2240", color: "#fff", border: "none", borderRadius: 10, fontWeight: 600, fontSize: "0.88rem", cursor: "pointer" }}>Close</button>
        </div>
      </div>
    </div>
  );
};

/* ─── Appointment Schedule Module (Dashboard tab) ─── */
const AppointmentModule = ({ doctorName }) => {
  const [appts, setAppts] = useState([]);
  const [current, setCurrent] = useState(() => { const t = new Date(); return { month: t.getMonth(), year: t.getFullYear() }; });
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const all = JSON.parse(localStorage.getItem("allAppointments")) || [];
    setAppts(all.filter(a => a.doctor === doctorName));
  }, [doctorName]);

  const today   = new Date();
  const todayMid = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const upcoming = appts.filter(a => new Date(a.date) >= todayMid).sort((a,b) => new Date(a.date)-new Date(b.date));

  /* build calendar map — all appts regardless of status */
  const apptMap = {};
  appts.forEach(a => {
    const d = new Date(a.date);
    const key = `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`;
    if (!apptMap[key]) apptMap[key] = [];
    apptMap[key].push(a);
  });

  const daysInMonth = new Date(current.year, current.month+1, 0).getDate();
  const firstDay   = new Date(current.year, current.month, 1).getDay();
  const cells = Array(firstDay).fill(null).concat(Array.from({ length: daysInMonth }, (_, i) => i+1));

  return (
    <>
      {selected && <ApptDetailModal appt={selected} onClose={() => setSelected(null)} />}
      <div className="card" style={{ marginTop: 24, padding: 0, overflow: "hidden" }}>
        <div style={{ padding: "18px 22px 14px", borderBottom: "1px solid #f0f4fb" }}>
          <h3 className="card-title" style={{ margin: 0 }}>Appointment Schedule</h3>
          <p className="card-sub" style={{ fontSize: "0.74rem", marginTop: 2 }}>Click any appointment to view details</p>
        </div>
        <div style={{ padding: "18px 22px", display: "flex", gap: 24 }}>
          {/* Calendar */}
          <div style={{ flex: 1 }}>
            <div className="cal-header">
              <button className="cal-nav" onClick={() => setCurrent(c => ({ month: c.month===0?11:c.month-1, year: c.month===0?c.year-1:c.year }))}>&#8249;</button>
              <h2 style={{ fontSize: "1rem" }}>{MONTHS[current.month]} {current.year}</h2>
              <button className="cal-nav" onClick={() => setCurrent(c => ({ month: c.month===11?0:c.month+1, year: c.month===11?c.year+1:c.year }))}>&#8250;</button>
            </div>
            <div className="cal-grid-days">{DAYS.map(d => <div key={d} className="cal-day-name">{d}</div>)}</div>
            <div className="cal-grid">
              {cells.map((d, i) => {
                if (!d) return <div key={i} className="cal-cell empty" />;
                const key = `${current.year}-${current.month+1}-${d}`;
                const dayAppts = apptMap[key] || [];
                const isToday = d===today.getDate() && current.month===today.getMonth() && current.year===today.getFullYear();
                const isPast  = new Date(current.year, current.month, d) < todayMid;
                return (
                  <div key={i} className={`cal-cell ${isToday?"today":""} ${dayAppts.length?"has-appt":""}`} style={{ cursor: dayAppts.length ? "pointer" : "default" }}>
                    <span className="cal-date">{d}</span>
                    {dayAppts.map((a, idx) => (
                      <div key={idx}
                        className={`appt-chip ${isPast?"appt-chip-past":"appt-chip-upcoming"}`}
                        style={{ cursor: "pointer" }}
                        onClick={e => { e.stopPropagation(); setSelected(a); }}
                      >
                        <span>{a.time} · {a.patientName}</span>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Upcoming list */}
          <div style={{ width: 230, flexShrink: 0 }}>
            <p style={{ fontSize: "0.72rem", fontWeight: 700, color: "#0f1c35", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 10 }}>Upcoming ({upcoming.length})</p>
            {upcoming.length === 0 ? (
              <div style={{ textAlign: "center", padding: "24px 0", color: "#8a96b0", fontSize: "0.8rem" }}>No upcoming appointments</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 340, overflowY: "auto" }}>
                {upcoming.map((a, i) => {
                  const d = new Date(a.date);
                  const isApptToday = d.toDateString() === today.toDateString();
                  return (
                    <div key={i} onClick={() => setSelected(a)}
                      style={{ background: isApptToday?"#f0fdf4":"#f8faff", border: `1.5px solid ${isApptToday?"#bbf7d0":"#dce8f8"}`, borderRadius: 10, padding: "10px 12px", display: "flex", gap: 10, alignItems: "flex-start", cursor: "pointer", transition: "box-shadow .2s" }}
                      onMouseEnter={e => e.currentTarget.style.boxShadow="0 4px 12px rgba(46,109,180,0.12)"}
                      onMouseLeave={e => e.currentTarget.style.boxShadow=""}
                    >
                      <div style={{ textAlign: "center", minWidth: 36, background: isApptToday?"#059669":"#2e6db4", color: "#fff", borderRadius: 8, padding: "4px 0", flexShrink: 0 }}>
                        <div style={{ fontSize: "1rem", fontWeight: 800, lineHeight: 1 }}>{d.getDate()}</div>
                        <div style={{ fontSize: "0.52rem", fontWeight: 600, letterSpacing: ".06em", textTransform: "uppercase" }}>{MONTHS[d.getMonth()].slice(0,3)}</div>
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <strong style={{ fontSize: "0.82rem", color: "#0f1c35", display: "block", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{a.patientName}</strong>
                        <span style={{ fontSize: "0.7rem", color: "#6b7a99" }}>🕐 {a.time}</span>
                        {isApptToday && <div style={{ fontSize: "0.62rem", color: "#059669", fontWeight: 700, marginTop: 2 }}>TODAY</div>}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

/* ─── Full Appointment Calendar (Appointments tab) ─── */
const AppointmentCalendarFull = () => {
  const today = new Date();
  const [current, setCurrent] = useState({ month: today.getMonth(), year: today.getFullYear() });
  const [apptMap, setApptMap] = useState({});
  const [allAppts, setAllAppts] = useState([]);

  const load = () => {
    const docData = JSON.parse(localStorage.getItem("doctorProfile")) || {};
    const saved = JSON.parse(localStorage.getItem("allAppointments")) || [];
    const mine = saved.filter(a => a.doctor === docData.name);
    setAllAppts(mine);
    const map = {};
    mine.forEach(a => {
      const d = new Date(a.date);
      const key = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
      if (!map[key]) map[key] = [];
      map[key].push({ time: a.time, patient: a.patientName, id: a.id });
    });
    setApptMap(map);
  };
  useEffect(() => { load(); }, []);

  const daysInMonth = new Date(current.year, current.month + 1, 0).getDate();
  const firstDay = new Date(current.year, current.month, 1).getDay();
  const cells = Array(firstDay).fill(null).concat(Array.from({ length: daysInMonth }, (_, i) => i + 1));
  const todayMid = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  const handleDelete = (key, idx) => {
    const chip = (apptMap[key] || [])[idx];
    setApptMap(prev => { const u = [...(prev[key] || [])]; u.splice(idx, 1); return { ...prev, [key]: u }; });
    if (chip?.id) {
      const ex = JSON.parse(localStorage.getItem("allAppointments")) || [];
      localStorage.setItem("allAppointments", JSON.stringify(ex.filter(a => a.id !== chip.id)));
      setAllAppts(prev => prev.filter(a => a.id !== chip.id));
    }
  };

  const todayMidnight = todayMid;
  const upcoming = allAppts.filter(a => new Date(a.date) >= todayMidnight).sort((a, b) => new Date(a.date) - new Date(b.date));
  const past = allAppts.filter(a => new Date(a.date) < todayMidnight).sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div className="card">
        <div className="cal-header">
          <button className="cal-nav" onClick={() => setCurrent(c => ({ month: c.month === 0 ? 11 : c.month - 1, year: c.month === 0 ? c.year - 1 : c.year }))}>&#8249;</button>
          <h2>{MONTHS[current.month]} {current.year}</h2>
          <button className="cal-nav" onClick={() => setCurrent(c => ({ month: c.month === 11 ? 0 : c.month + 1, year: c.month === 11 ? c.year + 1 : c.year }))}>&#8250;</button>
        </div>
        <div className="cal-grid-days">{DAYS.map(d => <div key={d} className="cal-day-name">{d}</div>)}</div>
        <div className="cal-grid">
          {cells.map((d, i) => {
            if (!d) return <div key={i} className="cal-cell empty" />;
            const key = `${current.year}-${current.month + 1}-${d}`;
            const appts = apptMap[key] || [];
            const isToday = d === today.getDate() && current.month === today.getMonth() && current.year === today.getFullYear();
            const isPast = new Date(current.year, current.month, d) < todayMid;
            return (
              <div key={i} className={`cal-cell ${isToday ? "today" : ""} ${appts.length ? "has-appt" : ""}`} style={{ cursor: "default" }}>
                <span className="cal-date">{d}</span>
                {appts.map((a, idx) => (
                  <div key={idx} className={`appt-chip ${isPast ? "appt-chip-past" : "appt-chip-upcoming"}`}>
                    <span>{a.time} · {a.patient}</span>
                    <button onClick={e => { e.stopPropagation(); handleDelete(key, idx); }}>×</button>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
      {allAppts.length > 0 && (
        <div className="card">
          <h2 className="card-title" style={{ marginBottom: 4 }}>All Appointments</h2>
          <p className="card-sub" style={{ marginBottom: 20 }}>Scheduled patients at a glance</p>
          {upcoming.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <div className="appt-list-section-label upcoming-label"><span className="appt-list-dot upcoming-dot" />Upcoming ({upcoming.length})</div>
              <div className="appt-list">
                {upcoming.map((a, i) => (
                  <div key={i} className="appt-list-item appt-list-upcoming">
                    <div className="appt-list-date-badge upcoming-badge">
                      <span className="appt-list-day">{new Date(a.date).getDate()}</span>
                      <span className="appt-list-mon">{MONTHS[new Date(a.date).getMonth()].slice(0, 3)}</span>
                    </div>
                    <div className="appt-list-info"><strong>{a.patientName}</strong><p>{a.patientEmail || "No Email"}</p></div>
                    <div className="appt-list-right"><span className="appt-list-time">🕐 {a.time}</span><span className="appt-status-chip status-upcoming">Upcoming</span></div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {past.length > 0 && (
            <div>
              <div className="appt-list-section-label past-label"><span className="appt-list-dot past-dot" />Past ({past.length})</div>
              <div className="appt-list">
                {past.map((a, i) => (
                  <div key={i} className="appt-list-item appt-list-past">
                    <div className="appt-list-date-badge past-badge">
                      <span className="appt-list-day">{new Date(a.date).getDate()}</span>
                      <span className="appt-list-mon">{MONTHS[new Date(a.date).getMonth()].slice(0, 3)}</span>
                    </div>
                    <div className="appt-list-info"><strong>{a.patientName}</strong><p>{a.patientEmail || "No Email"}</p></div>
                    <div className="appt-list-right"><span className="appt-list-time">🕐 {a.time}</span><span className="appt-status-chip status-past">Completed</span></div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/* ─── Edit Log Modal ─── */
const EditLogModal = ({ log, logIndex, patientName, onClose, onSaved }) => {
  const [form, setForm] = useState({ problem: log.problem, medication: log.medication });

  const handleSave = () => {
    if (!form.problem.trim()) return alert("Diagnosis is required");
    if (!form.medication.trim()) return alert("Prescription is required");
    const all = JSON.parse(localStorage.getItem("allPrescriptions")) || [];
    // find the actual index in the full array matching this patient + original values
    let count = -1;
    const updated = all.map(p => {
      if (p.patientName === patientName) {
        count++;
        if (count === logIndex) return { ...p, problem: form.problem, medication: form.medication };
      }
      return p;
    });
    localStorage.setItem("allPrescriptions", JSON.stringify(updated));
    onSaved();
    onClose();
  };

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(15,28,53,0.45)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: 20, width: "100%", maxWidth: 460, boxShadow: "0 24px 48px rgba(15,28,53,0.18)", overflow: "hidden" }}>
        <div style={{ background: "linear-gradient(135deg,#0f2240,#1a3a6b)", padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 700, color: "#fff" }}>✏️ Edit Log</h3>
            <p style={{ margin: 0, fontSize: "0.72rem", color: "rgba(168,206,240,0.75)", marginTop: 2 }}>{log.date} · {patientName}</p>
          </div>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.12)", border: "none", borderRadius: "50%", width: 30, height: 30, cursor: "pointer", color: "#fff", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
        </div>
        <div style={{ padding: "20px 24px 24px", display: "flex", flexDirection: "column", gap: 14 }}>
          <div className="doc-form-group" style={{ margin: 0 }}>
            <label className="doc-form-label">DISEASE / DIAGNOSIS</label>
            <input type="text" className="doc-form-input" value={form.problem} onChange={e => setForm(f => ({ ...f, problem: e.target.value }))} />
          </div>
          <div className="doc-form-group" style={{ margin: 0 }}>
            <label className="doc-form-label">PRESCRIPTION</label>
            <textarea className="doc-form-textarea" value={form.medication} onChange={e => setForm(f => ({ ...f, medication: e.target.value }))} style={{ minHeight: 80 }} />
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
            <button onClick={onClose} className="doc-btn-sec" style={{ flex: 1, padding: "10px" }}>Cancel</button>
            <button onClick={handleSave} className="doc-btn-primary" style={{ flex: 1, padding: "10px" }}>Save Changes</button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─── Patient Detail View ─── */
const PatientDetailView = ({ patient, doctor, onBack }) => {
  const [form, setForm] = useState({
    disease: "", prescription: "",
    bp_sys: "", bp_dia: "", heartRate: "", temperature: "", spo2: "", respiratoryRate: "",
    requestScan: false, scanType: "X-Ray", scanCenter: "", scanNotes: "",
  });
  const [saved, setSaved] = useState(false);
  const [editingLog, setEditingLog] = useState(null); // { log, index }

  const loadRx = () => {
    const all = JSON.parse(localStorage.getItem("allPrescriptions")) || [];
    return all.filter(p => p.patientName === patient.patientName);
  };
  const [myRx, setMyRx] = useState(loadRx);

  const handleDeleteLog = (idx) => {
    if (!window.confirm("Delete this log? This cannot be undone.")) return;
    const all = JSON.parse(localStorage.getItem("allPrescriptions")) || [];
    let count = -1;
    const updated = all.filter(p => {
      if (p.patientName === patient.patientName) { count++; return count !== idx; }
      return true;
    });
    localStorage.setItem("allPrescriptions", JSON.stringify(updated));
    setMyRx(loadRx());
    window.dispatchEvent(new Event("dashboardUpdate"));
  };

  const allVitals = JSON.parse(localStorage.getItem("allVitals")) || [];
  const myVitals = allVitals.filter(v => v.patientName === patient.patientName);

  const allScanReqs = JSON.parse(localStorage.getItem("diagnosticRequests")) || [];
  const myScans = allScanReqs.filter(s => s.patientName === patient.patientName);

  /* Uploaded files from diagnostic center (match by email OR name, case-insensitive) */
  const allFiles = JSON.parse(localStorage.getItem("diagnosticFiles")) || [];
  const myFiles = allFiles.filter(f => {
    const emailOk = patient.patientEmail &&
      f.patientEmail?.toLowerCase().trim() === patient.patientEmail?.toLowerCase().trim();
    const nameOk = f.patientName?.toLowerCase().trim() === patient.patientName?.toLowerCase().trim();
    return emailOk || nameOk;
  });

  /* Available diagnostic centers — merge registeredDiagnostics + diagnosticProfile, normalize centerName */
  const centers = (() => {
    const ex = JSON.parse(localStorage.getItem("registeredDiagnostics")) || [];
    const solo = JSON.parse(localStorage.getItem("diagnosticProfile"));
    const all = ex.map(d => ({ ...d, centerName: d.centerName || d.name || d.email }));
    if (solo) {
      const soloName = solo.centerName || solo.name || solo.email;
      if (soloName && !all.find(d => d.email?.toLowerCase() === solo.email?.toLowerCase())) {
        all.push({ ...solo, centerName: soloName });
      }
    }
    return all.filter(d => d.centerName);
  })();

  const handleSave = () => {
    if (!form.disease) return alert("Disease / Diagnosis is required");
    if (!form.prescription) return alert("Prescription is required");

    const log = {
      patientName: patient.patientName, patientEmail: patient.patientEmail,
      problem: form.disease, medication: form.prescription,
      doctor: doctor.name || "Unknown Doctor", date: new Date().toLocaleDateString(),
    };
    const existRx = JSON.parse(localStorage.getItem("allPrescriptions")) || [];
    localStorage.setItem("allPrescriptions", JSON.stringify([...existRx, log]));

    const hasVitals = form.bp_sys || form.heartRate || form.temperature || form.spo2 || form.respiratoryRate;
    if (hasVitals) {
      const v = {
        patientName: patient.patientName, patientEmail: patient.patientEmail,
        systolic: form.bp_sys, diastolic: form.bp_dia,
        heartRate: form.heartRate, temperature: form.temperature,
        spo2: form.spo2, respiratoryRate: form.respiratoryRate,
        doctor: doctor.name || "Unknown Doctor", date: new Date().toLocaleDateString(),
      };
      const existV = JSON.parse(localStorage.getItem("allVitals")) || [];
      localStorage.setItem("allVitals", JSON.stringify([...existV, v]));
    }

    if (form.requestScan && form.scanType) {
      const req = {
        id: Date.now(), patientName: patient.patientName, patientEmail: patient.patientEmail,
        center: form.scanCenter || "MediShare Diagnostics", scanType: form.scanType,
        notes: form.scanNotes, doctor: doctor.name || "Unknown Doctor",
        date: new Date().toLocaleDateString(), status: "Pending",
      };
      const existS = JSON.parse(localStorage.getItem("diagnosticRequests")) || [];
      localStorage.setItem("diagnosticRequests", JSON.stringify([...existS, req]));
    }

    // UPDATE APPOINTMENT STATUS
    const allAppts = JSON.parse(localStorage.getItem("allAppointments")) || [];
    const today = new Date();
    const isToday = (dateStr) => {
      if (!dateStr) return false;
      const d = new Date(dateStr.includes("-") && dateStr.split("-")[0].length === 4 ? dateStr + "T00:00:00" : dateStr);
      return d.getDate() === today.getDate() && d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
    };

    let apptFound = false;
    const updatedAppts = allAppts.map(a => {
      // Find the first confirmed appointment today and mark it completed
      if (!apptFound && a.status === "Confirmed" && a.patientName === patient.patientName && a.doctor === doctor?.name && isToday(a.date)) {
        apptFound = true;
        return { ...a, status: "Completed" };
      }
      return a;
    });

    if (apptFound) {
      localStorage.setItem("allAppointments", JSON.stringify(updatedAppts));
    }

    window.dispatchEvent(new Event("dashboardUpdate"));
    setSaved(true);
    setMyRx(loadRx());
    alert("Patient log saved and synced to patient portal!");
  };

  const chip = (bg, color, txt) => (
    <span style={{ fontSize: "0.7rem", padding: "3px 10px", borderRadius: 20, background: bg, color, fontWeight: 600 }}>{txt}</span>
  );

  return (
    <div>
      {editingLog && (
        <EditLogModal
          log={editingLog.log}
          logIndex={editingLog.index}
          patientName={patient.patientName}
          onClose={() => setEditingLog(null)}
          onSaved={() => { setMyRx(loadRx()); window.dispatchEvent(new Event("dashboardUpdate")); }}
        />
      )}
      {/* Back */}
      <button onClick={onBack} style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", color: "#2e6db4", fontSize: "0.85rem", fontWeight: 600, marginBottom: 18, padding: 0 }}>
        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>arrow_back</span>Back to Patient List
      </button>

      {/* Header banner */}
      <div style={{ background: "linear-gradient(135deg,#0f1c35,#1a3460)", borderRadius: 16, padding: "20px 24px", marginBottom: 24, display: "flex", alignItems: "center", gap: 16, color: "white" }}>
        <div style={{ width: 52, height: 52, borderRadius: 14, background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 700, flexShrink: 0 }}>
          {patient.patientName?.split(" ").map(n => n[0]).join("").substring(0, 2)}
        </div>
        <div>
          <h2 style={{ margin: 0, fontSize: "1.08rem", fontWeight: 700 }}>{patient.patientName}</h2>
          <p style={{ margin: 0, fontSize: "0.76rem", color: "rgba(255,255,255,0.6)" }}>
            {patient.patientEmail || "No email"} · Last visit: {myRx.length > 0 ? myRx[myRx.length - 1].date : "Never"}
          </p>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8, flexWrap: "wrap" }}>
          {chip("rgba(46,109,180,0.4)", "#fff", `${myRx.length} Visit${myRx.length !== 1 ? "s" : ""}`)}
          {chip("rgba(217,119,6,0.4)", "#fff", `${myScans.length} Scan${myScans.length !== 1 ? "s" : ""}`)}
          {chip("rgba(5,150,105,0.4)", "#fff", `${myFiles.length} Report${myFiles.length !== 1 ? "s" : ""}`)}
        </div>
      </div>

      {/* Split grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, alignItems: "start" }}>

        {/* LEFT — history */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Prescription history */}
          <div className="card" style={{ padding: "20px 22px" }}>
            <h3 className="card-title" style={{ marginBottom: 4 }}>💊 Prescription History</h3>
            <p className="card-sub" style={{ marginBottom: 14, fontSize: "0.74rem" }}>All medications prescribed during visits</p>
            {myRx.length === 0
              ? <div className="empty-state" style={{ padding: "20px 0" }}><p style={{ fontSize: 28 }}>📋</p><p>No prescriptions yet</p></div>
              : <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {myRx.map((h, i) => (
                  <div key={i} style={{ background: "#f8fafc", borderRadius: 10, padding: "11px 14px", borderLeft: "3px solid #2e6db4" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5, alignItems: "flex-start" }}>
                      <strong style={{ fontSize: "0.87rem", color: "#0f1c35" }}>{h.problem}</strong>
                      <div style={{ display: "flex", gap: 6, flexShrink: 0, marginLeft: 8 }}>
                        <button
                          onClick={() => setEditingLog({ log: h, index: i })}
                          style={{ padding: "3px 10px", fontSize: "0.69rem", fontWeight: 600, background: "rgba(46,109,180,0.1)", color: "#2e6db4", border: "none", borderRadius: 6, cursor: "pointer" }}
                        >Edit</button>
                        <button
                          onClick={() => handleDeleteLog(i)}
                          style={{ padding: "3px 10px", fontSize: "0.69rem", fontWeight: 600, background: "rgba(239,68,68,0.08)", color: "#dc2626", border: "none", borderRadius: 6, cursor: "pointer" }}
                        >Delete</button>
                        <span style={{ fontSize: "0.69rem", color: "#8a96b0", alignSelf: "center" }}>{h.date}</span>
                      </div>
                    </div>
                    <p style={{ margin: 0, fontSize: "0.79rem", color: "#4b5563" }}>💊 {h.medication}</p>
                    <p style={{ margin: "3px 0 0", fontSize: "0.69rem", color: "#8a96b0" }}>Dr. {h.doctor}</p>
                  </div>
                ))}
              </div>
            }
          </div>

          {/* Vitals history */}
          {myVitals.length > 0 && (
            <div className="card" style={{ padding: "20px 22px" }}>
              <h3 className="card-title" style={{ marginBottom: 4 }}>🩺 Vitals History</h3>
              <p className="card-sub" style={{ marginBottom: 14, fontSize: "0.74rem" }}>Recorded vitals from past visits</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {myVitals.slice().reverse().map((v, i) => (
                  <div key={i} style={{ background: "#f8fafc", borderRadius: 10, padding: "11px 14px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7 }}>
                      <span style={{ fontSize: "0.74rem", fontWeight: 600, color: "#0f1c35" }}>Dr. {v.doctor}</span>
                      <span style={{ fontSize: "0.69rem", color: "#8a96b0" }}>{v.date}</span>
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                      {v.systolic && <span className="vitals-chip vitals-chip-red">💓 {v.systolic}/{v.diastolic} mmHg</span>}
                      {v.heartRate && <span className="vitals-chip vitals-chip-blue">❤️ {v.heartRate} bpm</span>}
                      {v.temperature && <span className="vitals-chip vitals-chip-amber">🌡️ {v.temperature}°F</span>}
                      {v.spo2 && <span className="vitals-chip vitals-chip-green">🫁 {v.spo2}%</span>}
                      {v.respiratoryRate && <span className="vitals-chip vitals-chip-purple">🌬️ {v.respiratoryRate}/min</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Scan Requests */}
          <div className="card" style={{ padding: "20px 22px" }}>
            <h3 className="card-title" style={{ marginBottom: 4 }}>🔬 Scan Requests</h3>
            <p className="card-sub" style={{ marginBottom: 14, fontSize: "0.74rem" }}>Scans requested — status updated by diagnostic center</p>
            {myScans.length === 0
              ? <div className="empty-state" style={{ padding: "20px 0" }}><p style={{ fontSize: 26 }}>🔬</p><p style={{ fontSize: "0.81rem" }}>No scan requests yet</p></div>
              : <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {myScans.slice().reverse().map((s, i) => (
                  <div key={i} style={{ background: "#fffbeb", borderRadius: 10, padding: "11px 14px", borderLeft: "3px solid #d97706" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                      <strong style={{ fontSize: "0.87rem", color: "#92400e" }}>🔬 {s.scanType}</strong>
                      <span style={{
                        fontSize: "0.67rem", padding: "2px 9px", borderRadius: 12, fontWeight: 700,
                        background: s.status === "Pending" ? "rgba(217,119,6,0.15)" : s.status === "Completed" ? "rgba(5,150,105,0.12)" : "rgba(100,116,139,0.1)",
                        color: s.status === "Pending" ? "#b45309" : s.status === "Completed" ? "#059669" : "#64748b"
                      }}>{s.status}</span>
                    </div>
                    <p style={{ margin: 0, fontSize: "0.75rem", color: "#92400e" }}>📍 {s.center}</p>
                    {s.notes && <p style={{ margin: "3px 0 0", fontSize: "0.69rem", color: "#6b7a99" }}>{s.notes}</p>}
                    <p style={{ margin: "3px 0 0", fontSize: "0.69rem", color: "#8a96b0" }}>{s.date}</p>
                  </div>
                ))}
              </div>
            }
          </div>

          {/* Uploaded Diagnostic Reports */}
          <div className="card" style={{ padding: "20px 22px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
              <h3 className="card-title" style={{ margin: 0 }}>📂 Diagnostic Reports</h3>
              {myFiles.length > 0 && (
                <span style={{ fontSize: "0.67rem", padding: "3px 10px", borderRadius: 20, background: "rgba(5,150,105,0.1)", color: "#059669", fontWeight: 700 }}>
                  {myFiles.length} Uploaded
                </span>
              )}
            </div>
            <p className="card-sub" style={{ marginBottom: 14, fontSize: "0.74rem" }}>
              Files uploaded by the diagnostic center · click <strong>View</strong> to open
            </p>
            {myFiles.length === 0
              ? <div className="empty-state" style={{ padding: "20px 0" }}>
                <p style={{ fontSize: 26, marginBottom: 6 }}>📭</p>
                <p style={{ fontSize: "0.81rem" }}>No reports uploaded yet</p>
                <span style={{ fontSize: "0.69rem" }}>Reports appear here once the diagnostic center uploads them</span>
              </div>
              : <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {myFiles.slice().reverse().map((f, i) => (
                  <div key={i} style={{
                    background: "linear-gradient(135deg,#f0fdf4,#f8faff)",
                    border: "1.5px solid #bbf7d0", borderRadius: 10, padding: "11px 14px",
                    display: "flex", alignItems: "center", gap: 12
                  }}>
                    <div style={{ width: 38, height: 38, borderRadius: 10, flexShrink: 0, background: "rgba(5,150,105,0.12)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>
                      {getFileIcon(f.type)}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <strong style={{ fontSize: "0.83rem", color: "#0f1c35", display: "block", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{f.name}</strong>
                      <span style={{ fontSize: "0.69rem", color: "#6b7a99" }}>
                        {f.size ? `${f.size} · ` : ""}{f.date || ""}{f.uploadedBy ? ` · ${f.uploadedBy}` : ""}
                      </span>
                    </div>
                    <button
                      onClick={() => openFile(f)}
                      style={{ padding: "5px 13px", fontSize: "0.71rem", fontWeight: 700, background: "#059669", color: "white", border: "none", borderRadius: 8, cursor: "pointer", display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}
                      onMouseEnter={e => e.currentTarget.style.background = "#047857"}
                      onMouseLeave={e => e.currentTarget.style.background = "#059669"}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: 14 }}>visibility</span>View
                    </button>
                  </div>
                ))}
              </div>
            }
          </div>

        </div>{/* end LEFT */}

        {/* RIGHT — Add New Log */}
        <div className="card" style={{ padding: "22px 24px", position: "sticky", top: 20 }}>
          <h3 className="card-title" style={{ marginBottom: 4 }}>{saved ? "✅ Log Saved" : "📝 Add New Log"}</h3>
          <p className="card-sub" style={{ fontSize: "0.74rem", marginBottom: 20 }}>Prescribe, record vitals & request scans</p>

          {saved ? (
            <div style={{ textAlign: "center", padding: "36px 20px" }}>
              <div style={{ fontSize: 46, marginBottom: 14 }}>✅</div>
              <h3 style={{ color: "#059669", marginBottom: 8 }}>Log Saved!</h3>
              <p style={{ color: "#6b7a99", fontSize: "0.83rem", marginBottom: 20 }}>Patient portal updated with latest prescription and vitals.</p>
              <button className="doc-btn-primary" onClick={() => { setSaved(false); setForm({ disease: "", prescription: "", bp_sys: "", bp_dia: "", heartRate: "", temperature: "", spo2: "", respiratoryRate: "", requestScan: false, scanType: "X-Ray", scanCenter: "", scanNotes: "" }); }}>
                + Add Another Log
              </button>
            </div>
          ) : (
            <>
              <div className="doc-form-group" style={{ marginBottom: 13 }}>
                <label className="doc-form-label">DISEASE / DIAGNOSIS <span style={{ color: "#e63946" }}>*</span></label>
                <input type="text" className="doc-form-input" placeholder="e.g. Type 2 Diabetes, Hypertension..." value={form.disease} onChange={e => setForm(f => ({ ...f, disease: e.target.value }))} />
              </div>
              <div className="doc-form-group" style={{ marginBottom: 13 }}>
                <label className="doc-form-label">PRESCRIPTION <span style={{ color: "#e63946" }}>*</span></label>
                <textarea className="doc-form-textarea" placeholder="Medication name, dosage, frequency, duration..." value={form.prescription} onChange={e => setForm(f => ({ ...f, prescription: e.target.value }))} style={{ minHeight: 70 }} />
              </div>

              {/* Vitals */}
              <div style={{ background: "#f8faff", border: "1px solid #dce8f8", borderRadius: 10, padding: "13px 15px", marginBottom: 13 }}>
                <div style={{ fontSize: "0.79rem", fontWeight: 700, color: "#0f1c35", marginBottom: 11 }}>
                  🩺 Vitals <span style={{ fontWeight: 400, color: "#8a96b0", fontSize: "0.69rem" }}>(optional)</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "9px 12px" }}>
                  <div className="doc-form-group" style={{ margin: 0 }}>
                    <label className="doc-form-label" style={{ fontSize: "0.63rem" }}>BLOOD PRESSURE (mmHg)</label>
                    <div style={{ display: "flex", gap: 5 }}>
                      <input type="number" className="doc-form-input" placeholder="Sys" value={form.bp_sys} onChange={e => setForm(f => ({ ...f, bp_sys: e.target.value }))} style={{ flex: 1 }} />
                      <input type="number" className="doc-form-input" placeholder="Dia" value={form.bp_dia} onChange={e => setForm(f => ({ ...f, bp_dia: e.target.value }))} style={{ flex: 1 }} />
                    </div>
                  </div>
                  <div className="doc-form-group" style={{ margin: 0 }}>
                    <label className="doc-form-label" style={{ fontSize: "0.63rem" }}>HEART RATE (bpm)</label>
                    <input type="number" className="doc-form-input" placeholder="72" value={form.heartRate} onChange={e => setForm(f => ({ ...f, heartRate: e.target.value }))} />
                  </div>
                  <div className="doc-form-group" style={{ margin: 0 }}>
                    <label className="doc-form-label" style={{ fontSize: "0.63rem" }}>TEMPERATURE (°F)</label>
                    <input type="number" className="doc-form-input" placeholder="98.6" value={form.temperature} onChange={e => setForm(f => ({ ...f, temperature: e.target.value }))} />
                  </div>
                  <div className="doc-form-group" style={{ margin: 0 }}>
                    <label className="doc-form-label" style={{ fontSize: "0.63rem" }}>SpO₂ (%)</label>
                    <input type="number" className="doc-form-input" placeholder="98" value={form.spo2} onChange={e => setForm(f => ({ ...f, spo2: e.target.value }))} />
                  </div>
                  <div className="doc-form-group" style={{ margin: 0, gridColumn: "1 / -1" }}>
                    <label className="doc-form-label" style={{ fontSize: "0.63rem" }}>RESPIRATORY RATE (/min)</label>
                    <input type="number" className="doc-form-input" placeholder="16" value={form.respiratoryRate} onChange={e => setForm(f => ({ ...f, respiratoryRate: e.target.value }))} />
                  </div>
                </div>
              </div>

              {/* Request scan */}
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", background: form.requestScan ? "rgba(217,119,6,0.07)" : "#f8fafc", border: `1.5px solid ${form.requestScan ? "#fde68a" : "#e8edf5"}`, borderRadius: 10, padding: "9px 13px", transition: "all 0.2s" }}>
                  <input type="checkbox" checked={form.requestScan} onChange={e => setForm(f => ({ ...f, requestScan: e.target.checked }))} style={{ width: 16, height: 16, accentColor: "#d97706" }} />
                  <span style={{ fontSize: "0.83rem", fontWeight: 600, color: "#0f1c35" }}>🔬 Also Request Diagnostic Scan</span>
                </label>
                {form.requestScan && (
                  <div style={{ marginTop: 10, padding: 13, background: "#fffbeb", borderRadius: 10, border: "1px solid #fde68a" }}>
                    <div className="doc-form-row">
                      <div className="doc-form-group" style={{ flex: 1, margin: 0 }}>
                        <label className="doc-form-label" style={{ fontSize: "0.63rem" }}>SCAN TYPE</label>
                        <select className="doc-form-select" value={form.scanType} onChange={e => setForm(f => ({ ...f, scanType: e.target.value }))}>
                          <option>X-Ray</option><option>MRI</option><option>CT Scan</option><option>Ultrasound</option><option>Blood Test</option>
                        </select>
                      </div>
                      <div className="doc-form-group" style={{ flex: 1, margin: 0 }}>
                        <label className="doc-form-label" style={{ fontSize: "0.63rem" }}>DIAGNOSTIC CENTER</label>
                        <select className="doc-form-select" value={form.scanCenter} onChange={e => setForm(f => ({ ...f, scanCenter: e.target.value }))}>
                          <option value="">-- Select Center --</option>
                          {centers.length === 0
                            ? <option disabled>No centers registered</option>
                            : centers.map((d, i) => <option key={i} value={d.centerName}>{d.centerName}</option>)
                          }
                        </select>
                      </div>
                    </div>
                    <div className="doc-form-group" style={{ marginTop: 9 }}>
                      <label className="doc-form-label" style={{ fontSize: "0.63rem" }}>CLINICAL NOTES</label>
                      <textarea className="doc-form-textarea" placeholder="Reason for scan..." value={form.scanNotes} onChange={e => setForm(f => ({ ...f, scanNotes: e.target.value }))} style={{ minHeight: 52 }} />
                    </div>
                  </div>
                )}
              </div>

              <button className="doc-btn-primary" style={{ width: "100%", padding: "12px" }} onClick={handleSave}>
                <span className="material-symbols-outlined" style={{ fontSize: 16, verticalAlign: "middle", marginRight: 5 }}>save</span>
                Save Log &amp; Sync to Portal
              </button>
            </>
          )}
        </div>{/* end RIGHT */}
      </div>
    </div>
  );
};

/* ─── Patient List ─── */
const PatientListView = ({ patients, doctor, onSelect }) => {
  const [search, setSearch] = useState("");

  const seen = new Set();
  const unique = [];
  patients.forEach(p => {
    if (!seen.has(p.patientName)) {
      seen.add(p.patientName);
      unique.push(p);
    }
  });

  const filtered = unique.filter(p => p.patientName.toLowerCase().includes(search.toLowerCase()));

  return (
    <>
      <div className="doc-page-header" style={{ padding: "0 0 20px 0" }}>
        <div>
          <h1 className="doc-page-title">Patient Logs</h1>
          <p className="doc-page-subtitle">Select a patient to view their full history and add new prescriptions</p>
        </div>
      </div>
      <input className="doc-form-input" placeholder="🔍  Search patients by name..." value={search} onChange={e => setSearch(e.target.value)} style={{ marginBottom: 18 }} />
      {filtered.length === 0
        ? <div style={{ textAlign: "center", padding: "56px 20px", background: "white", borderRadius: 14, border: "1.5px dashed #dce3ef" }}>
          <div style={{ fontSize: 38, marginBottom: 12 }}>👤</div>
          <h3 style={{ color: "#0f1c35", marginBottom: 6 }}>No Patients Found</h3>
          <p style={{ color: "#8a96b0", fontSize: "0.83rem" }}>Patients appear here once they have appointments with you.</p>
        </div>
        : <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {filtered.map((p, i) => {
            const rxCount = (JSON.parse(localStorage.getItem("allPrescriptions")) || []).filter(l => l.patientName === p.patientName).length;
            const scanCount = (JSON.parse(localStorage.getItem("diagnosticRequests")) || []).filter(s => s.patientName === p.patientName).length;
            const fileCount = (JSON.parse(localStorage.getItem("diagnosticFiles")) || []).filter(f => {
              const em = p.patientEmail && f.patientEmail?.toLowerCase().trim() === p.patientEmail?.toLowerCase().trim();
              const nm = f.patientName?.toLowerCase().trim() === p.patientName?.toLowerCase().trim();
              return em || nm;
            }).length;
            return (
              <div key={i} onClick={() => onSelect(p)} style={{ background: "white", border: "1.5px solid #e8edf5", borderRadius: 14, padding: "15px 19px", cursor: "pointer", display: "flex", alignItems: "center", gap: 14, transition: "box-shadow 0.2s,border-color 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 4px 20px rgba(46,109,180,0.1)"; e.currentTarget.style.borderColor = "#bdd3f5" }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = ""; e.currentTarget.style.borderColor = "#e8edf5" }}
              >
                <div style={{ width: 44, height: 44, borderRadius: 12, background: "linear-gradient(135deg,#2e6db4,#1a4a80)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 700, fontSize: 16, flexShrink: 0 }}>
                  {p.patientName?.split(" ").map(n => n[0]).join("").substring(0, 2)}
                </div>
                <div style={{ flex: 1 }}>
                  <strong style={{ fontSize: "0.92rem", color: "#0f1c35", display: "block" }}>{p.patientName}</strong>
                  <span style={{ fontSize: "0.74rem", color: "#8a96b0" }}>{p.patientEmail || "No Email"}</span>
                </div>
                <div style={{ display: "flex", gap: 7, alignItems: "center" }}>
                  <span style={{ fontSize: "0.7rem", padding: "3px 10px", borderRadius: 20, background: "rgba(46,109,180,0.1)", color: "#2e6db4", fontWeight: 600 }}>{rxCount} Visit{rxCount !== 1 ? "s" : ""}</span>
                  <span style={{ fontSize: "0.7rem", padding: "3px 10px", borderRadius: 20, background: "rgba(217,119,6,0.1)", color: "#b45309", fontWeight: 600 }}>{scanCount} Scan{scanCount !== 1 ? "s" : ""}</span>
                  {fileCount > 0 && <span style={{ fontSize: "0.7rem", padding: "3px 10px", borderRadius: 20, background: "rgba(5,150,105,0.1)", color: "#059669", fontWeight: 600 }}>📂 {fileCount}</span>}
                  <span className="material-symbols-outlined" style={{ fontSize: 20, color: "#8a96b0" }}>chevron_right</span>
                </div>
              </div>
            );
          })}
        </div>
      }
    </>
  );
};

/* ─── Main Dashboard ─── */
function DoctorDashboard() {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [doctor, setDoctor] = useState({ name: "", specialization: "", email: "", doctorId: "" });
  const [selectedPatient, setSelectedPatient] = useState(null);

  const fetchData = () => {
    let doc = { name: "", specialization: "", email: "", doctorId: "" };
    const stored = localStorage.getItem("doctorProfile");
    if (stored) { doc = JSON.parse(stored); setDoctor(doc); }

    const appts = JSON.parse(localStorage.getItem("allAppointments")) || [];
    const myAppts = appts.filter(a => a.doctor === doc.name);
    setAppointments(myAppts);

    const logs = JSON.parse(localStorage.getItem("allPrescriptions")) || [];
    const myLogs = logs.filter(p => p.doctor === doc.name);

    const combined = [
      ...myAppts.map(a => ({ id: a.id, patientName: a.patientName, patientEmail: a.patientEmail, injury: a.note || "Appointment", date: a.date, status: a.status || "Upcoming" })),
      ...myLogs.map((p, i) => ({ id: p.date + p.patientName + i, patientName: p.patientName, patientEmail: p.patientEmail, injury: p.problem, medication: p.medication, date: p.date, status: "Completed" }))
    ].sort((a, b) => new Date(b.date) - new Date(a.date));
    setPatients(combined);
  };

  useEffect(() => { fetchData(); window.addEventListener("dashboardUpdate", fetchData); return () => window.removeEventListener("dashboardUpdate", fetchData); }, []);

  const handleSignOut = () => { localStorage.removeItem("doctorProfile"); window.location.href = "/"; };

  const today = new Date().toLocaleDateString();
  const apptsToday = appointments.filter(a => new Date(a.date).toLocaleDateString() === today).length;
  const totalPatients = new Set(patients.map(p => p.patientName)).size;
  const recentLogs = patients.filter(p => p.status === "Completed").length;

  return (
    <div className="app">
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap" />

      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="logo"><h3>MediShare</h3><span className="logo-sub">Doctor Portal</span></div>
        <nav>
          {[
            { id: "Dashboard", label: "Dashboard", icon: "grid_view" },
            { id: "Patients", label: "Patient Logs", icon: "person" },
            { id: "Settings", label: "Settings", icon: "settings" },
          ].map(item => (
            <button key={item.id} className={`nav-item ${activeTab === item.id ? "active" : ""}`}
              onClick={() => { setActiveTab(item.id); setSelectedPatient(null); }}>
              <span className="material-symbols-outlined">{item.icon}</span>{item.label}
            </button>
          ))}
        </nav>
        <div className="sidebar-footer">
          <button className="sidebar-footer-btn"><span className="material-symbols-outlined">help_outline</span>Help Center</button>
          <button className="sidebar-footer-btn" onClick={handleSignOut}><span className="material-symbols-outlined">logout</span>Sign Out</button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="main">
        <div className="topbar">
          <input className="search" placeholder="Search patients or logs..." />
          <div className="top-right">
            <button className="icon-btn"><span className="material-symbols-outlined" style={{ fontSize: 22 }}>notifications</span><span className="bell-dot" /></button>
            <div className="user-chip">
              <div className="user-chip-text"><strong>{doctor.name}</strong><span>License: {doctor.doctorId}</span></div>
              <div className="avatar">👨‍⚕️</div>
            </div>
          </div>
        </div>

        <div style={{ padding: "24px 28px", maxWidth: 1120, margin: "0 auto", width: "100%" }}>

          {/* DASHBOARD */}
          {activeTab === "Dashboard" && (
            <>
              <div className="page-header" style={{ marginBottom: 24 }}>
                <div className="greeting">
                  <h2>Welcome, Dr. {(doctor.name?.replace(/^Dr\.?\s*/i, "") || "Doctor").split(" ")[0]}.</h2>
                  <p>Here's a summary of your clinical activities today.</p>
                </div>
                <div className="sync-badge"><span className="sync-dot" />Live Updates</div>
              </div>
              <div className="dash-vitals-section">
                <div className="dash-vitals-grid" style={{ gridTemplateColumns: "repeat(3,1fr)" }}>
                  {[
                    { label: "Appointments Today", icon: "📅", value: apptsToday, color: "#2e6db4", bg: "rgba(46,109,180,0.08)", border: "rgba(46,109,180,0.22)" },
                    { label: "Total Patients", icon: "👥", value: totalPatients, color: "#059669", bg: "rgba(5,150,105,0.08)", border: "rgba(5,150,105,0.22)" },
                    { label: "Recent Logs", icon: "📋", value: recentLogs, color: "#7c3aed", bg: "rgba(124,58,237,0.08)", border: "rgba(124,58,237,0.22)" },
                  ].map((s, i) => (
                    <div key={i} className="dash-vital-card" style={{ "--vc": s.color }}>
                      <div className="dash-vital-icon-wrap" style={{ background: s.bg, border: `1px solid ${s.border}` }}><span style={{ fontSize: 20 }}>{s.icon}</span></div>
                      <div><p className="dash-vital-label">{s.label}</p><div className="dash-vital-value-row"><span className="dash-vital-value" style={{ color: s.color }}>{s.value}</span></div></div>
                      <div className="vitals-card-shimmer" />
                    </div>
                  ))}
                </div>
              </div>
              <AppointmentModule doctorName={doctor.name} />
            </>
          )}

          {/* PATIENTS */}
          {activeTab === "Patients" && (
            selectedPatient
              ? <PatientDetailView patient={selectedPatient} doctor={doctor} onBack={() => setSelectedPatient(null)} />
              : <PatientListView patients={patients} doctor={doctor} onSelect={setSelectedPatient} />
          )}

          {/* SETTINGS */}
          {activeTab === "Settings" && (
            <>
              <div className="doc-settings-header" style={{ marginBottom: 24 }}>
                <div><h1 className="doc-page-title">Settings</h1><p className="doc-page-subtitle">Manage your account preferences</p></div>
                <div className="doc-settings-actions">
                  <button className="doc-btn-sec">Discard</button>
                  <button className="doc-btn-primary" onClick={() => {
                    const np = { ...doctor, name: document.getElementById("doc-name").value, specialization: document.getElementById("doc-spec").value, email: document.getElementById("doc-email").value };
                    setDoctor(np);
                    localStorage.setItem("doctorProfile", JSON.stringify(np));
                    const existingDoctors = JSON.parse(localStorage.getItem("registeredDoctors")) || [];
                    const idx = existingDoctors.findIndex(d => d.email?.toLowerCase() === doctor.email?.toLowerCase());
                    if (idx >= 0) existingDoctors[idx] = { ...existingDoctors[idx], ...np };
                    else existingDoctors.push(np);
                    localStorage.setItem("registeredDoctors", JSON.stringify(existingDoctors));
                    alert("Profile saved!");
                  }}>Save Changes</button>
                </div>
              </div>
              <div className="doc-settings-container">
                <div className="doc-profile-section">
                  <div className="doc-profile-lg-wrap">
                    <div className="doc-profile-avatar-lg" style={{ background: "#eef2ff", color: "#2563eb", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, fontWeight: 700, width: 96, height: 96, borderRadius: "50%" }}>
                      {doctor.name ? doctor.name[0].toUpperCase() : "D"}
                    </div>
                    <label className="doc-profile-cam-btn" style={{ cursor: "pointer" }}>
                      <input type="file" accept="image/*" style={{ display: "none" }} onChange={e => { if (e.target.files[0]) alert("Uploaded: " + e.target.files[0].name) }} />
                      <span className="material-symbols-outlined" style={{ fontSize: 18 }}>photo_camera</span>
                    </label>
                  </div>
                  <div className="doc-profile-info-lg"><h2>{doctor.name || "Unknown Doctor"}</h2><p>License: {doctor.doctorId || "Pending"}</p></div>
                </div>
                <div className="doc-settings-section">
                  <h3 className="doc-settings-title">Personal Information</h3>
                  <div className="doc-form-grid doc-form-group-outline">
                    <div className="doc-form-group"><label className="doc-form-label">Full Name</label><input type="text" id="doc-name" className="doc-form-input" defaultValue={doctor.name} /></div>
                    <div className="doc-form-group"><label className="doc-form-label">Medical Specialty</label><select id="doc-spec" className="doc-form-select" defaultValue={doctor.specialization}><option>General Practitioner</option><option>Cardiologist</option><option>Neurologist</option><option>Pediatrician</option></select></div>
                    <div className="doc-form-group"><label className="doc-form-label">Email Address</label><input type="email" id="doc-email" className="doc-form-input" defaultValue={doctor.email} /></div>
                    <div className="doc-form-group"><label className="doc-form-label">Clinic Phone</label><input type="text" id="doc-phone" className="doc-form-input" defaultValue={doctor.phone || ""} /></div>
                  </div>
                </div>
                <div className="doc-settings-section">
                  <h3 className="doc-settings-title">Security</h3>
                  <p className="doc-settings-subtitle">Manage your authentication settings.</p>
                  <div className="doc-security-box">
                    <div className="doc-toggle-row">
                      <div className="doc-toggle-text"><h4>Two-Factor Authentication</h4><p>Extra security layer.</p></div>
                      <div className="doc-toggle-switch"><div className="doc-toggle-circle" /></div>
                    </div>
                    <div className="doc-toggle-text" style={{ marginBottom: 12 }}><h4>Change Password</h4></div>
                    <div className="doc-password-row doc-form-group-outline">
                      <input type="password" className="doc-form-input" placeholder="Current Password" />
                      <input type="password" className="doc-form-input" placeholder="New Password" />
                      <input type="password" className="doc-form-input" placeholder="Confirm New Password" />
                    </div>
                    <button className="doc-btn-sec" style={{ background: "#f4f6fb", padding: "8px 16px" }}>Update Password</button>
                  </div>
                </div>
              </div>
            </>
          )}

        </div>
      </main>
    </div>
  );
}

export default DoctorDashboard;
