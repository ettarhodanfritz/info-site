import React, { useEffect, useState } from "react";
import "../Admin.css";
import { useI18n } from "../i18n";

const ApproveNews = () => {
  const { t, language, setLanguage } = useI18n();
  const apiUrl = process.env.REACT_APP_API_URL || "https://info-site-4.onrender.com";
  const [pendingNews, setPendingNews] = useState([]);
  const [allNews, setAllNews] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editCustomCategory, setEditCustomCategory] = useState("");
  const [editRegion, setEditRegion] = useState("");
  const [editImageFile, setEditImageFile] = useState(null);
  const [editVideoFile, setEditVideoFile] = useState(null);
    // Edit handler for superadmin
    const handleEdit = (news) => {
      setEditingId(news.id);
      setEditTitle(news.title);
      setEditDescription(news.description);
      setEditContent(news.content);
      setEditCategory(news.category);
      setEditCustomCategory(news.category === "Other" ? news.category : "");
      setEditRegion(news.region);
      setEditImageFile(null);
      setEditVideoFile(null);
      setActionMsg("");
    };

    // Submit edit for superadmin
    const handleEditSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      try {
        const formData = new FormData();
        formData.append("title", editTitle);
        formData.append("description", editDescription);
        formData.append("content", editContent);
        formData.append("category", editCategory === "Other" ? editCustomCategory : editCategory);
        formData.append("region", editRegion);
        if (editImageFile) formData.append("image", editImageFile);
        if (editVideoFile) formData.append("video", editVideoFile);
        const res = await fetch(`${apiUrl}/api/news/${editingId}`, {
          method: "PUT",
          body: formData,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Request failed");
        setActionMsg("News updated!");
        setEditingId(null);
        setEditTitle("");
        setEditDescription("");
        setEditContent("");
        setEditCategory("");
        setEditRegion("");
        setEditImageFile(null);
        setEditVideoFile(null);
      } catch (err) {
        setActionMsg("Error updating news");
      }
      setLoading(false);
    };
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
          <h1>{t("superAdminLogin") || "Superadmin Login"}</h1>
          <div style={{marginBottom:10, color:'#f44336', fontWeight:'bold'}}>Superadmin Dashboard Login</div>
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
              {news.imageUrl && (
                <div style={{marginTop:10}}>
                  <strong>Image:</strong><br />
                  <img src={news.imageUrl.startsWith('http') ? news.imageUrl : `${apiUrl}/${news.imageUrl}`} alt="News" style={{maxWidth:'300px',maxHeight:'200px',borderRadius:'6px'}} />
                </div>
              )}
              {news.videoUrl && (
                <div style={{marginTop:10}}>
                  <strong>Video:</strong><br />
                  <video src={news.videoUrl.startsWith('http') ? news.videoUrl : `${apiUrl}/${news.videoUrl}`} controls style={{maxWidth:'300px',maxHeight:'200px',borderRadius:'6px'}} />
                </div>
              )}
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
              {news.imageUrl && (
                <div style={{marginTop:10}}>
                  <strong>Image:</strong><br />
                  <img src={news.imageUrl.startsWith('http') ? news.imageUrl : `${apiUrl}/${news.imageUrl}`} alt="News" style={{maxWidth:'300px',maxHeight:'200px',borderRadius:'6px'}} />
                </div>
              )}
              {news.videoUrl && (
                <div style={{marginTop:10}}>
                  <strong>Video:</strong><br />
                  <video src={news.videoUrl.startsWith('http') ? news.videoUrl : `${apiUrl}/${news.videoUrl}`} controls style={{maxWidth:'300px',maxHeight:'200px',borderRadius:'6px'}} />
                </div>
              )}
              <div style={{color:news.approved?"#4caf50":"#f44336",fontWeight:600}}>
                {news.approved ? t("approved") : t("pending")}
              </div>
              <button onClick={() => handleEdit(news)} className="edit-btn" style={{marginTop:10,background:'#2196f3',color:'#fff',border:'none',padding:'6px 14px',borderRadius:4,cursor:'pointer',marginRight:8}}>
                {t("edit")}
              </button>
              <button onClick={() => handleDelete(news.id)} className="delete-btn" style={{marginTop:10,background:'#f44336',color:'#fff',border:'none',padding:'6px 14px',borderRadius:4,cursor:'pointer'}}>
                {t("delete")}
              </button>
            </div>
          ))}
        </div>

        {/* Edit modal for superadmin */}
        {editingId && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>{t("editNews")}</h2>
              <form onSubmit={handleEditSubmit} className="admin-form">
                <label>
                  {t("title")}
                  <input type="text" value={editTitle} onChange={e => setEditTitle(e.target.value)} required />
                </label>
                <label>
                  {t("description")}
                  <input type="text" value={editDescription} onChange={e => setEditDescription(e.target.value)} required />
                </label>
                <label>
                  {t("fullContent")}
                  <textarea value={editContent} onChange={e => setEditContent(e.target.value)} rows="5" required />
                </label>
                <label>
                  {t("category")}
                  <select value={editCategory} onChange={e => setEditCategory(e.target.value)}>
                    <option>Politics</option>
                    <option>Tech</option>
                    <option>Environment</option>
                    <option>Sports</option>
                    <option>Health</option>
                    <option>Economy</option>
                    <option>Science</option>
                    <option>Other</option>
                  </select>
                </label>
                {editCategory === "Other" && (
                  <label>
                    {t("specifyCategory")}
                    <input
                      type="text"
                      value={editCustomCategory}
                      onChange={e => setEditCustomCategory(e.target.value)}
                      required
                    />
                  </label>
                )}
                <label>
                  {t("region")}
                  <select value={editRegion} onChange={e => setEditRegion(e.target.value)}>
                    <option>Africa</option>
                    <option>World</option>
                  </select>
                </label>
                <label>
                  Image
                  <input type="file" accept="image/*" onChange={e => setEditImageFile(e.target.files[0])} />
                </label>
                <label>
                  Video
                  <input type="file" accept="video/*" onChange={e => setEditVideoFile(e.target.files[0])} />
                </label>
                <button type="submit">{t("updateNews")}</button>
                <button type="button" onClick={() => setEditingId(null)} style={{marginLeft:10}}>{t("cancel")}</button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ApproveNews;
