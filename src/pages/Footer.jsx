// src/components/Footer.jsx
import React from "react";
import "../App.css";

const Footer = () => {
  return (
    <footer className="footer">
      {/* Branding */}
      <div className="footer-section footer-branding">
        <h2>Afrique Internationale</h2>
        <p>Your source for news across Africa and the world</p>
      </div>

      {/* Quick Links */}
      <div className="footer-section footer-links">
        <h3>Quick Links</h3>
        <ul>
          <li>
            <a href="/">Home</a>
          </li>
          <li>
            <a href="/news">News</a>
          </li>
          <li>
            <a href="/live">Live TV</a>
          </li>
          <li>
            <a href="/contact">Contact</a>
          </li>
        </ul>
      </div>

      {/* Social / Contact */}
      <div className="footer-section footer-contact">
        <h3>Connect with us</h3>
        <div className="footer-social">
          {/* You can replace these <img> with your own icons */}
          <a href="https://wa.me/YOUR_NUMBER" target="_blank" rel="noreferrer">
            <img src="/images/whatsapp.png" alt="WhatsApp" />
          </a>
          <a href="mailto:info@afriqueinternationale.com">
            <img src="/images/email (1).png" alt="Email" />
          </a>
          <a
            href="https://www.instagram.com/YOUR_ACCOUNT"
            target="_blank"
            rel="noreferrer"
          >
            <img src="/images/instagram.png" alt="Instagram" />
          </a>
          <a
            href="https://www.youtube.com/YOUR_CHANNEL"
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
