import React from "react";

function RoleSelection() {
  return (
    <section className="roles">

      <h2>Choose Your Portal</h2>

      <div className="role-grid">

        <div className="role-card">
          <h3>Patients</h3>
          <p>Book appointments and manage health records.</p>
        </div>

        <div className="role-card">
          <h3>Doctors</h3>
          <p>Manage patients and schedule consultations.</p>
        </div>

        <div className="role-card">
          <h3>Diagnostic Centers</h3>
          <p>Upload reports and manage lab tests.</p>
        </div>

      </div>

    </section>
  );
}

export default RoleSelection;