// src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../App.css";

const AFRICA_API =
  "https://newsapi.org/v2/top-headlines?category=general&country=ng&apiKey=YOUR_API_KEY";
const WORLD_API =
  "https://newsapi.org/v2/top-headlines?category=general&language=en&apiKey=YOUR_API_KEY";

const Home = () => {
  const [africaNews, setAfricaNews] = useState([]);
  const [worldNews, setWorldNews] = useState([]);

  // Default placeholders if API fails
  const defaultAfrica = [
    {
      title: "Africa Headline 1",
      description: "Short description of Africa news article.",
    },
    {
      title: "Africa Headline 2",
      description: "Short description of Africa news article.",
    },
    {
      title: "Africa Headline 3",
      description: "Short description of Africa news article.",
    },
    {
      title: "Africa Headline 4",
      description: "Short description of Africa news article.",
    },
    {
      title: "Africa Headline 5",
      description: "Short description of Africa news article.",
    },
  ];

  const defaultWorld = [
    {
      title: "World Headline 1",
      description: "Short description of world news article.",
    },
    {
      title: "World Headline 2",
      description: "Short description of world news article.",
    },
    {
      title: "World Headline 3",
      description: "Short description of world news article.",
    },
    {
      title: "World Headline 4",
      description: "Short description of world news article.",
    },
    {
      title: "World Headline 5",
      description: "Short description of world news article.",
    },
  ];

  useEffect(() => {
    const fetchAfricaNews = async () => {
      try {
        const res = await fetch(AFRICA_API);
        const data = await res.json();
        setAfricaNews(data.articles.slice(0, 5));
      } catch (err) {
        setAfricaNews(defaultAfrica);
      }
    };

    const fetchWorldNews = async () => {
      try {
        const res = await fetch(WORLD_API);
        const data = await res.json();
        setWorldNews(data.articles.slice(0, 5));
      } catch (err) {
        setWorldNews(defaultWorld);
      }
    };

    fetchAfricaNews();
    fetchWorldNews();
  }, []);

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
          {africaNews.map((news, idx) => (
            <article
              key={idx}
              className="news-card animate-in slide-up"
              style={{ animationDelay: `${idx * 0.2}s` }}
            >
              <h3>{news.title}</h3>
              <p>{news.description || "No description available."}</p>
              <a
                href={news.url || "#"}
                target="_blank"
                rel="noopener noreferrer"
              >
                Read More
              </a>
            </article>
          ))}
        </div>
      </section>

      {/* World News Section */}
      <section className="news-section" id="world-news">
        <h2>World News</h2>
        <div className="news-cards">
          {worldNews.map((news, idx) => (
            <article
              key={idx}
              className="news-card animate-in slide-up"
              style={{ animationDelay: `${idx * 0.2}s` }}
            >
              <h3>{news.title}</h3>
              <p>{news.description || "No description available."}</p>
              <a
                href={news.url || "#"}
                target="_blank"
                rel="noopener noreferrer"
              >
                Read More
              </a>
            </article>
          ))}
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
