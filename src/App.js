// src/App.js
import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
// Pages
import Home from "./pages/Home";
import News from "./pages/News";
import LiveTv from "./pages/LiveTv";
import Contact from "./pages/Contact";
import Admin from "./pages/Admin";

// Components
import Navbar from "./pages/Navbar";
import Footer from "./pages/Footer";

function App() {
  useEffect(() => {
    // Setup Intersection Observer for scroll animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -100px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-in");
        } else {
          entry.target.classList.remove("animate-in");
        }
      });
    }, observerOptions);

    // Observe sections with alternating left/right animations
    const sections = document.querySelectorAll("section, #contact");
    sections.forEach((section, index) => {
      section.classList.add(index % 2 === 0 ? "slide-left" : "slide-right");
      observer.observe(section);
    });

    // Observe news cards with alternating animations
    const newsCards = document.querySelectorAll(".news-card");
    newsCards.forEach((card, index) => {
      card.classList.add(index % 2 === 0 ? "slide-left" : "slide-right");
      observer.observe(card);
    });

    return () => {
      sections.forEach((section) => observer.unobserve(section));
      newsCards.forEach((card) => observer.unobserve(card));
    };
  }, []);

  return (
    <Router>
      {/* Navbar always visible */}
      <Navbar />

      {/* Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/news" element={<News />} />
        <Route path="/live" element={<LiveTv />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>

      {/* Footer always visible */}
      <Footer />
    </Router>
  );
}

export default App;
