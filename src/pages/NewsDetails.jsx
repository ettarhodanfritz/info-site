
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "../App.css";
// import "../Admin.css";
import { useI18n } from "../i18n";



const NewsDetails = () => {
  const { t, language } = useI18n();
  const { id } = useParams();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [translating, setTranslating] = useState(false);
  const apiUrl = process.env.REACT_APP_API_URL || "https://info-site-4.onrender.com";

  useEffect(() => {
    fetch(`${apiUrl}/api/news/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setNews(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);



  if (loading) return <p>Loading...</p>;
  if (!news)
    return (
      <main>
        <h2>{t("news")} Not Found</h2>
        <Link to="/news">{t("news")}</Link>
      </main>
    );

  return (
    <main className="news-details animate-in slide-left">
      {translating && <p>Translating...</p>}
      <h1>{news.title}</h1>
      <p className="news-meta">
        {new Date(news.date).toLocaleDateString()} • {news.category}
      </p>

      {news.imageUrl && (
        <img
          src={`${apiUrl}/${news.imageUrl}`}
          alt={news.title}
          style={{ width: "100%", borderRadius: "12px", marginBottom: "20px" }}
        />
      )}

      {news.videoUrl && (
        <video
          controls
          style={{ width: "100%", borderRadius: "12px", marginBottom: "20px" }}
        >
          <source src={`${apiUrl}/${news.videoUrl}`} type="video/mp4" />
        </video>
      )}

      <p>{news.content}</p>

      <Link to="/news" style={{ display: "inline-block", marginTop: "20px" }}>
        {t("news")}
      </Link>
    </main>
  );
  // Removed unreachable second return block
};

export default NewsDetails;
