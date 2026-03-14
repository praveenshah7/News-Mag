const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark text-light pt-5 pb-3 mt-auto">
      <div className="container">
        <div className="row text-center text-md-start">
          {/* About Section */}
          <div className="col-md-4 mb-4">
            <h5 className="mb-3 fw-bold">NewsMag</h5>
            <p className="small">
              Stay updated with the latest news from around the world. Powered
              by News API and built with React & Bootstrap.
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-md-4 mb-4">
            <h5 className="mb-3 fw-bold">Quick Links</h5>
            <ul className="list-unstyled">
              <li><a href="/" className="text-light text-decoration-none">Home</a></li>
              <li><a href="/" className="text-light text-decoration-none">Features</a></li>
              <li><a href="/" className="text-light text-decoration-none">Pricing</a></li>
              <li><a href="/" className="text-light text-decoration-none">About Us</a></li>
              <li><a href="/" className="text-light text-decoration-none">Contact</a></li>
            </ul>
          </div>

          {/* Social Media */}
          <div className="col-md-4 mb-4">
            <h5 className="mb-3 fw-bold">Follow Us</h5>
            <div className="d-flex justify-content-center justify-content-md-start gap-3 fs-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-light" aria-label="Facebook">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-light" aria-label="Twitter">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-light" aria-label="Instagram">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-light" aria-label="LinkedIn">
                <i className="fab fa-linkedin-in"></i>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-light" aria-label="YouTube">
                <i className="fab fa-youtube"></i>
              </a>
              <a href="https://wa.me/" target="_blank" rel="noopener noreferrer" className="text-light" aria-label="WhatsApp">
                <i className="fab fa-whatsapp"></i>
              </a>
            </div>
          </div>
        </div>

        <hr className="border-light" />

        <div className="text-center small">
          &copy; {currentYear} NewsMag. All rights reserved.
        </div>
      </div>

      <style>{`
        a:hover {
          opacity: 0.7;
          transition: opacity 0.3s ease;
        }
      `}</style>
    </footer>
  );
};

export default Footer;