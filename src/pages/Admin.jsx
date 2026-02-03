import React, { useEffect, useState } from "react";
import "../Admin.css";
import { useI18n } from "../i18n";

const Admin = () => {
  const { language, setLanguage, t } = useI18n();
  const [newsList, setNewsList] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("Politics");
  const [customCategory, setCustomCategory] = useState("");
  const [region, setRegion] = useState("Africa");
  const [imageFile, setImageFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [message, setMessage] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [token, setToken] = useState("");
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  // ...existing code...
  // Fetch all news
  const fetchNews = async () => {
    try {
      const apiUrl =
        process.env.REACT_APP_API_URL || "https://info-site-4.onrender.com";
      const res = await fetch(`${apiUrl}/api/news`);
      const data = await res.json();
      setNewsList(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setNewsList([]);
    }
  };

  useEffect(() => {
    if (token) fetchNews();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append(
      "category",
      category === "Other" ? customCategory : category,
    );
    formData.append("title", title);
    formData.append("description", description);
    formData.append("content", content);
    formData.append("region", region);
    if (imageFile) formData.append("image", imageFile);
    if (videoFile) formData.append("video", videoFile);

    try {
      const apiUrl =
        process.env.REACT_APP_API_URL || "https://info-site-4.onrender.com";
      const res = await fetch(
        editingId ? `${apiUrl}/api/news/${editingId}` : `${apiUrl}/api/news`,
        {
          method: editingId ? "PUT" : "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!res.ok) throw new Error("Request failed");
      setMessage(editingId ? "News updated!" : "News uploaded!");
      setTitle("");
      setDescription("");
      setContent("");
      setCategory("Politics");
      setRegion("Africa");
      setImageFile(null);
      setVideoFile(null);
      setEditingId(null);
      fetchNews();
    } catch (err) {
      console.error(err);
      setMessage("Error submitting news");
    }
  };

  // Handle admin login
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");
    try {
      const apiUrl =
        process.env.REACT_APP_API_URL || "https://info-site-4.onrender.com";
      const res = await fetch(`${apiUrl}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: loginUsername,
          password: loginPassword,
        }),
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

  const handleEdit = (news) => {
    setTitle(news.title);
    setDescription(news.description);
    setContent(news.content);
    if (
      [
        "Politics",
        "Tech",
        "Environment",
        "Sports",
        "Health",
        "Economy",
        "Science",
      ].includes(news.category)
    ) {
      setCategory(news.category);
      setCustomCategory("");
    } else {
      setCategory("Other");
      setCustomCategory(news.category);
    }
    setRegion(news.region);
    setEditingId(news.id); // sqlite uses id
    setMessage("");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this news?")) return;
    try {
      const apiUrl =
        process.env.REACT_APP_API_URL || "https://info-site-4.onrender.com";
      await fetch(`${apiUrl}/api/news/${id}`, { method: "DELETE" });
      setMessage("News deleted!");
      fetchNews();
    } catch (err) {
      console.error(err);
      setMessage("Error deleting news");
    }
  };

  if (!token) {
    return (
      <div className="admin-root">
        <main className="admin-dashboard">
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginBottom: 10,
            }}
          >
            <label>
              {t("selectLanguage")}
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                style={{ marginLeft: 8 }}
              >
                <option value="en">English</option>
                <option value="fr">Français</option>
              </select>
            </label>
          </div>
          <h1>{t("adminLogin") || "Admin Login"}</h1>
          <div
            style={{ marginBottom: 10, color: "#2196f3", fontWeight: "bold" }}
          >
            Admin Dashboard Login
          </div>
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
            {loginError && <p className="message">{loginError}</p>}
          </form>
        </main>
      </div>
    );
  }

  return (
    <div className="admin-root">
      <main className="admin-dashboard">
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: 10,
          }}
        >
          <label>
            {t("selectLanguage")}
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              style={{ marginLeft: 8 }}
            >
              <option value="en">English</option>
              <option value="fr">Français</option>
            </select>
          </label>
        </div>
        <h1>{t("dashboard")}</h1>
        <p>{t("uploadEditDelete")}</p>
        {message && <p className="message">{message}</p>}

        <form className="admin-form" onSubmit={handleSubmit}>
          <label>
            {t("title")}
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </label>
          <label>
            {t("description")}
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </label>
          <label>
            {t("fullContent")}
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows="5"
              required
            />
          </label>
          <label>
            {t("category")}
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
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
          {category === "Other" && (
            <label>
              Specify Category
              <input
                type="text"
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                required
              />
            </label>
          )}
          <label>
            {t("region")}
            <select value={region} onChange={(e) => setRegion(e.target.value)}>
              <option>Africa</option>
              <option>World</option>
            </select>
          </label>
          <label>
            {t("image")}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])}
            />
          </label>
          <label>
            {t("video")}
            <input
              type="file"
              accept="video/*"
              onChange={(e) => setVideoFile(e.target.files[0])}
            />
          </label>
          <button type="submit">
            {editingId ? t("updateNews") : t("uploadNews")}
          </button>
        </form>

        <h2 style={{ marginTop: "40px" }}>{t("allNews")}</h2>
        <div className="news-list">
          {newsList.map((news) => (
            <div key={news.id} className="news-item">
              <p>
                <strong>{news.title}</strong> ({news.region})
              </p>
              <div className="news-actions">
                <button onClick={() => handleEdit(news)}>{t("edit")}</button>
                <button onClick={() => handleDelete(news.id)}>
                  {t("delete")}
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Admin;
