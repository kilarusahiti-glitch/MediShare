import React from "react";

const PortalTabs = ({ role, setRole }) => {
  return (
    <div className="portal-tabs">
      {["patient", "doctor", "diagnostic"].map((r) => (
        <button
          key={r}
          className={role === r ? "active" : ""}
          onClick={() => setRole(r)}
        >
          {r.charAt(0).toUpperCase() + r.slice(1)}
        </button>
      ))}
    </div>
  );
};

export default PortalTabs;