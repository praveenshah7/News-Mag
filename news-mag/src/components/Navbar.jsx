import { useState } from "react";

const Navbar = ({ darkMode, setDarkMode }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <nav
      className={`navbar navbar-expand-lg ${
        darkMode ? "navbar-dark bg-dark" : "navbar-light bg-light"
      } shadow-sm`}
    >
      <div className="container-fluid">
        <a className="navbar-brand fw-bold fs-4" href="/">
          <span className="badge bg-danger text-white">NewsMag</span>
        </a>

        <button
          className="navbar-toggler"
          type="button"
          onClick={() => setIsCollapsed(!isCollapsed)}
          aria-controls="navbarNav"
          aria-expanded={!isCollapsed}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className={`collapse navbar-collapse ${!isCollapsed ? "show" : ""}`}
          id="navbarNav"
        >
          <ul className="navbar-nav ms-auto align-items-center">
            <li className="nav-item">
              <a className="nav-link active" aria-current="page" href="/">Home</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/">Features</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/">Pricing</a>
            </li>
            <li className="nav-item">
              <a className="nav-link disabled" aria-disabled="true" href="/">Disabled</a>
            </li>

            <li className="nav-item d-flex align-items-center ms-3">
              <div className="form-check form-switch mb-0">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="darkModeNavSwitch"
                  checked={darkMode}
                  onChange={() => setDarkMode(!darkMode)}
                />
                <label
                  className="form-check-label ms-2"
                  htmlFor="darkModeNavSwitch"
                  style={{ color: darkMode ? "#f1f1f1" : "#000", fontWeight: "bold" }}
                >
                  {darkMode ? "Dark" : "Light"}
                </label>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;