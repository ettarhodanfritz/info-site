
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "../App.css";
// import "../Admin.css";
import { useI18n } from "../i18n";

async function translateText(text, targetLang, sourceLang = "auto") {
  const response = await fetch("https://libretranslate.com/translate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      q: text,
      source: sourceLang,
      target: targetLang,
      format: "text"
    }),
  });
  const data = await response.json();
  return data.translatedText;
}

const NewsDetails = () => {
  const { t, language } = useI18n();
  const { id } = useParams();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [translating, setTranslating] = useState(false);
  const baseURL = "http://localhost:5000/"; // backend URL

  useEffect(() => {
    fetch(`/api/news/${id}`)
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

  // Translate news details when language changes (except English)
  useEffect(() => {
    if (!news || language === "en") return;
    const doTranslate = async () => {
      setTranslating(true);
      const translatedTitle = await translateText(news.title, language);
      const translatedContent = await translateText(news.content, language);
      setNews({ ...news, title: translatedTitle, content: translatedContent });
      setTranslating(false);
    };
    doTranslate();
    // eslint-disable-next-line
  }, [language, news]);

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
          src={`${baseURL}${news.imageUrl}`}
          alt={news.title}
          style={{ width: "100%", borderRadius: "12px", marginBottom: "20px" }}
        />
      )}

      {news.videoUrl && (
        <video
          controls
          style={{ width: "100%", borderRadius: "12px", marginBottom: "20px" }}
        >
          <source src={`${baseURL}${news.videoUrl}`} type="video/mp4" />
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
