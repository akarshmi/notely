import React, { useState } from "react";
import { Link as ScrollLink } from "react-scroll";
import { Link as RouterLink } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import Logo from "../Assets/Logoo.png";
import "./Navbar.css";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <div className="navbar-container">
      <div className="navbar-left">
        <img src={Logo} alt="Logo" className="navbar-logo" />
        <RouterLink to="/" className="navbar-brand">notely</RouterLink>
      </div>
      <div className="navbar-right-menubar">
        {isMenuOpen ? (
          <div className="navbar-menu-options">
            <CloseIcon onClick={() => setIsMenuOpen(false)} />

            {/* Scroll links */}
            <RouterLink onClick={() => setIsMenuOpen(false)} to="/">Home</RouterLink>
            <ScrollLink
              to="features"
              spy={true}
              smooth={true}
              duration={500}
              offset={-70}
              onClick={() => setIsMenuOpen(false)}
            >
              Features
            </ScrollLink>

            {/* Page links */}
            <RouterLink onClick={() => setIsMenuOpen(false)} to="/login">Login</RouterLink>
            <RouterLink onClick={() => setIsMenuOpen(false)} to="/signup">Sign Up</RouterLink>
            <RouterLink onClick={() => setIsMenuOpen(false)} to="/pricing">Pricing</RouterLink>
          </div>
        ) : (
          <MenuIcon onClick={() => setIsMenuOpen(true)} />
        )}
      </div>

      {/* Desktop Menu */}
      <div className="navbar-right-options">
        <RouterLink to="/">Home</RouterLink>
        <ScrollLink to="features" spy={true} smooth={true} duration={500} offset={-70}>
          Features
        </ScrollLink>
        <RouterLink to="/login">Login</RouterLink>
        <RouterLink to="/signup">Sign Up</RouterLink>
        <RouterLink to="/pricing">Pricing</RouterLink>
      </div>
    </div>
  );
};

export default Navbar;
