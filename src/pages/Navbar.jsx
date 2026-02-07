import React from "react";
import { Link } from "react-router-dom";
import { useI18n } from "../i18n";
import zonesData from "../locales/zonesData";

const Navbar = () => {
  const { language, setLanguage, t } = useI18n();
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [newsDropdownOpen, setNewsDropdownOpen] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(window.innerWidth <= 768);
  const newsDropdownRef = React.useRef();
  const newsToggleRef = React.useRef();

  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close News dropdown on outside click
  React.useEffect(() => {
    if (!newsDropdownOpen) return;
    function handleClick(e) {
      if (
        newsDropdownRef.current &&
        !newsDropdownRef.current.contains(e.target) &&
        newsToggleRef.current &&
        !newsToggleRef.current.contains(e.target)
      ) {
        setNewsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [newsDropdownOpen]);

  // Helper to close News dropdown from child
  window.closeNewsDropdown = () => setNewsDropdownOpen(false);
  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <div className="navbar-logo">
          <Link to="/">
            <img src="/images/logo.PNG" alt="Afrique Internationale" />
          </Link>
        </div>
        <ul className={`navbar-menu ${menuOpen || !isMobile ? "show" : ""}`} style={isMobile ? { position: 'absolute', top: 60, right: 20, zIndex: 2000, background: '#222', borderRadius: 8, width: 200, flexDirection: 'column', padding: 0 } : {}}>
          {/* News dropdown with zones, subzones, opinions */}
          <li className="navbar-news dropdown" style={{ position: isMobile ? 'relative' : 'relative', width: '100%' }}>
            <span
              className="dropdown-toggle"
              ref={newsToggleRef}
              onClick={() => setNewsDropdownOpen((open) => !open)}
              style={{ cursor: "pointer", color: isMobile ? '#fff' : undefined, fontWeight: isMobile ? 'bold' : undefined, display: 'block', padding: isMobile ? '10px 20px' : undefined, width: '100%' }}
            >
              {t("news")}
              <span style={{ marginLeft: 8 }}>{newsDropdownOpen ? "▲" : "▼"}</span>
            </span>
            {newsDropdownOpen && (
              <ul
                ref={newsDropdownRef}
                className={`dropdown-menu compact-zones show`}
                style={
                  isMobile
                    ? { position: 'absolute', left: 0, top: '100%', width: '100%', background: '#222', boxShadow: '0 8px 24px rgba(0,0,0,0.18)', borderRadius: '0 0 8px 8px', zIndex: 3000, padding: 0, margin: 0, display: 'flex', flexDirection: 'column' }
                    : { position: 'absolute', left: 0, top: '100%', zIndex: 1200, minWidth: 220, background: '#222', borderRadius: '0 0 8px 8px', boxShadow: '0 8px 24px rgba(0,0,0,0.18)', padding: 10, margin: 0, display: 'flex', flexDirection: 'column' }
                }
              >
                {zonesData.map((z) => (
                  <ZoneGroup
                    key={z.zone}
                    zone={z.zone}
                    subzones={z.subzones}
                    setMenuOpen={setMenuOpen}
                    t={t}
                  />
                ))}
                
              </ul>
            )}
          </li>
          {/* Live */}
          <li>
            <Link to="/live" onClick={() => setMenuOpen(false)}>
              {t("liveTv")}
            </Link>
          </li>
          <li>
            <Link to="/videos" onClick={() => setMenuOpen(false)}>
              {t("videos")}
            </Link>
          </li>
          <li>
            <Link to="/contact" onClick={() => setMenuOpen(false)}>
              {t("contact")}
            </Link>
          </li>
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
        <div
          className={`hamburger ${menuOpen ? "open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

// Ensure ZoneGroup is defined above Navbar and not inside Navbar
const ZoneGroup = ({ zone, subzones, setMenuOpen, t }) => {
  const [open, setOpen] = React.useState(false);
  // Access the dropdown close function from window
  const closeNewsDropdown = window.closeNewsDropdown || (() => {});
  return (
    <li className="zone-group">
      <div>
        <span
          className="zone-group-toggle"
          onClick={() => setOpen((o) => !o)}
          style={{ cursor: "pointer", fontWeight: "bold", color: "#fff", display: "block", padding: "8px 24px" }}
        >
          {t(zone)}{" "}
          <span style={{ float: "right", fontWeight: "normal" }}>
            {open ? "▲" : "▼"}
          </span>
        </span>
        {open && (
          <ul style={{ paddingLeft: 0 }}>
            {subzones.map((sub) => (
              <li key={sub}>
                <Link
                  to={`/zone/${zone.toLowerCase().replace(/ /g, "-")}/${sub.toLowerCase().replace(/ /g, "-")}`}
                  style={{ paddingLeft: 40, color: "#b0c4de", display: "block" }}
                  onClick={() => {
                    setMenuOpen(false);
                    closeNewsDropdown();
                  }}
                >
                  {t(sub)}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </li>
  );
};
