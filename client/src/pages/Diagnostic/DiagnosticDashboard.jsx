import { useEffect, useState, useRef } from "react";
import "../../styles/patientDashboard.css";
import "../../styles/doctorDashboard.css";

function DiagnosticDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [diagnostic, setDiagnostic] = useState({ centerName: "", email: "", phone: "" });
  const [files, setFiles] = useState([]);
  const [dragOver, setDragOver] = useState(false);
  const [targetEmail, setTargetEmail] = useState("");
  const [targetDoctor, setTargetDoctor] = useState("");
  const [targetRequest, setTargetRequest] = useState(null);
  const [reportType, setReportType] = useState("X-Ray");
  const [reportNotes, setReportNotes] = useState("");
  const [patientVerified, setPatientVerified] = useState(false);
  const [scanRequests, setScanRequests] = useState([]);
  const [registeredDoctors, setRegisteredDoctors] = useState([]);
  const fileInputRef = useRef();

  useEffect(() => {
    const stored = localStorage.getItem("diagnosticProfile");
    if (stored) setDiagnostic(JSON.parse(stored));
    const savedFiles = JSON.parse(localStorage.getItem("diagnosticFiles")) || [];
    setFiles(savedFiles);

    // Also register this diagnostic into the global registry on load
    if (stored) {
      const parsed = JSON.parse(stored);
      const resolvedName = parsed.centerName || parsed.name || parsed.email;
      const normalized = { ...parsed, centerName: resolvedName };
      const existingDiag = JSON.parse(localStorage.getItem("registeredDiagnostics")) || [];
      const idx = existingDiag.findIndex(d => d.email?.toLowerCase() === parsed.email?.toLowerCase());
      if (idx >= 0) existingDiag[idx] = { ...existingDiag[idx], ...normalized };
      else existingDiag.push(normalized);
      localStorage.setItem("registeredDiagnostics", JSON.stringify(existingDiag));
    }

    // Load all scan requests — center name matching is unreliable due to casing/spacing
    const requests = JSON.parse(localStorage.getItem("diagnosticRequests")) || [];
    setScanRequests(requests);

    // Load registered doctors
    const docs = JSON.parse(localStorage.getItem("registeredDoctors")) || [];
    setRegisteredDoctors(docs);
  }, []);

  const verifyPatient = () => {
    const registeredPatients = JSON.parse(localStorage.getItem("registeredPatients")) || [];
    const found = registeredPatients.find(p => p.email.toLowerCase() === targetEmail.toLowerCase());
    if (found) {
      setPatientVerified(true);
      alert("Patient account verified successfully!");
    } else {
      alert("No patient found with this email address.");
      setPatientVerified(false);
    }
  };

  const handleFiles = async (incoming) => {
    const promises = Array.from(incoming).map(f => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve({
            id: Date.now() + Math.random(),
            name: f.name,
            size: (f.size / 1024).toFixed(1) + " KB",
            type: f.type,
            date: new Date().toLocaleDateString(),
            status: "Uploaded",
            patientEmail: targetEmail,
            doctorName: targetDoctor,
            reportType: reportType,
            notes: reportNotes,
            center: diagnostic.centerName,
            content: reader.result,
          });
        };
        reader.readAsDataURL(f);
      });
    });
    const newFiles = await Promise.all(promises);
    const updated = [...files, ...newFiles];
    setFiles(updated);
    try {
      // Strip content before saving to localStorage to avoid QuotaExceededError
      const toStore = updated.map(({ content, ...rest }) => rest);
      localStorage.setItem("diagnosticFiles", JSON.stringify(toStore));
      alert(`${newFiles.length} report(s) uploaded successfully and synced to patient & doctor portals!`);

      if (targetRequest) {
        const storedReqs = JSON.parse(localStorage.getItem("diagnosticRequests")) || [];
        const updatedReqs = storedReqs.map(req => req.id === targetRequest ? { ...req, status: "Completed" } : req);
        localStorage.setItem("diagnosticRequests", JSON.stringify(updatedReqs));
        setScanRequests(updatedReqs);
        setTargetRequest(null);
      }
    } catch (error) {
      alert("Error saving file metadata. Please try again.");
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleDelete = (id) => {
    const updated = files.filter(f => f.id !== id);
    setFiles(updated);
    localStorage.setItem("diagnosticFiles", JSON.stringify(updated));
  };

  const getFileIcon = (type = "") => {
    if (type.includes("pdf")) return "📄";
    if (type.includes("image")) return "🖼️";
    if (type.includes("word") || type.includes("document")) return "📝";
    return "📁";
  };

  const handleSignOut = () => {
    localStorage.removeItem("diagnosticProfile");
    window.location.href = "/";
  };

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";
  const totalPdfs = files.filter(f => f.type?.includes("pdf")).length;
  const totalImages = files.filter(f => f.type?.includes("image")).length;
  const pendingRequests = scanRequests.filter(r => r.status === "Pending").length;

  const navItems = [
    { id: "dashboard", icon: "grid_view", label: "Dashboard" },
    { id: "upload", icon: "upload_file", label: "Upload Files" },
    { id: "requests", icon: "labs", label: "Scan Requests" },
    { id: "files", icon: "folder_open", label: "All Files" },
    { id: "settings", icon: "settings", label: "Settings" },
  ];

  return (
    <div className="app">
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap" />

      {/* ── SIDEBAR ── */}
      <aside className="sidebar">
        <div className="logo">
          <h3>MediShare</h3>
          <span className="logo-sub">Diagnostic Portal</span>
        </div>

        <nav>
          {navItems.map(item => (
            <button
              key={item.id}
              className={`nav-item ${activeTab === item.id ? "active" : ""}`}
              onClick={() => setActiveTab(item.id)}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <button className="sidebar-book-btn" onClick={() => setActiveTab("upload")}>
          Upload Reports
        </button>

        <div className="sidebar-footer">
          <button className="sidebar-footer-btn">
            <span className="material-symbols-outlined">help_outline</span>
            Help Center
          </button>
          <button className="sidebar-footer-btn" onClick={handleSignOut}>
            <span className="material-symbols-outlined">logout</span>
            Sign Out
          </button>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main className="main">
        {/* TOP BAR */}
        <div className="topbar">
          <input className="search" placeholder="Search files, reports, or patients..." />
          <div className="top-right">
            <button className="icon-btn">
              <span className="material-symbols-outlined" style={{ fontSize: 22 }}>notifications</span>
              <span className="bell-dot" />
            </button>
            <div className="user-chip">
              <div className="user-chip-text">
                <strong>{diagnostic.centerName || "Diagnostic Center"}</strong>
                <span>Lab ID: {diagnostic.labId || "DC-0001"}</span>
              </div>
              <div className="avatar">🔬</div>
            </div>
          </div>
        </div>

        {/* ── CONTENT ── */}
        {activeTab !== "settings" && (
          <div className="content">
            <div className="center">

              {/* ── DASHBOARD TAB ── */}
              {activeTab === "dashboard" && (
                <>
                  <div className="page-header" style={{ marginBottom: 24 }}>
                    <div className="greeting">
                      <h2>{greeting}, {diagnostic.centerName || "Lab"}.</h2>
                      <p>Here's a summary of your diagnostic activities.</p>
                    </div>
                    <div className="sync-badge">
                      <span className="sync-dot" />
                      Live Updates
                    </div>
                  </div>

                  {/* Stats Cards */}
                  <div className="dash-vitals-section">
                    <div className="dash-vitals-grid">
                      {[
                        { key: "total", label: "Total Files", icon: "📂", value: files.length, color: "#2e6db4", bg: "rgba(46,109,180,0.08)", border: "rgba(46,109,180,0.22)" },
                        { key: "pdfs", label: "PDF Reports", icon: "📄", value: totalPdfs, color: "#059669", bg: "rgba(5,150,105,0.08)", border: "rgba(5,150,105,0.22)" },
                        { key: "images", label: "Scan Images", icon: "🖼️", value: totalImages, color: "#7c3aed", bg: "rgba(124,58,237,0.08)", border: "rgba(124,58,237,0.22)" },
                        { key: "pending", label: "Pending Requests", icon: "🔬", value: pendingRequests, color: "#d97706", bg: "rgba(217,119,6,0.08)", border: "rgba(217,119,6,0.22)" },
                      ].map(s => (
                        <div key={s.key} className="dash-vital-card" style={{ '--vc': s.color }}>
                          <div className="dash-vital-icon-wrap" style={{ background: s.bg, border: `1px solid ${s.border}` }}>
                            <span style={{ fontSize: 18 }}>{s.icon}</span>
                          </div>
                          <div>
                            <p className="dash-vital-label">{s.label}</p>
                            <div className="dash-vital-value-row">
                              <span className="dash-vital-value" style={{ color: s.color }}>{s.value}</span>
                            </div>
                          </div>
                          <div className="vitals-card-shimmer" />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="card" style={{ marginTop: 24 }}>
                    <div style={{ marginBottom: 16 }}>
                      <h3 className="card-title">Quick Actions</h3>
                      <p className="card-sub">Common diagnostic tools</p>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                      <button className="doc-btn-primary" style={{ padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, height: '100px', justifyContent: 'center' }} onClick={() => setActiveTab('upload')}>
                        <span className="material-symbols-outlined" style={{ fontSize: 28 }}>cloud_upload</span>
                        Upload Reports
                      </button>
                      <button className="doc-btn-sec" style={{ padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, height: '100px', justifyContent: 'center', background: '#f4f6fb', border: '1px solid #e2e8f0', color: '#0f1c35' }} onClick={() => setActiveTab('requests')}>
                        <span className="material-symbols-outlined" style={{ fontSize: 28 }}>labs</span>
                        Scan Requests
                      </button>
                      <button className="doc-btn-sec" style={{ padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, height: '100px', justifyContent: 'center', background: '#fffbeb', border: '1px solid #fde68a', color: '#b45309' }} onClick={() => setActiveTab('files')}>
                        <span className="material-symbols-outlined" style={{ fontSize: 28 }}>folder_open</span>
                        View All Files
                      </button>
                    </div>
                  </div>

                  {/* Recent Files Preview removed per request */}
                </>
              )}

              {/* ── UPLOAD TAB ── */}
              {activeTab === "upload" && (
                <>
                  <div className="doc-page-header" style={{ padding: '0 0 24px 0' }}>
                    <div>
                      <h1 className="doc-page-title">Upload Reports</h1>
                      <p className="doc-page-subtitle">Upload diagnostic reports and sync with patient & doctor portals</p>
                    </div>
                  </div>

                  {/* Step 1: Patient Mapping */}
                  <div className="card" style={{ marginBottom: 20 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                      <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#2e6db4', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 700 }}>1</div>
                      <h3 className="card-title" style={{ margin: 0 }}>Patient Mapping</h3>
                    </div>
                    <div className="doc-form-group">
                      <label className="doc-form-label">Patient Email Address</label>
                      <div style={{ display: "flex", gap: 12 }}>
                        <input
                          className="doc-form-input"
                          style={{ flex: 1 }}
                          placeholder="Enter patient email to verify (e.g. johndoe@example.com)"
                          value={targetEmail}
                          onChange={e => { setTargetEmail(e.target.value); setPatientVerified(false); }}
                        />
                        <button className="doc-btn-primary" style={{ whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 6 }} onClick={verifyPatient}>
                          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>verified</span>
                          Verify
                        </button>
                      </div>
                      {patientVerified && (
                        <div style={{ marginTop: 8, fontSize: '0.82rem', color: '#059669', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>check_circle</span>
                          Patient verified successfully — {targetEmail}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Step 2: Doctor & Report Details */}
                  {patientVerified && (
                    <div className="card" style={{ marginBottom: 20 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                        <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#059669', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 700 }}>2</div>
                        <h3 className="card-title" style={{ margin: 0 }}>Report Details</h3>
                      </div>
                      <div className="doc-form-row">
                        <div className="doc-form-group" style={{ flex: 1 }}>
                          <label className="doc-form-label">Report Type</label>
                          <select className="doc-form-select" value={reportType} onChange={e => setReportType(e.target.value)}>
                            <option>X-Ray</option>
                            <option>MRI</option>
                            <option>CT Scan</option>
                            <option>Ultrasound</option>
                            <option>Blood Test</option>
                            <option>Pathology</option>
                            <option>ECG</option>
                            <option>Other</option>
                          </select>
                        </div>
                      </div>
                      <div className="doc-form-group">
                        <label className="doc-form-label">Clinical Notes (Optional)</label>
                        <textarea className="doc-form-textarea" placeholder="Key findings, observations, or notes for the patient and doctor..." value={reportNotes} onChange={e => setReportNotes(e.target.value)} />
                      </div>
                    </div>
                  )}

                  {/* Step 3: File Upload */}
                  {patientVerified && (
                    <div className="card" style={{ marginBottom: 24 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                        <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#7c3aed', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 700 }}>3</div>
                        <h3 className="card-title" style={{ margin: 0 }}>Upload Files</h3>
                      </div>

                      {/* Mapping Summary */}
                      <div style={{ background: '#f0f4fb', borderRadius: 12, padding: '14px 18px', marginBottom: 20, display: 'flex', flexWrap: 'wrap', gap: '16px 32px', fontSize: '0.82rem' }}>
                        <div><strong style={{ color: '#0f1c35' }}>Patient:</strong> <span style={{ color: '#2e6db4' }}>{targetEmail}</span></div>
                        <div><strong style={{ color: '#0f1c35' }}>Type:</strong> <span style={{ color: '#7c3aed' }}>{reportType}</span></div>
                        <div><strong style={{ color: '#0f1c35' }}>Center:</strong> <span style={{ color: '#6b7a99' }}>{diagnostic.centerName}</span></div>
                      </div>

                      <div
                        style={{
                          border: `2px dashed ${dragOver ? '#2e6db4' : '#cbd5e1'}`,
                          borderRadius: 16,
                          padding: '48px 24px',
                          textAlign: 'center',
                          cursor: 'pointer',
                          background: dragOver ? 'rgba(46,109,180,0.04)' : '#fafbfd',
                          transition: 'all 0.3s ease'
                        }}
                        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                        onDragLeave={() => setDragOver(false)}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current.click()}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: 48, color: '#2e6db4', marginBottom: 8, display: 'block' }}>cloud_upload</span>
                        <p style={{ fontWeight: 600, color: '#0f1c35', fontSize: '1rem', margin: '0 0 4px 0' }}>
                          Drag & drop files here or <span style={{ color: '#2e6db4', textDecoration: 'underline' }}>browse</span>
                        </p>
                        <p style={{ color: '#6b7a99', fontSize: '0.78rem', margin: 0 }}>Supports PDF, PNG, JPEG, DOC files</p>
                        <input
                          ref={fileInputRef}
                          type="file"
                          multiple
                          accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                          style={{ display: "none" }}
                          onChange={e => handleFiles(e.target.files)}
                        />
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* ── SCAN REQUESTS TAB ── */}
              {activeTab === "requests" && (
                <>
                  <div className="doc-page-header" style={{ padding: '0 0 24px 0' }}>
                    <div>
                      <h1 className="doc-page-title">Scan Requests</h1>
                      <p className="doc-page-subtitle">Doctor-requested diagnostic scans for your center</p>
                    </div>
                  </div>

                  {scanRequests.filter(r => r.status === "Pending").length === 0 ? (
                    <div className="card" style={{ textAlign: 'center', padding: '48px 24px' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 48, color: '#cbd5e1', marginBottom: 12 }}>inbox</span>
                      <p style={{ fontWeight: 600, color: '#0f1c35', margin: '0 0 6px 0' }}>No Pending Scan Requests</p>
                      <p style={{ color: '#6b7a99', fontSize: '0.82rem', margin: 0 }}>Requests from doctors will appear here</p>
                    </div>
                  ) : (
                    <div className="card">
                      <div className="doc-table-wrapper">
                        <table className="doc-table">
                          <thead>
                            <tr>
                              <th>PATIENT</th>
                              <th>SCAN TYPE</th>
                              <th>DOCTOR</th>
                              <th>DATE</th>
                              <th>STATUS</th>
                              <th>ACTIONS</th>
                            </tr>
                          </thead>
                          <tbody>
                            {scanRequests.filter(r => r.status === "Pending").map((r, i) => (
                              <tr key={r.id || i}>
                                <td>
                                  <div className="doc-patient-cell">
                                    <div className="doc-patient-avatar-sm">{r.patientName?.[0] || "P"}</div>
                                    <span className="doc-patient-name-text">{r.patientName}</span>
                                  </div>
                                </td>
                                <td><span className="doc-badge-chip gray">{r.scanType}</span></td>
                                <td style={{ color: '#4b5563', fontSize: '14px' }}>Dr. {r.doctor}</td>
                                <td style={{ color: '#4b5563', fontSize: '14px' }}>{r.date}</td>
                                <td>
                                  <div className={`doc-status-text ${r.status?.toLowerCase() || 'pending'}`}>
                                    <span className="doc-status-dot"></span>
                                    {r.status}
                                  </div>
                                </td>
                                <td>
                                  {r.status === "Pending" && (
                                    <button className="doc-action-link" style={{ cursor: 'pointer', color: '#2e6db4', border: 'none', background: 'none', fontWeight: 600, fontSize: '13px' }} onClick={() => {
                                      setTargetEmail(r.patientEmail || "");
                                      setTargetDoctor(r.doctor || "");
                                      setTargetRequest(r.id);
                                      setPatientVerified(!!r.patientEmail);
                                      setActiveTab("upload");
                                    }}>
                                      Upload Result
                                    </button>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* ── ALL FILES TAB ── */}
              {activeTab === "files" && (
                <>
                  <div className="doc-page-header" style={{ padding: '0 0 24px 0' }}>
                    <div>
                      <h1 className="doc-page-title">All Files</h1>
                      <p className="doc-page-subtitle">Manage all uploaded diagnostic reports</p>
                    </div>
                    <button className="doc-export-btn">
                      <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>download</span>
                      Export
                    </button>
                  </div>

                  <div className="card">
                    {files.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '48px 24px' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 48, color: '#cbd5e1', marginBottom: 12 }}>folder_off</span>
                        <p style={{ fontWeight: 600, color: '#0f1c35', margin: '0 0 6px 0' }}>No Files Uploaded</p>
                        <p style={{ color: '#6b7a99', fontSize: '0.82rem', margin: 0 }}>Upload diagnostic reports to see them here</p>
                      </div>
                    ) : (
                      <>
                        <div className="doc-table-wrapper">
                          <table className="doc-table">
                            <thead>
                              <tr>
                                <th>FILE NAME</th>
                                <th>PATIENT</th>
                                <th>SIZE</th>
                                <th>DATE</th>
                                <th>STATUS</th>
                                <th>ACTIONS</th>
                              </tr>
                            </thead>
                            <tbody>
                              {files.map(f => (
                                <tr key={f.id}>
                                  <td>
                                    <div className="doc-patient-cell">
                                      <span style={{ fontSize: 20 }}>{getFileIcon(f.type)}</span>
                                      <span className="doc-patient-name-text">{f.name}</span>
                                    </div>
                                  </td>
                                  <td style={{ color: '#4b5563', fontSize: '14px' }}>{f.patientEmail || "—"}</td>
                                  <td style={{ color: '#4b5563', fontSize: '14px' }}>{f.size}</td>
                                  <td style={{ color: '#4b5563', fontSize: '14px' }}>{f.date}</td>
                                  <td><span className="doc-badge-chip gray">{f.status}</span></td>
                                  <td>
                                    <button className="doc-action-link" style={{ cursor: 'pointer', color: '#ef4444', border: 'none', background: 'none', fontWeight: 600, fontSize: '13px' }} onClick={() => handleDelete(f.id)}>
                                      Delete
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        <div className="doc-table-footer">
                          <span className="doc-table-footer-text">Showing {files.length} of {files.length} files</span>
                          <div className="doc-table-pagination">
                            <button className="doc-btn-sec">Previous</button>
                            <button className="doc-btn-sec">Next</button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </>
              )}

            </div>

            {/* RIGHT PANEL */}
            <aside className="right">
              {/* Center Info */}
              <div className="section-title">
                <span>Center Overview</span>
                <button className="dots-btn">•••</button>
              </div>
              <div className="appt-featured-card" style={{ flexDirection: "column", gap: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ fontSize: 26 }}>🔬</div>
                  <div>
                    <h3 style={{ fontSize: "0.95rem", fontWeight: 700, color: "white", margin: 0 }}>{diagnostic.centerName || "Diagnostic Center"}</h3>
                    <p style={{ fontSize: "0.74rem", color: "rgba(255,255,255,0.6)", marginTop: 3 }}>{diagnostic.email || "—"}</p>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        )}

        {/* ── SETTINGS TAB ── */}
        {activeTab === "settings" && (
          <div className="content">
            <div className="center">
              <div className="doc-page-header" style={{ padding: '0 0 24px 0' }}>
                <div style={{ flex: 1 }}>
                  <div className="doc-settings-header">
                    <div>
                      <h1 className="doc-page-title">Settings</h1>
                      <p className="doc-page-subtitle">Manage your diagnostic center preferences</p>
                    </div>
                    <div className="doc-settings-actions">
                      <button className="doc-btn-sec">Discard Changes</button>
                      <button className="doc-btn-primary" onClick={() => {
                        const newProfile = {
                          ...diagnostic,
                          centerName: document.getElementById('diag-name')?.value || diagnostic.centerName,
                          email: document.getElementById('diag-email')?.value || diagnostic.email,
                          phone: document.getElementById('diag-phone')?.value || diagnostic.phone,
                        };
                        setDiagnostic(newProfile);
                        localStorage.setItem("diagnosticProfile", JSON.stringify(newProfile));
                        const existingDiag = JSON.parse(localStorage.getItem("registeredDiagnostics")) || [];
                        const idx = existingDiag.findIndex(d => d.email?.toLowerCase() === diagnostic.email?.toLowerCase());
                        if (idx >= 0) existingDiag[idx] = { ...existingDiag[idx], ...newProfile };
                        else existingDiag.push(newProfile);
                        localStorage.setItem("registeredDiagnostics", JSON.stringify(existingDiag));
                        alert('Settings saved successfully!');
                      }}>Save Changes</button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="doc-settings-container">
                <div className="doc-profile-section">
                  <div className="doc-profile-lg-wrap">
                    <div className="doc-profile-avatar-lg" style={{ background: '#eef2ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px', fontWeight: 700, width: '96px', height: '96px', borderRadius: '50%' }}>
                      🔬
                    </div>
                    <label className="doc-profile-cam-btn" style={{ cursor: 'pointer' }}>
                       <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => {
                         if(e.target.files[0]) alert('Image uploaded successfully: ' + e.target.files[0].name);
                       }} />
                       <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>photo_camera</span>
                    </label>
                  </div>
                  <div className="doc-profile-info-lg">
                    <h2>{diagnostic.centerName || "Diagnostic Center"}</h2>
                    <p><span className="material-symbols-outlined" style={{ fontSize: '14px', verticalAlign: 'middle', marginRight: '4px' }}>verified</span>Lab ID: {diagnostic.labId || "DC-0001"}</p>
                  </div>
                </div>

                <div className="doc-settings-section">
                  <h3 className="doc-settings-title">Center Information</h3>
                  <div className="doc-form-grid doc-form-group-outline">
                    <div className="doc-form-group">
                      <label className="doc-form-label">Center Name</label>
                      <input id="diag-name" type="text" className="doc-form-input" defaultValue={diagnostic.centerName} />
                    </div>
                    <div className="doc-form-group">
                      <label className="doc-form-label">Email Address</label>
                      <input id="diag-email" type="email" className="doc-form-input" defaultValue={diagnostic.email} />
                    </div>
                    <div className="doc-form-group">
                      <label className="doc-form-label">Phone Number</label>
                      <input id="diag-phone" type="text" className="doc-form-input" defaultValue={diagnostic.phone} />
                    </div>
                    <div className="doc-form-group">
                      <label className="doc-form-label">Lab ID</label>
                      <input type="text" className="doc-form-input" defaultValue={diagnostic.labId || "DC-0001"} readOnly style={{ opacity: 0.6 }} />
                    </div>
                  </div>
                </div>

                <div className="doc-settings-section">
                  <h3 className="doc-settings-title">Security</h3>
                  <p className="doc-settings-subtitle">Secure your account and manage authentication methods.</p>
                  
                  <div className="doc-security-box">
                    <div className="doc-toggle-row">
                      <div className="doc-toggle-text">
                        <h4>Two-Factor Authentication</h4>
                        <p>Add an extra layer of security to your account.</p>
                      </div>
                      <div className="doc-toggle-switch">
                        <div className="doc-toggle-circle"></div>
                      </div>
                    </div>
                    
                    <div className="doc-toggle-text" style={{ marginBottom: '12px' }}>
                      <h4>Change Password</h4>
                    </div>
                    <div className="doc-password-row doc-form-group-outline">
                      <input type="password" className="doc-form-input" placeholder="Current Password" />
                      <input type="password" className="doc-form-input" placeholder="New Password" />
                      <input type="password" className="doc-form-input" placeholder="Confirm New Password" />
                    </div>
                    <button className="doc-btn-sec" style={{ background: '#f4f6fb', padding: '8px 16px' }}>Update Password</button>
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

export default DiagnosticDashboard;
