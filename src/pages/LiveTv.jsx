// src/pages/LiveTV.jsx
import React from "react";
import "../App.css";

const liveChannels = [
  {
    id: "ddnews",
    name: "DD News 24x7",
    embedUrl: "https://www.youtube.com/embed/TxoAYWg64Ao",
  },
  {
    id: "ddindia",
    name: "DD India Live News",
    embedUrl: "https://www.youtube.com/embed/TBlxk1kH9dM",
  },
  {
    id: "france24",
    name: "France 24 English Live",
    embedUrl:
      "https://www.youtube.com/embed/live_stream?channel=UCLqNJlHfQYqFpT2Np6H5t1Q",
  },
];

const LiveTV = () => {
  return (
    <main className="live-tv-main">
      <h1>🌍 Live News TV</h1>
      <p>Select a channel below to watch live news.</p>

      <div className="live-tv-grid">
        {liveChannels.map((channel) => (
          <div key={channel.id} className="live-tv-card">
            <h2>{channel.name}</h2>
            <div className="video-container">
              <iframe
                src={channel.embedUrl}
                title={channel.name}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
};

export default LiveTV;
