import React, { useEffect, useState } from "react";
import "../Admin.css";
import { useI18n } from "../i18n";

const ApproveNews = () => {
  const { t, language, setLanguage } = useI18n();
  const apiUrl = process.env.REACT_APP_API_URL || "https://info-site-4.onrender.com";
  const [pendingNews, setPendingNews] = useState([]);
  const [allNews, setAllNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionMsg, setActionMsg] = useState("");
  const [token, setToken] = useState(localStorage.getItem("adminToken") || "");
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    // Fetch pending news
    fetch(`${apiUrl}/api/news/pending`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (res.status === 401 || res.status === 403) {
          setToken("");
          localStorage.removeItem("adminToken");
          setError("Super admin access required. Please log in as a super admin.");
          setLoading(false);
          return;
        }
        const data = await res.json();
        if (Array.isArray(data)) {
          setPendingNews(data);
        } else {
          setPendingNews([]);
          setError(data && data.message ? data.message : "Unexpected response");
        }
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load pending news");
        setLoading(false);
      });
    // Fetch all news (approved and unapproved)
    fetch(`${apiUrl}/api/news`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setAllNews(data);
        else setAllNews([]);
      })
        .catch(() => setAllNews([]));
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actionMsg, token, t]);

  const handleDelete = (newsId) => {
    if (!window.confirm(t("confirmDelete") || "Are you sure you want to delete this news item?")) return;
    setLoading(true);
    fetch(`${apiUrl}/api/news/${newsId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (res.status === 401 || res.status === 403) {
          setToken("");
          localStorage.removeItem("adminToken");
          setError("Super admin access required. Please log in as a super admin.");
          setLoading(false);
          return;
        }
        if (!res.ok) {
          const data = await res.json();
          setError(data && data.message ? data.message : "Failed to delete news");
        } else {
          setActionMsg(`deleted-${newsId}-${Date.now()}`);
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to delete news");
        setLoading(false);
      });
  };

  const handleApprove = (id) => {
    fetch(`${apiUrl}/api/news/${id}/approve`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setActionMsg(data.message))
      .catch(() => setActionMsg("Failed to approve"));
  };

  const handleDecline = (id) => {
    fetch(`${apiUrl}/api/news/${id}/decline`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setActionMsg(data.message))
      .catch(() => setActionMsg("Failed to decline"));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");
    try {
      const res = await fetch(`${apiUrl}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: loginUsername, password: loginPassword }),
      });
      const data = await res.json();
      if (res.ok && data.token) {
        setToken(data.token);
        localStorage.setItem("adminToken", data.token);
        setLoginUsername("");
        setLoginPassword("");
      } else {
        setLoginError(data.message || "Login failed");
      }
    } catch (err) {
      setLoginError("Login failed");
    }
  };

  if (!token) {
    return (
      <div className="admin-root">
        <main className="admin-dashboard">
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 10 }}>
            <label>
              {t("selectLanguage")}
              <select value={language} onChange={e => setLanguage(e.target.value)} style={{ marginLeft: 8 }}>
                <option value="en">English</option>
                <option value="fr">Français</option>
              </select>
            </label>
          </div>
          <h1>{t("adminLogin")}</h1>
          <form className="admin-form" onSubmit={handleLogin}>
            <label>
              {t("username")}
              <input
                type="text"
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                required
              />
            </label>
            <label>
              {t("password")}
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </label>
            <button type="submit">{t("login")}</button>
            {loginError && <p className="message" style={{ color: "red" }}>{loginError}</p>}
          </form>
        </main>
      </div>
    );
  }

  return (
    <div className="admin-root">
      <main className="admin-dashboard">
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 10 }}>
          <label>
            {t("selectLanguage")}
            <select value={language} onChange={e => setLanguage(e.target.value)} style={{ marginLeft: 8 }}>
              <option value="en">English</option>
              <option value="fr">Français</option>
            </select>
          </label>
        </div>
        <h1>{t("dashboard")}: {t("approveNews")}</h1>
        <p style={{ textAlign: "center", color: "#888", marginBottom: 24 }}>{t("reviewApproveNews")}</p>
        {loading && <p>{t("loading")}</p>}
        {error && <p style={{ color: "red" }}>{t(error) !== error ? t(error) : error}</p>}
        {actionMsg && <p style={{ color: "green" }}>{t(actionMsg) !== actionMsg ? t(actionMsg) : actionMsg}</p>}
        <div className="admin-news-list">
          <h2 style={{marginTop:0, marginBottom:10}}>{t("pendingNews")}</h2>
          {pendingNews.length === 0 && !loading && <p>{t("noPendingNews")}</p>}
          {pendingNews.map((news) => (
            <div key={news.id} className="admin-news-card approve-news-card">
              <div className="approve-news-header">
                <h2>{news.title}</h2>
                <span className="approve-news-category">{news.category} | {news.region}</span>
              </div>
              <p className="approve-news-description">{news.description}</p>
              <div className="approve-news-content">{news.content}</div>
              <div className="approve-news-actions">
                <button onClick={() => handleApprove(news.id)} className="approve-btn">{t("approve") || "Approve"}</button>
                <button onClick={() => handleDecline(news.id)} className="decline-btn">{t("decline") || "Decline"}</button>
              </div>
            </div>
          ))}
        </div>
        <div className="admin-news-list" style={{marginTop:40}}>
          <h2>{t("allNews") || "All News"}</h2>
          {allNews.length === 0 && <p>{t("noNewsPosted")}</p>}
          {allNews.map((news) => (
            <div key={news.id} className="admin-news-card">
              <div className="approve-news-header">
                <h2>{news.title}</h2>
                <span className="approve-news-category">{news.category} | {news.region}</span>
              </div>
              <p className="approve-news-description">{news.description}</p>
              <div className="approve-news-content">{news.content}</div>
              <div style={{color:news.approved?"#4caf50":"#f44336",fontWeight:600}}>
                {news.approved ? t("approved") : t("pending")}
              </div>
              <button onClick={() => handleDelete(news.id)} className="delete-btn" style={{marginTop:10,background:'#f44336',color:'#fff',border:'none',padding:'6px 14px',borderRadius:4,cursor:'pointer'}}>
                {t("delete")}
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default ApproveNews;
