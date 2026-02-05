import React from "react";
import { Link } from "react-router-dom";
import "../App.css";
import { useI18n } from "../i18n";

const zonesData = [
  { zone: "africa", subzones: ["aes", "ecowas", "cemac", "au"] },
  { zone: "europe", subzones: ["eu", "france"] },
  { zone: "middleEast", subzones: ["iran", "syria", "israel", "palestine"] },
  { zone: "asiaPacific", subzones: ["china", "northKorea", "afghanistan"] },
  { zone: "americas", subzones: ["unitedStates", "venezuela"] },
];

function ZoneGroup({ zone, subzones, setMenuOpen, t }) {
  const [open, setOpen] = React.useState(false);
  return (
    <li className="zone-group">
      <span
        className="zone-group-toggle"
        onClick={() => setOpen((o) => !o)}
        style={{
          cursor: "pointer",
          fontWeight: "bold",
          color: "#ffd700",
          display: "block",
          padding: "8px 24px",
        }}
      >
        {t(zone)}{" "}
        <span style={{ float: "right", fontWeight: "normal" }}>
          {open ? "▲" : "▼"}
        </span>
      </span>
      <Link
        to={`/zone/${zone.toLowerCase().replace(/ /g, "-")}`}
        style={{ display: "block", paddingLeft: 40, color: "#fff" }}
        onClick={() => setMenuOpen(false)}
      >
        {t("allZone").replace("{zone}", t(zone))}
      </Link>
      {open && (
        <ul style={{ paddingLeft: 0 }}>
          {subzones.map((sub) => (
            <li key={sub}>
              <Link
                to={`/zone/${zone.toLowerCase().replace(/ /g, "-")}/${sub.toLowerCase().replace(/ /g, "-")}`}
                style={{ paddingLeft: 40, color: "#b0c4de", display: "block" }}
                onClick={() => setMenuOpen(false)}
              >
                {t(sub)}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}
const Navbar = () => {
  const { language, setLanguage, t } = useI18n();
  const [menuOpen, setMenuOpen] = React.useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <div
          className={`hamburger ${menuOpen ? "open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
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
          <li className="navbar-zones dropdown">
            <span className="dropdown-toggle">{t("zones")}</span>
            <ul className="dropdown-menu compact-zones">
              {zonesData.map((z) => (
                <ZoneGroup
                  key={z.zone}
                  zone={z.zone}
                  subzones={z.subzones}
                  setMenuOpen={setMenuOpen}
                  t={t}
                />
              ))}
              <li>
                <Link to="/zone/opinions" onClick={() => setMenuOpen(false)}>
                  <strong>{t("opinions")}</strong>
                </Link>
              </li>
            </ul>
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
        <div className="navbar-logo navbar-logo-right">
          <Link to="/">
            <img src="/images/logo.PNG" alt="Afrique Internationale" />
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
