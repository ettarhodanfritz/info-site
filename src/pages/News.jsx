
import React from "react";
import { Link, useParams } from "react-router-dom";
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
        {news.zone && <span> • Zone: {news.zone}</span>}
        {news.subzone && <span> • Subzone: {news.subzone}</span>}
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
  const { zone, subzone } = useParams();
  const [newsList, setNewsList] = React.useState([]);
  const [originalNewsList, setOriginalNewsList] = React.useState([]);
  const [lastTranslatedLang, setLastTranslatedLang] = React.useState("en");
  const [loading, setLoading] = React.useState(false);

  // Fetch news on mount or when zone/subzone changes
  React.useEffect(() => {
    const apiUrl = process.env.REACT_APP_API_URL || "https://info-site-4.onrender.com";
    // Convert dashes to spaces for backend filtering
    const zoneParam = zone ? zone.replace(/-/g, " ") : undefined;
    const subzoneParam = subzone ? subzone.replace(/-/g, " ") : undefined;
    let url = `${apiUrl}/api/news`;
    if (zoneParam && subzoneParam) {
      url = `${apiUrl}/api/news/zone/${encodeURIComponent(zoneParam)}/${encodeURIComponent(subzoneParam)}`;
    } else if (zoneParam) {
      url = `${apiUrl}/api/news/zone/${encodeURIComponent(zoneParam)}`;
    }
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setNewsList(Array.isArray(data) ? data : []);
        setOriginalNewsList(Array.isArray(data) ? data : []);
      })
      .catch((err) => { console.error(err); setNewsList([]); setOriginalNewsList([]); });
    setLastTranslatedLang("en");
  }, [zone, subzone]);

  // Translate news when language changes
  React.useEffect(() => {
    if (language === lastTranslatedLang) return;
    if (language === "en") {
      setNewsList(originalNewsList);
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
      setNewsList(await translateArr(originalNewsList));
      setLastTranslatedLang(language);
      setLoading(false);
    };
    if (originalNewsList.length) doTranslate();
    // eslint-disable-next-line
  }, [language, originalNewsList, lastTranslatedLang]);

  // Filter by zone/subzone if present in route
  // No need to filter here, backend already filters
  const filteredNews = newsList;

  return (
    <main>
      {loading && <p>Translating news...</p>}
      <section className="news-section" id="filtered-news">
        <h2>
          {zone ? `${t("news")} - ${zone.charAt(0).toUpperCase() + zone.slice(1)}` : t("news")}
          {subzone ? ` (${subzone.charAt(0).toUpperCase() + subzone.slice(1)})` : ""}
        </h2>
        <ScrollableNews newsArray={filteredNews} />
      </section>
    </main>
  );
};

export default News;
