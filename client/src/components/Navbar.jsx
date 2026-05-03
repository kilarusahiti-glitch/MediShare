import React from "react";

function Navbar() {
  return (
    <header className="navbar">

      <div className="logo">
        <span>🩺</span>
        <h2>HealthPortal</h2>
      </div>

      <nav>
        <a href="#">Solutions</a>
        <a href="#">Partners</a>
        <a href="#">About</a>
        <a href="#">Support</a>
      </nav>

      <div className="nav-buttons">
        <button className="signin">Sign In</button>
        <button className="primary">Get Started</button>
      </div>

    </header>
  );
}

export default Navbar;