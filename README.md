# 🎓 CampusConnect  
### Role-Based University Event Management & Registration Platform  

<img width="1919" height="1087" alt="image" src="https://github.com/user-attachments/assets/9b691be0-fcb0-492b-a379-93335e9777ab" />


![React](https://img.shields.io/badge/Frontend-React-blue?logo=react)
![Node.js](https://img.shields.io/badge/Backend-Node.js-green?logo=node.js)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-brightgreen?logo=mongodb)
![Vercel](https://img.shields.io/badge/Frontend-Vercel-black?logo=vercel)
![Render](https://img.shields.io/badge/Backend-Render-46E3B7?logo=render)
![License](https://img.shields.io/badge/License-MIT-yellow)

---

## 🚀 Overview

**CampusConnect** is a full-stack, role-based university event management and registration platform designed to streamline event discovery, organization, and moderation within academic institutions.

Built as both a **6th Semester CSE Major Project** and a **portfolio-grade production application**, the platform demonstrates secure authentication, cloud integration, role-based access control, and scalable architecture.

---

# 🎯 Core Features

## 👨‍🎓 Student Features

- 🔍 Browse approved university events
- 📝 Register / RSVP for events
- 🔐 Secure Email/Password Login
- 🌐 Google OAuth 2.0 Login
- 🔑 Forgot / Reset Password Flow
- 📚 Academic Profile Sync:
  - Batch
  - Branch
  - Roll Number
- 📊 Personalized dashboard with registered events
- 🖼 View event posters hosted on Cloudinary

---

## 🏢 Organizer Features

> 🛡 Organizer accounts require **Admin Approval** before accessing the dashboard.

- 🗂 Create, edit, and manage events
- 📌 Upload event posters
- 👥 View attendee lists
- 📈 Track real-time registration counts
- 📬 Automatic email confirmation to registered students

---

## 🛠 Admin Features

- 🔎 Review pending organizer accounts
- ✅ Approve or Reject organizer registrations
- 🛡 Spam prevention via moderation workflow
- 🔐 Role-based secure dashboard

---

# 🧰 Tech Stack & Architecture

## 🖥 Frontend

- ⚛️ React.js
- 🔀 React Router
- 🎨 Tailwind CSS
- 🔐 Protected Routes (Role-Based Access Control)
- 🌍 Hosted on **Vercel**

---

## 🖧 Backend

- 🟢 Node.js
- 🚀 Express.js
- 🔑 JWT Authentication
- 🌐 Google OAuth 2.0
- 📧 Nodemailer (Email Service)
- ☁️ Hosted on **Render.com**

---

## 🗄 Database

- 🍃 MongoDB Atlas (Cloud Hosted)

---

## 🖼 Media Storage

- ☁️ Cloudinary (Event Posters)

---

# 🏗 System Architecture & Security Flow

## 🔐 Authentication & Authorization Flow

```
User Login (Email / Google OAuth)
        ↓
JWT Token Issued
        ↓
Token Stored in Local Storage
        ↓
Attached to API Requests (Authorization Header)
        ↓
Backend Middleware Verifies Token
        ↓
Role-Based Access Control (Student / Organizer / Admin)
```

### 🔒 Security Features

- Stateless JWT authentication
- Protected React Routes
- Backend role-based middleware
- Admin approval system for organizers
- Environment variable protection
- Cloud-based media isolation (Cloudinary)

---

# 📦 Local Setup & Installation

## 1️⃣ Clone Repository

```bash
git clone https://github.com/your-username/campusconnect.git
cd campusconnect
```

---

## 2️⃣ Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside `/backend`:

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_super_secret_key

EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

CLIENT_URL=http://localhost:3000
```

Run backend:

```bash
npm start
```

---

## 3️⃣ Frontend Setup

```bash
cd ../frontend
npm install
```

Create a `.env` file inside `/frontend`:

For Create React App:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

For Vite:

```env
VITE_API_URL=http://localhost:5000/api
```

Run frontend:

```bash
npm start
```

---

## 🟢 Run Both Concurrently (Optional)

Install concurrently:

```bash
npm install concurrently
```

Add to root `package.json`:

```json
"scripts": {
  "dev": "concurrently \"cd backend && npm start\" \"cd frontend && npm start\""
}
```

Run:

```bash
npm run dev
```

---

# 📡 API Endpoints Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| POST | `/api/events` | Create event (Organizer only) |
| POST | `/api/events/:id/register` | Register for event (Student only) |
| PUT | `/api/auth/admin/organizers/:id/approve` | Approve organizer account (Admin only) |

---

# 🌐 Deployment

- Frontend → **Vercel**
- Backend → **Render**
- Database → **MongoDB Atlas**
- Media Storage → **Cloudinary**

---

# 🔮 Future Enhancements

- 🎟 QR Code-based Event Entry System
- ⏰ Automated Email Reminders
- 📊 Advanced Analytics Dashboard
- 📱 Progressive Web App (PWA)
- 🔔 Push Notifications
- 📥 Export Registrations (CSV/PDF)
- 🧠 AI-powered event recommendations

---

# 📜 License

This project is licensed under the **MIT License**.

---

# 👨‍💻 Author

**Subraj Kumar**  
B.Tech – Computer Science & Engineering  
6th Semester Major Project  

📧 kumarsubraj97@gmail.com  
🌐 LinkedIn: https://www.linkedin.com/in/subraj-kumar/ 
💻 GitHub: https://github.com/Subraj-Kumar  

---

# ⭐ Project Highlights

CampusConnect demonstrates:

- Full-Stack MERN Architecture
- Secure JWT & OAuth Authentication
- Role-Based Access Control
- Cloud Deployment & Media Storage
- Admin Moderation System
- Production-ready engineering practices

---
