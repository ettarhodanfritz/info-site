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

      <div className="scroll-container">
        <div className="scroll-content">
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
          {/* Duplicate cards for seamless infinite scroll */}
          {liveChannels.map((channel) => (
            <div key={channel.id + "-clone"} className="live-tv-card">
              <h2>{channel.name}</h2>
              <div className="video-container">
                <iframe
                  src={channel.embedUrl}
                  title={channel.name + "-clone"}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default LiveTV;
