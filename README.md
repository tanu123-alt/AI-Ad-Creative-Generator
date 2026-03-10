# 🚀 AI-Powered Ad Creative & Copy Generator (Full Stack SaaS)

AdVantage Gen is a full-stack AI web application that generates high-converting advertisement copy and AI-generated marketing creatives using modern backend architecture and cloud services.

The system combines **LLM-powered text generation**, **Stable Diffusion image generation**, and **MongoDB cloud storage** into a scalable REST-based architecture with a React frontend.

---

## 📌 Project Description

Marketing teams spend hours creating compelling ad copy and creatives.
AdVantage Gen automates this process by:

* Generating persuasive headlines
* Writing optimized captions
* Creating relevant hashtags
* Suggesting Call-to-Action (CTA)
* Producing AI-generated marketing images
* Storing ad history per user

The platform demonstrates real-world integration of AI services within a production-style full-stack architecture.

---

## 🏗️ System Architecture

Frontend (React)
⬇
REST API (Node.js + Express)
⬇
AI Service Layer (Hugging Face Inference API)
⬇
MongoDB Atlas (Cloud Database)

---

## 🛠️ Tech Stack

### 🔹 Frontend

* React.js
* Axios
* CSS / Responsive UI

### 🔹 Backend

* Node.js
* Express.js
* Mongoose
* dotenv
* CORS
* Axios

### 🔹 AI Integration

* Hugging Face Inference API
* Stable Diffusion XL (Image Generation)
* LLM-based Text Generation

### 🔹 Database

* MongoDB Atlas (Cloud NoSQL Database)

### 🔹 Deployment

* Render / Railway (Backend)
* Vercel / Netlify (Frontend)

---

## 📁 Project Structure

```bash
AI-Ad-Creative-Generator/
│
├── server.js                  # Express entry point
├── .env                       # Environment variables (not committed)
├── package.json               # Backend dependencies
├── README.md
│
├── src/
│   ├── controllers/
│   │   └── adcontroller.js    # Ad generation & history endpoints
│   ├── routes/
│   │   ├── adroutes.js        # /api/ad routes
│   │   └── authRoutes.js      # /api/auth routes
│   ├── services/
│   │   ├── aiServices.js      # Groq LLM + image orchestration
│   │   └── imageService.js    # Hugging Face + Sharp image pipeline
│   ├── models/
│   │   ├── Ad.js              # MongoDB Ad schema
│   │   └── User.js            # MongoDB User schema
│   └── config/
│
└── client/                    # React + Vite frontend
    ├── index.html             # Loads Fabric.js (canvas editor)
    └── src/
        ├── pages/
        │   ├── Welcome.jsx    # Landing page
        │   ├── Auth.jsx       # Sign In / Sign Up
        │   ├── Studio.jsx     # Ad generator + live canvas preview
        │   ├── History.jsx    # Saved campaigns
        │   └── Profile.jsx    # User profile & settings
        ├── components/
        │   ├── editor/
        │   │   └── CanvasEditor.jsx  # Fabric.js canvas preview
        │   ├── layout/
        │   │   └── Navbar.jsx
        │   └── ui/
        │       └── FeedbackModal.jsx
        ├── context/
        │   └── AuthContext.jsx
        └── utils/
            └── api.js         # Axios API client
```

---

## ✨ Core Features

### ✅ AI Ad Copy Generation

* Dynamic headline generation
* Platform-specific captions
* Optimized hashtags
* CTA suggestion

### ✅ AI Image Generation

* Stable Diffusion image creation
* Base64 image conversion
* Real-time rendering on frontend

### ✅ Database Integration

* Stores ad metadata
* Tracks generated content
* Maintains history per user

### ✅ REST API Architecture

* Modular MVC structure
* Scalable routing
* Clean separation of concerns

### ✅ User Dashboard (Advanced)

* View previous ads
* Sort by date
* Delete generated ads

---

## ⚙️ Installation & Setup

### 1️⃣ Clone Repository

```bash
git clone https://github.com/your-username/AI-Ad-Creative-Generator.git
cd AI-Ad-Creative-Generator
```

---

### 2️⃣ Install Backend Dependencies

```bash
npm install
```

---

### 3️⃣ Setup Environment Variables

Create `.env` file in the project root:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
HF_TOKEN=your_huggingface_api_token
GROQ_API_KEY=your_groq_api_key
```

---

### 4️⃣ Start Backend Server

```bash
npx nodemon server.js
```

Expected Output:

```
MongoDB Connected
Server running on port 5000
```

---

### 5️⃣ Setup Frontend

```bash
cd client
npm install
npm run dev
```

Frontend runs on:

```
http://localhost:5173
```

---

## 📡 API Endpoints

### Generate Ad

**POST** `/api/ad/generate`

### Request Body (JSON or multipart/form-data with optional logo)

```json
{
  "product": "Smartwatch",
  "audience": "College Students",
  "platform": "Instagram",
  "tone": "professional",
  "aspect": "square"
}
```

### Response

```json
{
  "headline": "Best Smartwatch for College Students!",
  "caption": "Perfect for college students who want smart performance and smart looks.",
  "hashtags": "#Smartwatch #CollegeStudents #Instagram #AdCampaign",
  "image": "ad_1772721092456.png",
  "imageUrl": "/generated/ad_1772721092456.png"
}
```

---

### Get All Ads (History)

**GET** `/api/ad`

---

### Delete Ad

**DELETE** `/api/ad/:id`

---

### Sign Up

**POST** `/api/auth/signup`

```json
{ "name": "Jane Doe", "email": "jane@example.com", "password": "secret123" }
```

### Sign In

**POST** `/api/auth/signin`

```json
{ "email": "jane@example.com", "password": "secret123" }
```

---

## 🔐 Security Considerations

* Environment variables are not committed
* API tokens secured using dotenv
* MongoDB access controlled via IP whitelist
* Fine-grained Hugging Face access token

---

## 🚀 Future Enhancements

* JWT Authentication
* Role-based access control
* AI prompt optimization
* Social media direct posting API
* Payment integration (SaaS Model)
* Admin analytics dashboard

---

## 🎯 Learning Outcomes

This project demonstrates:

* REST API development
* AI service integration
* Cloud database management
* Frontend-backend communication
* MVC architecture
* Production-level environment configuration
* Error handling & debugging
* Deployment workflow

---

## 📌 Why This Project Matters

This project is not a basic CRUD app.
It demonstrates:

* Real AI integration
* API orchestration
* Cloud deployment readiness
* Full-stack production workflow
* Modern SaaS architecture



---
