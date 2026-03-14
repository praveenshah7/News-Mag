import { useState, useEffect } from "react";

const TypingText = ({ texts }) => {
  const [displayed, setDisplayed] = useState("");
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = texts[textIndex];
    const timeout = setTimeout(() => {
      if (!deleting) {
        setDisplayed(current.slice(0, charIndex + 1));
        setCharIndex(c => c + 1);
        if (charIndex + 1 === current.length) {
          setTimeout(() => setDeleting(true), 1500);
        }
      } else {
        setDisplayed(current.slice(0, charIndex - 1));
        setCharIndex(c => c - 1);
        if (charIndex - 1 === 0) {
          setDeleting(false);
          setTextIndex(i => (i + 1) % texts.length);
        }
      }
    }, deleting ? 60 : 100);
    return () => clearTimeout(timeout);
  }, [charIndex, deleting, textIndex, texts]);

  return (
    <span>
      {displayed}
      <span style={{ borderRight: "2px solid white", marginLeft: "2px", animation: "blink 0.7s infinite" }}></span>
      <style>{`@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }`}</style>
    </span>
  );
};

const categories = ["General", "Business", "Technology", "Sports", "Entertainment", "Health", "Science"];

const Navbar = ({ darkMode, setDarkMode, selectedCategory, setSelectedCategory }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  const formatDate = (date) => date.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" });

  return (
    <nav
      className={`navbar navbar-expand-lg ${darkMode ? "navbar-dark bg-dark" : "navbar-light bg-light"} shadow-sm`}
    >
      <div className="container-fluid">

        {/* Brand with Typing Animation */}
        <a className="navbar-brand fw-bold fs-4" href="/">
          <span className="badge bg-danger text-white" style={{ minWidth: "160px", display: "inline-block" }}>
            <TypingText texts={["NewsMag", "Stay Informed", "Latest News", "Read. Learn. Grow."]} />
          </span>
        </a>

        {/* Live Clock */}
        <div
          className={`d-none d-lg-flex flex-column align-items-center mx-3 ${darkMode ? "text-light" : "text-dark"}`}
          style={{ fontSize: "12px", lineHeight: "1.3" }}
        >
          <span className="fw-bold" style={{ fontSize: "15px", color: "#dc3545" }}>
            🕐 {formatTime(time)}
          </span>
          <span className="text-muted">{formatDate(time)}</span>
        </div>

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

        <div className={`collapse navbar-collapse ${!isCollapsed ? "show" : ""}`} id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center gap-2">

            {/* Category Dropdown */}
            <li className="nav-item dropdown">
              <button
                className="btn btn-danger dropdown-toggle"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                aria-expanded={dropdownOpen}
              >
                📰 {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}
              </button>
              <ul className={`dropdown-menu dropdown-menu-end ${dropdownOpen ? "show" : ""} ${darkMode ? "dropdown-menu-dark" : ""}`}>
                {categories.map((cat) => (
                  <li key={cat}>
                    <button
                      className={`dropdown-item ${selectedCategory === cat.toLowerCase() ? "active" : ""}`}
                      onClick={() => { setSelectedCategory(cat.toLowerCase()); setDropdownOpen(false); setIsCollapsed(true); }}
                    >
                      {cat === "General" && "🌍"}
                      {cat === "Business" && "💼"}
                      {cat === "Technology" && "💻"}
                      {cat === "Sports" && "⚽"}
                      {cat === "Entertainment" && "🎬"}
                      {cat === "Health" && "🏥"}
                      {cat === "Science" && "🔬"}
                      {" "}{cat}
                    </button>
                  </li>
                ))}
              </ul>
            </li>

            {/* Dark Mode Toggle */}
            <li className="nav-item d-flex align-items-center ms-2">
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