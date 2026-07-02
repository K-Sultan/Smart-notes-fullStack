# Smart Notes Full Stack Application

A modern, full-stack note-taking application built with the MERN stack (MongoDB, Express, React, Node.js). 

This application provides a seamless experience for users to register, login, create, edit, organize, and delete their notes with a premium, responsive user interface.

## 🚀 Features

- **Authentication**: Secure JWT-based user registration and login.
- **Protected Routes**: Secure routing to ensure only authenticated users can access their dashboard and notes.
- **Full CRUD Operations**: Create, read, update, and delete notes.
- **State Management**: Redux Toolkit for global auth state and TanStack React Query for efficient server state and caching.
- **Form Validation**: Robust validation using React Hook Form and Zod.
- **Modern UI/UX**: Premium, responsive design built with Vanilla CSS, featuring a beautiful interface and micro-animations.
- **API Collection**: Includes a comprehensive Postman Collection for easy API testing and exploration.

## 🛠️ Tech Stack

**Frontend:**
- React (Vite)
- React Router DOM
- Redux Toolkit
- TanStack React Query
- React Hook Form & Zod
- Axios
- Lucide React (Icons)

**Backend:**
- Node.js & Express.js
- MongoDB & Mongoose
- JSON Web Tokens (JWT)
- bcryptjs

## ⚙️ Local Setup Instructions

Follow these steps to get the project up and running on your local machine.

### Prerequisites
- [Node.js](https://nodejs.org/) installed
- [MongoDB](https://www.mongodb.com/try/download/community) installed and running locally (or a MongoDB Atlas URI)

### 1. Clone the Repository
```bash
git clone <your-repository-url>
cd smart-notes
```

### 2. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on the example:
   ```bash
   cp .env.example .env
   ```
4. Open the `.env` file and configure your environment variables:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/smart-notes
   JWT_SECRET=your_super_secret_key_here
   ```
5. Start the backend development server:
   ```bash
   npm run dev
   ```

### 3. Frontend Setup
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the frontend development server:
   ```bash
   npm run dev
   ```
4. Open your browser and visit: `http://localhost:5173`

## 🧪 Testing the API

A Postman collection is included in the root directory (`Smart_Notes.postman_collection.json`). 
1. Open Postman.
2. Click **Import** and select the `Smart_Notes.postman_collection.json` file.
3. The collection is pre-configured with a script that automatically saves your JWT token upon login, making it extremely easy to test all protected routes without copying and pasting tokens!

## 📄 License
This project is open-source and available under the MIT License.
