// src/pages/Home.jsx
import React from "react";
import { Link } from "react-router-dom";
import "../App.css";

const Home = () => {
  return (
    <main>
      {/* Hero Section */}
      <section id="hero">
        <h1>Afrique Internationale</h1>
        <p>Reliable news from Africa and the world</p>
        <Link to="/live">Watch Live TV</Link>
      </section>

      {/* Africa News Section */}
      <section className="news-section" id="africa-news">
        <h2>Africa News</h2>
        <div className="news-cards">
          <article className="news-card">
            <h3>Headline 1</h3>
            <p>Short description of news article.</p>
            <Link to="/news">Read More</Link>
          </article>
          <article className="news-card">
            <h3>Headline 2</h3>
            <p>Short description of news article.</p>
            <Link to="/news">Read More</Link>
          </article>
        </div>
      </section>

      {/* World News Section */}
      <section className="news-section" id="world-news">
        <h2>World News</h2>
        <div className="news-cards">
          <article className="news-card">
            <h3>Headline 1</h3>
            <p>Short description of world news article.</p>
            <Link to="/news">Read More</Link>
          </article>
          <article className="news-card">
            <h3>Headline 2</h3>
            <p>Short description of world news article.</p>
            <Link to="/news">Read More</Link>
          </article>
        </div>
      </section>

      {/* Live TV Section */}
      <section id="live-tv">
        <h2>Watch Live</h2>
        <p>Click below to watch Afrique Internationale live broadcasts.</p>
        <Link to="/live">Go Live</Link>
      </section>

      {/* Contact Section */}
      <section id="contact">
        <h2>Contact Us</h2>
        <p>Have questions or news tips? Reach out directly.</p>
        <Link to="/contact">Contact Us</Link>
      </section>
    </main>
  );
};

export default Home;
