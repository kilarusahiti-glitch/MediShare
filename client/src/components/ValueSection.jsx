import React from "react";

function ValueSection() {
  return (
    <section className="values">

      <h2>Our Value Propositions</h2>

      <div className="value-grid">

        <div className="card">
          <h3>Secure Records</h3>
          <p>Your medical data is encrypted and secure.</p>
        </div>

        <div className="card">
          <h3>Easy Scheduling</h3>
          <p>Book appointments with doctors instantly.</p>
        </div>

        <div className="card">
          <h3>Expert Consultations</h3>
          <p>Connect with specialists anytime.</p>
        </div>

      </div>

    </section>
  );
}

export default ValueSection;