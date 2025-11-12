import React from 'react';
import './Footer.css';
import Logo from '../assets/logo.png';

const Footer = () => {
  return (
    <footer className="custom-footer">
      <div className="footer-top">
        <div>
          <div className="footer-brand">
            <img src={Logo} alt="Logo" className="footer-logo" />
            <span className="footer-name">Notely</span>
          </div>
          <p className="footer-tagline">Your thoughts, beautifully organized.</p>
        </div>
        <div className="footer-links">
          <div>
            <h4>About</h4>
            <a href="#">Our Story</a>
            <a href="#">Features</a>
            <a href="#">Pricing</a>
            <a href="#">Testimonials</a>
          </div>
          <div>
            <h4>Resources</h4>
            <a href="#">Help Center</a>
            <a href="#">Blog</a>
            <a href="#">Tutorials</a>
          </div>
          <div>
            <h4>Connect</h4>
            <a href="#">GitHub</a>
            <a href="#">Discord</a>
            <a href="#">Contact Us</a>
          </div>
          <div>
            <h4>Legal</h4>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Cookies</a>
          </div>
        </div>
      </div>
      <hr />
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Notely™ All rights reserved.</span>
        <div className="social-icons">
          <a href="#" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
          <a href="#" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
          <a href="#" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
          <a href="#" aria-label="GitHub"><i className="fab fa-github"></i></a>
          <a href="#" aria-label="Dribbble"><i className="fab fa-dribbble"></i></a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;