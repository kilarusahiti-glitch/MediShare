import React from "react";

function Hero() {
  return (
    <section className="hero">

      <div className="hero-text">

        <h1>Unified Healthcare Experience for Everyone</h1>

        <p>
          Experience a seamless journey with secure records,
          expert consultations and easy scheduling.
        </p>

        <div className="hero-buttons">
          <button className="primary">Get Started Now</button>
          <button className="secondary">View Solutions</button>
        </div>

      </div>

      <div className="hero-image">
        <img
          src="https://images.unsplash.com/photo-1584982751601-97dcc096659c"
          alt="doctor"
        />
      </div>

    </section>
  );
}

export default Hero;