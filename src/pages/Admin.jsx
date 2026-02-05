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
  const [zone, setZone] = useState("");
  const [subzone, setSubzone] = useState("");
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
    // On mount, check for token in localStorage
    const storedToken = localStorage.getItem("adminToken");
    if (storedToken && !token) {
      setToken(storedToken);
    }
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
    formData.append("zone", zone);
    // Only append subzone if zone requires it and subzone is not empty
    const zonesWithSubzones = [
      "africa",
      "europe",
      "middleEast",
      "asiaPacific",
      "americas",
    ];
    if (zonesWithSubzones.includes(zone) && subzone) {
      formData.append("subzone", subzone);
    } else if (zone === "opinions") {
      formData.append("subzone", "opinions");
    }
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

  const handleLogout = () => {
    setToken("");
    localStorage.removeItem("adminToken");
  };

  return (
    <div className="admin-root">
      <main className="admin-dashboard">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 10,
            alignItems: "center",
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
          <button
            onClick={handleLogout}
            style={{
              marginLeft: 16,
              background: "#f44336",
              color: "#fff",
              border: "none",
              padding: "6px 16px",
              borderRadius: 4,
              cursor: "pointer",
            }}
          >
            {t("logout") || "Logout"}
          </button>
        </div>
        <h1>{t("dashboard")}</h1>
        <p>{t("uploadEditDelete")}</p>
        {message && <p className="message">{message}</p>}

        <form className="admin-form" onSubmit={handleSubmit}>
          <label>
            {t("zones")}
            <select
              value={zone}
              onChange={(e) => {
                setZone(e.target.value);
                setSubzone("");
              }}
            >
              <option value="">{t("selectZone")}</option>
              <option value="africa">{t("africa")}</option>
              <option value="europe">{t("europe")}</option>
              <option value="middleEast">{t("middleEast")}</option>
              <option value="asiaPacific">{t("asiaPacific")}</option>
              <option value="americas">{t("americas")}</option>
              <option value="opinions">{t("opinions")}</option>
            </select>
          </label>
          {zone === "africa" && (
            <label>
              {t("selectSubzone")}
              <select
                value={subzone}
                onChange={(e) => setSubzone(e.target.value)}
              >
                <option value="">{t("selectSubzone")}</option>
                <option value="aes">{t("aes")}</option>
                <option value="ecowas">{t("ecowas")}</option>
                <option value="cemac">{t("cemac")}</option>
                <option value="au">{t("au")}</option>
              </select>
            </label>
          )}
          {zone === "europe" && (
            <label>
              {t("selectSubzone")}
              <select
                value={subzone}
                onChange={(e) => setSubzone(e.target.value)}
              >
                <option value="">{t("selectSubzone")}</option>
                <option value="eu">{t("eu")}</option>
                <option value="france">{t("france")}</option>
              </select>
            </label>
          )}
          {zone === "middleEast" && (
            <label>
              {t("selectSubzone")}
              <select
                value={subzone}
                onChange={(e) => setSubzone(e.target.value)}
              >
                <option value="">{t("selectSubzone")}</option>
                <option value="iran">{t("iran")}</option>
                <option value="syria">{t("syria")}</option>
                <option value="israel">{t("israel")}</option>
                <option value="palestine">{t("palestine")}</option>
              </select>
            </label>
          )}
          {zone === "asiaPacific" && (
            <label>
              {t("selectSubzone")}
              <select
                value={subzone}
                onChange={(e) => setSubzone(e.target.value)}
              >
                <option value="">{t("selectSubzone")}</option>
                <option value="china">{t("china")}</option>
                <option value="northKorea">{t("northKorea")}</option>
                <option value="afghanistan">{t("afghanistan")}</option>
              </select>
            </label>
          )}
          {zone === "americas" && (
            <label>
              {t("selectSubzone")}
              <select
                value={subzone}
                onChange={(e) => setSubzone(e.target.value)}
              >
                <option value="">{t("selectSubzone")}</option>
                <option value="unitedStates">{t("unitedStates")}</option>
                <option value="venezuela">{t("venezuela")}</option>
              </select>
            </label>
          )}
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
                {news.zone && <span> | Zone: {news.zone}</span>}
                {news.subzone && <span> | Subzone: {news.subzone}</span>}
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
