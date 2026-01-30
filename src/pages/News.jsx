import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../App.css";

const defaultAfrica = [
  {
    id: "africa1",
    title: "African Union Meeting Concludes",
    description: "Leaders discuss economic growth and unity.",
    date: "2026-01-30",
    category: "Politics",
    imageUrl: "/images/politics1.jpg",
    videoUrl: "",
    content: "Full detailed article about the African Union meeting...",
  },
  {
    id: "africa2",
    title: "Tech Startup Raises Millions",
    description: "A Nigerian startup secures major funding.",
    date: "2026-01-29",
    category: "Tech",
    imageUrl: "/images/tech1.jpg",
    videoUrl: "",
    content: "Full article about the tech startup raising funds...",
  },
  {
    id: "africa3",
    title: "Environmental Policies Announced",
    description: "New policies aim to combat climate change.",
    date: "2026-01-28",
    category: "Environment",
    imageUrl: "/images/climate-change.jpg",
    videoUrl: "",
    content: "Full article on environmental policies in Africa...",
  },
  {
    id: "africa4",
    title: "Football Championship Updates",
    description: "Latest scores and highlights from African leagues.",
    date: "2026-01-27",
    category: "Sports",
    imageUrl: "/images/leagues.jpg",
    videoUrl: "",
    content: "Full sports coverage and match analysis...",
  },
  {
    id: "africa5",
    title: "Health Initiative Launch",
    description: "Campaign to improve public health launched.",
    date: "2026-01-26",
    category: "Health",
    imageUrl: "/images/health.jpg",
    videoUrl: "",
    content: "Full details about the health initiative...",
  },
];

const defaultWorld = [
  {
    id: "world1",
    title: "Global Climate Summit",
    description: "World leaders meet to discuss climate action.",
    date: "2026-01-30",
    category: "Environment",
    imageUrl: "/images/climate.jpg",
    videoUrl: "",
    content: "Full article about the global climate summit...",
  },
  {
    id: "world2",
    title: "Tech Giant Releases New Device",
    description: "Latest gadget features cutting-edge technology.",
    date: "2026-01-29",
    category: "Tech",
    imageUrl: "/images/tech.jpg",
    videoUrl: "",
    content: "Full article about the tech product launch...",
  },
  {
    id: "world3",
    title: "International Trade Agreement Signed",
    description: "Countries agree on new economic deal.",
    date: "2026-01-28",
    category: "Economy",
    imageUrl: "/images/economy.jpg",
    videoUrl: "",
    content: "Full coverage of the trade agreement...",
  },
  {
    id: "world4",
    title: "Space Exploration Update",
    description: "New discoveries from a space mission revealed.",
    date: "2026-01-27",
    category: "Science",
    imageUrl: "/images/science.jpg",
    videoUrl: "",
    content: "Full article about the space exploration mission...",
  },
  {
    id: "world5",
    title: "Global Health Report Released",
    description: "WHO publishes latest global health findings.",
    date: "2026-01-26",
    category: "Health",
    imageUrl: "/images/who.jpg",
    videoUrl: "",
    content: "Full details of the health report and analysis...",
  },
];

const NewsCard = ({ news }) => (
  <article className="news-card-horizontal">
    {news.imageUrl && (
      <img src={news.imageUrl} alt={news.title} className="news-image" />
    )}
    <h3>{news.title}</h3>
    <p>{news.description}</p>
    <p className="news-meta">
      {news.date} • {news.category}
    </p>
    {news.videoUrl && (
      <video controls className="news-video">
        <source src={news.videoUrl} type="video/mp4" />
      </video>
    )}
    <Link to={`/news/${news.id}`}>Read More</Link>
  </article>
);

const ScrollableNews = ({ newsArray }) => {
  // Duplicate array for seamless scroll
  const combined = [...newsArray, ...newsArray];

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

const News = () => {
  const [africaNews, setAfricaNews] = useState([]);
  const [worldNews, setWorldNews] = useState([]);

  useEffect(() => {
    setAfricaNews(defaultAfrica);
    setWorldNews(defaultWorld);
  }, []);

  return (
    <main>
      <section className="news-section" id="africa-news">
        <h2>Africa News</h2>
        <ScrollableNews newsArray={africaNews} />
      </section>

      <section className="news-section" id="world-news">
        <h2>World News</h2>
        <ScrollableNews newsArray={worldNews} />
      </section>
    </main>
  );
};

export default News;
