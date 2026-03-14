import { useState } from "react";

const socialLinks = [
  { href: "https://facebook.com", icon: "fab fa-facebook-f", label: "Facebook", color: "#1877f2" },
  { href: "https://twitter.com", icon: "fab fa-twitter", label: "Twitter", color: "#1da1f2" },
  { href: "https://instagram.com", icon: "fab fa-instagram", label: "Instagram", color: "#e1306c" },
  { href: "https://linkedin.com", icon: "fab fa-linkedin-in", label: "LinkedIn", color: "#0a66c2" },
  { href: "https://youtube.com", icon: "fab fa-youtube", label: "YouTube", color: "#ff0000" },
  { href: "https://wa.me/", icon: "fab fa-whatsapp", label: "WhatsApp", color: "#25d366" },
];

const quickLinks = ["Home", "Features", "Pricing", "About Us", "Contact"];

const SocialIcon = ({ social }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <a href={social.href} target="_blank" rel="noopener noreferrer" aria-label={social.label}
      style={{
        width: "40px", height: "40px", borderRadius: "50%",
        background: hovered ? social.color : "rgba(255,255,255,0.1)",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "#fff", fontSize: "16px",
        transition: "all 0.3s ease",
        textDecoration: "none",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <i className={social.icon}></i>
    </a>
  );
};

const QuickLink = ({ label }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <li className="mb-2">
      <a href="/" className="text-decoration-none d-flex align-items-center gap-2"
        style={{ color: hovered ? "#dc3545" : "#adb5bd", paddingLeft: hovered ? "8px" : "0px", transition: "all 0.3s ease" }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <span style={{ color: "#dc3545" }}>›</span> {label}
      </a>
    </li>
  );
};

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)", color: "#fff" }} className="pt-5 pb-3 mt-auto">
      <div className="container">
        <div className="row text-center text-md-start g-4">

          {/* Brand */}
          <div className="col-md-4 mb-4">
            <div className="d-flex align-items-center justify-content-center justify-content-md-start gap-2 mb-3">
              <span className="badge bg-danger px-3 py-2 fs-5">NewsMag</span>
            </div>
            <p className="small" style={{ color: "#adb5bd", lineHeight: "1.8" }}>
              Stay updated with the latest news from around the world. Powered by News API and built with React & Bootstrap.
            </p>
            <div className="mt-3">
              <span className="badge bg-danger me-2">News</span>
              <span className="badge bg-secondary me-2">Live</span>
              <span className="badge bg-secondary">Global</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-md-4 mb-4">
            <h5 className="mb-3 fw-bold" style={{ color: "#dc3545" }}>Quick Links</h5>
            <ul className="list-unstyled">
              {quickLinks.map(link => <QuickLink key={link} label={link} />)}
            </ul>
          </div>

          {/* Social + Newsletter */}
          <div className="col-md-4 mb-4">
            <h5 className="mb-3 fw-bold" style={{ color: "#dc3545" }}>Follow Us</h5>
            <div className="d-flex justify-content-center justify-content-md-start gap-2 mb-4 flex-wrap">
              {socialLinks.map(social => <SocialIcon key={social.label} social={social} />)}
            </div>
            <h6 className="fw-bold mb-2" style={{ color: "#adb5bd" }}>Newsletter</h6>
            <div className="d-flex gap-2">
              <input type="email" placeholder="Your email..."
                className="form-control form-control-sm"
                style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "#fff" }}
              />
              <button className="btn btn-danger btn-sm">Subscribe</button>
            </div>
          </div>
        </div>

        <hr style={{ borderColor: "rgba(255,255,255,0.1)" }} />

        {/* Bottom Bar */}
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
          <small style={{ color: "#adb5bd" }}>&copy; {currentYear} NewsMag. All rights reserved.</small>
          <small style={{ color: "#adb5bd" }}>Made with ❤️ using React & Bootstrap</small>
          <small style={{ color: "#adb5bd" }}>Powered by <span style={{ color: "#dc3545" }}>News API</span></small>
        </div>
      </div>
    </footer>
  );
};

export default Footer;