# AI-Powered Lost & Found System 🕵️‍♂️✨

A full-stack MERN application designed to reunite people with their lost belongings using an automated AI-matching algorithm. 

## 🚀 Features

- **Automated AI Matching**: A heuristic algorithm runs in the background upon item creation, comparing lost and found items based on category, location, date, brand, and color.
- **Real-Time Notifications**: Users receive instant dashboard alerts when the AI identifies a high-probability match (>70% similarity).
- **Secure Claims System**: Users can securely claim an item by providing proof of ownership to the finder.
- **Role-Based Access Control**: Secure JWT authentication for standard users and a dedicated Admin Panel for content moderation and user management.
- **Cloud File Storage**: Direct integration with Cloudinary for fast, secure, and optimized image uploads.
- **Modern Responsive UI**: A stunning frontend built with React and Tailwind CSS.

## 🛠️ Technology Stack

**Frontend:**
- React.js (Vite)
- Tailwind CSS
- React Router DOM
- Axios (with JWT Interceptors)
- Context API (Global Auth State)

**Backend:**
- Node.js & Express.js
- MongoDB & Mongoose
- JSON Web Tokens (JWT) & bcryptjs
- Multer & Cloudinary (Image Processing)

## 📦 Local Installation & Setup

### 1. Clone & Install Dependencies
Navigate into both directories and install the necessary npm packages:
```bash
cd backend
npm install

cd ../frontend
npm install
```

### 2. Environment Variables

**Backend (`backend/.env`):**
```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_super_secret_jwt_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

**Frontend (`frontend/.env`):**
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### 3. Run the Application
You will need two terminal windows open:

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```

Visit `http://localhost:5173` in your browser.

## 🚢 Deployment

- **Backend (Render):** Deploy as a Web Service. Ensure `MONGO_URI` allows `0.0.0.0/0` in Atlas.
- **Frontend (Vercel):** Deploy as a Vite project. Add `vercel.json` for React Router support and set `VITE_API_BASE_URL` to your live Render API URL.

---
*Developed as a modern, scalable Full-Stack architecture.*
