// src/pages/Home.jsx

import React from "react";
import { Link } from "react-router-dom";
import "../App.css";
// import "../Admin.css";
import { useI18n } from "../i18n";

const Home = () => {
  const { t } = useI18n();
  // Fetch latest Africa and World news
  const [africaNews, setAfricaNews] = React.useState([]);
  const [worldNews, setWorldNews] = React.useState([]);
  const [originalAfricaNews, setOriginalAfricaNews] = React.useState([]);
  const [originalWorldNews, setOriginalWorldNews] = React.useState([]);
  const [lastTranslatedLang, setLastTranslatedLang] = React.useState("en");


  async function translateText(text, targetLang, sourceLang = "auto") {
    const apiKey = process.env.REACT_APP_GOOGLE_TRANSLATE_KEY;
    if (!apiKey) {
      console.error("Google Translate API key missing");
      return text;
    }
    try {
      const response = await fetch(`https://translation.googleapis.com/language/translate/v2?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          q: text,
          target: targetLang,
          source: sourceLang === "auto" ? undefined : sourceLang,
          format: "text"
        }),
      });
      if (!response.ok) throw new Error("Translation API error");
      const data = await response.json();
      if (!data.data || !data.data.translations || !data.data.translations[0]) throw new Error("No translated text");
      return data.data.translations[0].translatedText;
    } catch (e) {
      console.error("Translation failed:", e);
      return text;
    }
  }

  React.useEffect(() => {
    fetch("/api/news/africa")
      .then((res) => res.json())
      .then((data) => {
        setAfricaNews(Array.isArray(data) ? data : []);
        setOriginalAfricaNews(Array.isArray(data) ? data : []);
      })
      .catch(() => { setAfricaNews([]); setOriginalAfricaNews([]); });
    fetch("/api/news/world")
      .then((res) => res.json())
      .then((data) => {
        setWorldNews(Array.isArray(data) ? data : []);
        setOriginalWorldNews(Array.isArray(data) ? data : []);
      })
      .catch(() => { setWorldNews([]); setOriginalWorldNews([]); });
    setLastTranslatedLang("en");
  }, []);

  // Translate news when language changes (except English)
  React.useEffect(() => {
    const lang = t("language");
    if (lang === lastTranslatedLang) return;
    if (lang === "en") {
      setAfricaNews(originalAfricaNews);
      setWorldNews(originalWorldNews);
      setLastTranslatedLang("en");
      return;
    }
    const doTranslate = async () => {
      const translateArr = async (arr) => Promise.all(arr.map(async (item) => ({
        ...item,
        title: await translateText(item.title, lang),
        description: await translateText(item.description, lang),
      })));
      setAfricaNews(await translateArr(originalAfricaNews));
      setWorldNews(await translateArr(originalWorldNews));
      setLastTranslatedLang(lang);
    };
    if (originalAfricaNews.length || originalWorldNews.length) doTranslate();
    // eslint-disable-next-line
  }, [t("language"), originalAfricaNews, originalWorldNews, lastTranslatedLang]);

  return (
    <main>
      {/* Hero Section */}
      <section id="hero">
        <h1>{t("afriqueInternationale")}</h1>
        <p>{t("uploadEditDelete")}</p>
        <Link to="/live">{t("liveTv")}</Link>
      </section>

      {/* Africa News Section */}
      <section className="news-section" id="africa-news">
        <h2>{t("news") + " - " + t("africa")}</h2>
        <div className="news-cards">
          {africaNews.slice(0, 2).map((news, idx) => (
            <article className="news-card" key={news.id || idx}>
              <h3>{news.title}</h3>
              <p>{news.description}</p>
              <Link to="/news">{t("news")}</Link>
            </article>
          ))}
        </div>
      </section>

      {/* World News Section */}
      <section className="news-section" id="world-news">
        <h2>{t("news") + " - " + t("world")}</h2>
        <div className="news-cards">
          {worldNews.slice(0, 2).map((news, idx) => (
            <article className="news-card" key={news.id || idx}>
              <h3>{news.title}</h3>
              <p>{news.description}</p>
              <Link to="/news">{t("news")}</Link>
            </article>
          ))}
        </div>
      </section>

      {/* Live TV Section */}
      <section id="live-tv">
        <h2>{t("liveTv")}</h2>
        <p>{t("clickToWatchLive")}</p>
        <Link to="/live">{t("liveTv")}</Link>
      </section>

      {/* Contact Section */}
      <section id="contact">
        <h2>{t("contact")}</h2>
        <p>{t("haveQuestions")}</p>
        <Link to="/contact">{t("contact")}</Link>
      </section>
    </main>
  );
};

export default Home;
