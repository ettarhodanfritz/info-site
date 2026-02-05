// src/components/Footer.jsx

import React from "react";
import "../App.css";
import { useI18n } from "../i18n";

const Footer = () => {
  const { t } = useI18n();
  return (
    <footer className="footer">
      {/* Branding */}
      <div className="footer-section footer-branding">
        <h2>Afrique Internationale</h2>
        <p>{t("uploadEditDelete")}</p>
      </div>

      {/* Quick Links */}
      <div className="footer-section footer-links">
        <h3>{t("quickLinks")}</h3>
        <ul>
          <li>
            <a href="/">{t("home")}</a>
          </li>
          <li>
            <a href="/news">{t("news")}</a>
          </li>
          <li>
            <a href="/live">{t("liveTv")}</a>
          </li>
          <li>
            <a href="/contact">{t("contact")}</a>
          </li>
        </ul>
      </div>

      {/* Social / Contact */}
      <div className="footer-section footer-contact">
        <h3>{t("connectWithUs")}</h3>
        <div className="footer-social">
          {/* You can replace these <img> with your own icons */}
          <a href="https://wa.me/674407882" target="_blank" rel="noreferrer">
            <img src="/images/whatsapp.png" alt="WhatsApp" />
          </a>
          <a href="mailto:africainpressconsulting@gmail.com">
            <img src="/images/email.png" alt="Email" />
          </a>
          <a
            href="https://www.instagram.com/afrique_internationale?igsh=MWU5cnk3bHp4dTcyMQ%3D%3D&utm_source=qr"
            target="_blank"
            rel="noreferrer"
          >
            <img src="/images/instagram.png" alt="Instagram" />
          </a>
          <a
            href="https://m.youtube.com/channel/UCPUwvLTv3k2q28pI_6rvk5A"
            target="_blank"
            rel="noreferrer"
          >
            <img src="/images/youtube.png" alt="YouTube" />
          </a>
        </div>
      </div>

      {/* Copyright */}
      <div className="footer-bottom">
        <p>© 2026 Afrique Internationale. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
