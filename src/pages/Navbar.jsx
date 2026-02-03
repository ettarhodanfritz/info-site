
import React from "react";
import { Link } from "react-router-dom";
import "../App.css";
import { useI18n } from "../i18n";


const Navbar = () => {
  const { language, setLanguage, t } = useI18n();
  const [menuOpen, setMenuOpen] = React.useState(false);

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
            {t("home")}
          </Link>
        </li>
        <li>
          <Link to="/news" onClick={() => setMenuOpen(false)}>
            {t("news")}
          </Link>
        </li>
        <li>
          <Link to="/live" onClick={() => setMenuOpen(false)}>
            {t("liveTv")}
          </Link>
        </li>
        <li>
          <Link to="/contact" onClick={() => setMenuOpen(false)}>
            {t("contact")}
          </Link>
        </li>

        {/* Language Switcher */}
        <li className="navbar-lang">
          <button
            className={language === "en" ? "active" : ""}
            onClick={() => setLanguage("en")}
          >
            EN
          </button>
          <button
            className={language === "fr" ? "active" : ""}
            onClick={() => setLanguage("fr")}
          >
            FR
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
