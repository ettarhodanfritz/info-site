// src/App.js
import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import "./App.css";

// Pages
import Home from "./pages/Home";
import News from "./pages/News";
import LiveTv from "./pages/LiveTv";
import Contact from "./pages/Contact";
import Admin from "./pages/Admin";
import NewsDetails from "./pages/NewsDetails";
import ApproveNews from "./pages/ApproveNews";

// Components
import Navbar from "./pages/Navbar";
import Footer from "./pages/Footer";

// Scroll animations wrapper for non-admin pages
const ScrollAnimations = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/admin") return; // Skip admin page completely

    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -100px 0px",
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
  }, [location]);

  return null;
};

const AppWrapper = () => {
  const location = useLocation();
  const isAdmin = location.pathname === "/admin";
  const isApprove = location.pathname === "/approve-news";

  return (
    <>
      {/* Only show Navbar & Footer on non-admin pages */}
      {!isAdmin && !isApprove && <Navbar />}
      {!isAdmin && !isApprove && <ScrollAnimations />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/news" element={<News />} />
        <Route path="/news/:id" element={<NewsDetails />} />
        <Route path="/zone/:zone" element={<News />} />
        <Route path="/zone/:zone/:subzone" element={<News />} />
        <Route path="/live" element={<LiveTv />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/approve-news" element={<ApproveNews />} />
        {/* Admin completely isolated */}
      </Routes>

      {!isAdmin && !isApprove && <Footer />}
    </>
  );
};

function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}

export default App;
