// src/pages/Contact.jsx

import React, { useState, useEffect } from "react";
import "../App.css";
// import "../Admin.css";
import { useI18n } from "../i18n";
import emailjs from "@emailjs/browser";

const Contact = () => {
  const { t, language } = useI18n();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [translatedPlaceholders, setTranslatedPlaceholders] = useState({
    name: t("username"),
    email: "Email",
    message: t("description"),
    send: t("send") || "Send Message",
  });

  useEffect(() => {
    setTranslatedPlaceholders({
      name: t("username"),
      email: "Email",
      message: t("description"),
      send: t("send") || "Send Message",
    });
  }, [language, t]);

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    let tempErrors = {};
    if (!formData.name) tempErrors.name = "Name is required";
    if (!formData.email) tempErrors.email = "Email is required";
    if (!formData.message) tempErrors.message = "Message is required";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const [submitStatus, setSubmitStatus] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus("");
    if (validate()) {
      try {
        await emailjs.send(
          process.env.REACT_APP_EMAILJS_SERVICE_ID,
          process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
          {
            name: formData.name,
            email: formData.email,
            message: formData.message,
          },
          process.env.REACT_APP_EMAILJS_PUBLIC_KEY,
        );
        setSubmitStatus(t("formSubmitted"));
        setFormData({ name: "", email: "", message: "" });
        setErrors({});
      } catch (err) {
        setSubmitStatus("Failed to send. Please try again later.");
      }
    }
  };

  return (
    <main>
      <section id="contact">
        <h2>{t("contact")}</h2>
        <p>{t("haveQuestions")}</p>

        <div className="news-cards">
          <form
            className="news-card animate-in slide-up"
            onSubmit={handleSubmit}
            style={{ maxWidth: "500px", width: "100%" }}
          >
            <input
              type="text"
              name="name"
              placeholder={translatedPlaceholders.name}
              value={formData.name}
              onChange={handleChange}
            />
            {errors.name && <p className="error">{errors.name}</p>}

            <input
              type="email"
              name="email"
              placeholder={translatedPlaceholders.email}
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <p className="error">{errors.email}</p>}

            <textarea
              name="message"
              placeholder={translatedPlaceholders.message}
              rows="5"
              value={formData.message}
              onChange={handleChange}
            />
            {errors.message && <p className="error">{errors.message}</p>}

            <button type="submit">{translatedPlaceholders.send}</button>
            {submitStatus && <p className="message">{submitStatus}</p>}
          </form>
        </div>
      </section>
    </main>
  );
};

export default Contact;
