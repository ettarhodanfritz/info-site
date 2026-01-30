import React from "react";
import { useParams, Link } from "react-router-dom";
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

const NewsDetails = () => {
  const { id } = useParams();

  const news =
    defaultAfrica.find((item) => item.id === id) ||
    defaultWorld.find((item) => item.id === id);

  if (!news) {
    return (
      <main>
        <h2>News Not Found</h2>
        <Link to="/news">Back to News</Link>
      </main>
    );
  }

  return (
    <main className="news-details animate-in slide-left">
      <h1>{news.title}</h1>
      <p className="news-meta">
        {news.date} • {news.category}
      </p>

      {news.imageUrl && news.imageUrl.trim() !== "" && (
        <img
          src={news.imageUrl}
          alt={news.title}
          style={{ width: "100%", borderRadius: "12px", marginBottom: "20px" }}
        />
      )}

      {news.videoUrl && news.videoUrl.trim() !== "" && (
        <video
          controls
          style={{ width: "100%", borderRadius: "12px", marginBottom: "20px" }}
        >
          <source src={news.videoUrl} type="video/mp4" />
        </video>
      )}

      <p>{news.content}</p>

      <Link to="/news" style={{ display: "inline-block", marginTop: "20px" }}>
        ← Back to News
      </Link>
    </main>
  );
};

export default NewsDetails;
