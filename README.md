# Info Website

Full-stack news and admin dashboard app.

## Features

- News feed & details
- Admin dashboard (approve/decline/delete news)
- Super admin login (JWT)
- Contact form (EmailJS)
- Multi-language (EN/FR)
- Responsive/mobile-friendly

## Tech Stack

- React (frontend, Create React App)
- Node.js/Express, SQLite (backend)
- EmailJS (contact)
- Vercel (frontend deploy)
- Render (backend deploy)

## Setup

```bash
# Clone repo
git clone https://github.com/yourusername/info-site.git
cd info-site

# Install frontend deps
npm install

# Install backend deps
cd backend
npm install

Environment Variables
Frontend (.env):
REACT_APP_API_URL=https://your-backend.onrender.com
REACT_APP_EMAILJS_SERVICE_ID=your_service_id
REACT_APP_EMAILJS_TEMPLATE_ID=your_template_id
REACT_APP_EMAILJS_PUBLIC_KEY=your_public_key
REACT_APP_EMAILJS_TO_EMAIL=your_email

Backend (.env):
JWT_SECRET=your_jwt_secret

Run Locally
# Backend
cd backend
node server.js

# Frontend
npm start

Deploy
Frontend: Vercel (add REACT_APP_ vars in dashboard)
Backend: Render (add JWT_SECRET in dashboard)
Custom Domain
Add domain in Vercel project settings
Update DNS at registrar as Vercel instructs
Structure:
backend/
  models/
  routes/
  server.js
public/
src/
  pages/
  i18n.js
  App.js
.env
