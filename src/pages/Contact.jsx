// src/pages/Contact.jsx
import React, { useState } from "react";
import "../App.css";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      alert("Form submitted! ✅"); // Replace with API call later
      setFormData({ name: "", email: "", message: "" });
      setErrors({});
    }
  };

  return (
    <main>
      <section id="contact">
        <h2>Contact Us</h2>
        <p>Have questions or news tips? Reach out directly.</p>

        <div className="news-cards">
          <form
            className="news-card animate-in slide-up"
            onSubmit={handleSubmit}
            style={{ maxWidth: "500px", width: "100%" }}
          >
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
            />
            {errors.name && <p className="error">{errors.name}</p>}

            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <p className="error">{errors.email}</p>}

            <textarea
              name="message"
              placeholder="Your Message"
              rows="5"
              value={formData.message}
              onChange={handleChange}
            />
            {errors.message && <p className="error">{errors.message}</p>}

            <button type="submit">Send Message</button>
          </form>
        </div>
      </section>
    </main>
  );
};

export default Contact;
