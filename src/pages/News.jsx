
import React from "react";
import { Link } from "react-router-dom";
import "../App.css";
// import "../Admin.css";
import { useI18n } from "../i18n";

const NewsCard = ({ news }) => {
  const apiUrl = process.env.REACT_APP_API_URL || "https://info-site-4.onrender.com";

  return (
    <article className="news-card-horizontal">
      {news.imageUrl && (
        <img
          src={`${apiUrl}/${news.imageUrl}`}
          alt={news.title}
          className="news-image"
        />
      )}
      <h3>{news.title}</h3>
      <p>{news.description}</p>
      <p className="news-meta">
        {new Date(news.date).toLocaleDateString()} • {news.category}
      </p>
      {/* Video is only shown on the details page */}
      <Link to={`/news/${news.id}`}>Read More</Link>
    </article>
  );
};

const ScrollableNews = ({ newsArray }) => {
  const combined = [...newsArray, ...newsArray]; // seamless scroll
  return (
    <div className="scroll-container">
      <div className="scroll-content">
        {combined.map((news, idx) => (
          <NewsCard key={`${news.id}-${idx}`} news={news} />
        ))}
      </div>
    </div>
  );
};


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

const News = () => {
  const { t, language } = useI18n();
  const [africaNews, setAfricaNews] = React.useState([]);
  const [worldNews, setWorldNews] = React.useState([]);
  const [originalAfricaNews, setOriginalAfricaNews] = React.useState([]);
  const [originalWorldNews, setOriginalWorldNews] = React.useState([]);
  const [lastTranslatedLang, setLastTranslatedLang] = React.useState("en");
  const [loading, setLoading] = React.useState(false);

  // Fetch news on mount
  React.useEffect(() => {
    const apiUrl = process.env.REACT_APP_API_URL || "https://info-site-4.onrender.com";
    fetch(`${apiUrl}/api/news/africa`)
      .then((res) => res.json())
      .then((data) => {
        setAfricaNews(Array.isArray(data) ? data : []);
        setOriginalAfricaNews(Array.isArray(data) ? data : []);
      })
      .catch((err) => { console.error(err); setAfricaNews([]); setOriginalAfricaNews([]); });
    fetch(`${apiUrl}/api/news/world`)
      .then((res) => res.json())
      .then((data) => {
        setWorldNews(Array.isArray(data) ? data : []);
        setOriginalWorldNews(Array.isArray(data) ? data : []);
      })
      .catch((err) => { console.error(err); setWorldNews([]); setOriginalWorldNews([]); });
    setLastTranslatedLang("en");
  }, []);

  // Translate news when language changes
  React.useEffect(() => {
    if (language === lastTranslatedLang) return;
    if (language === "en") {
      setAfricaNews(originalAfricaNews);
      setWorldNews(originalWorldNews);
      setLastTranslatedLang("en");
      return;
    }
    const doTranslate = async () => {
      setLoading(true);
      const translateArr = async (arr) => Promise.all(arr.map(async (item) => ({
        ...item,
        title: await translateText(item.title, language),
        description: await translateText(item.description, language),
      })));
      setAfricaNews(await translateArr(originalAfricaNews));
      setWorldNews(await translateArr(originalWorldNews));
      setLastTranslatedLang(language);
      setLoading(false);
    };
    if (originalAfricaNews.length || originalWorldNews.length) doTranslate();
    // eslint-disable-next-line
  }, [language, originalAfricaNews, originalWorldNews, lastTranslatedLang]);

  return (
    <main>
      {loading && <p>Translating news...</p>}
      <section className="news-section" id="africa-news">
        <h2>{t("news") + " - Africa"}</h2>
        <ScrollableNews newsArray={africaNews} />
      </section>

      <section className="news-section" id="world-news">
        <h2>{t("news") + " - World"}</h2>
        <ScrollableNews newsArray={worldNews} />
      </section>
    </main>
  );
};

export default News;
