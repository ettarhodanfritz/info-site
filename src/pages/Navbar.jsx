import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../App.css";

const Navbar = () => {
  const [lang, setLang] = useState("en");
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="navbar-logo">
        <Link to="/">
          <img src="/images/logo.PNG" alt="Afrique Internationale" />
        </Link>
      </div>

      {/* Hamburger */}
      <div
        className={`hamburger ${menuOpen ? "open" : ""}`}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>

      {/* Menu */}
      <ul className={`navbar-menu ${menuOpen ? "show" : ""}`}>
        <li>
          <Link to="/" onClick={() => setMenuOpen(false)}>
            Home
          </Link>
        </li>
        <li>
          <Link to="/news" onClick={() => setMenuOpen(false)}>
            News
          </Link>
        </li>
        <li>
          <Link to="/live" onClick={() => setMenuOpen(false)}>
            Live TV
          </Link>
        </li>
        <li>
          <Link to="/contact" onClick={() => setMenuOpen(false)}>
            Contact
          </Link>
        </li>

        {/* Language Switcher */}
        <li className="navbar-lang">
          <button
            className={lang === "en" ? "active" : ""}
            onClick={() => setLang("en")}
          >
            EN
          </button>
          <button
            className={lang === "fr" ? "active" : ""}
            onClick={() => setLang("fr")}
          >
            FR
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
