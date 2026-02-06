import React, { useEffect, useState } from "react";
import "../App.css";
import { useI18n } from "../i18n";

const Videos = () => {
  const { t } = useI18n();
  const [videoNews, setVideoNews] = useState([]);
  const apiUrl = process.env.REACT_APP_API_URL || "https://info-site-4.onrender.com";

  useEffect(() => {
    fetch(`${apiUrl}/api/news`)
      .then(res => res.json())
      .then(newsList => {
        // Filter news with videoUrl
        setVideoNews(newsList.filter(n => n.videoUrl));
      });
  }, [apiUrl]);

  return (
    <main className="news-details animate-in slide-left">
      <h2>{t("videos")}</h2>
      <section className="videos-section">
        {videoNews.length === 0 && <p>{t("noVideosFound")}</p>}
        {videoNews.map(news => (
          <div key={news.id} className="video-card animate-in slide-left">
            <h1>{t(news.title)}</h1>
            <p className="news-meta">
              {news.zone && <span>{t(news.zone)}</span>}
              {news.subzone && <span> | {t(news.subzone)}</span>}
            </p>
            {news.videoUrl && (
              <video
                controls
                style={{ width: "100%", borderRadius: "12px", marginBottom: "20px" }}
              >
                <source src={`${apiUrl}/${news.videoUrl}`} type="video/mp4" />
                {t("videoNotSupported")}
              </video>
            )}
          </div>
        ))}
      </section>
    </main>
  );
};

export default Videos;
