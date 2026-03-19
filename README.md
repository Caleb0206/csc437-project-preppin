# Preppin'

This project serves for the CSC437 final project. It is a simple weekly meal planner, keeping track of how many meals
you have prepped throughout the week.
It allows users to:

- Create and manage personal recipes
- Plan meals across a weekly calendar
- Automatically distribute meal prep servings across days
- Upload images for recipes
- Maintain separate data per user via authentication

---

## 🚀 Features

- 📅 Weekly meal calendar (Breakfast / Lunch / Dinner)
- 🍱 Meal prep distribution logic (servings → future meals)
- 📖 Recipe management (create, edit, delete)
- 🖼️ Image upload for recipes
- 🔐 User authentication (JWT-based)
- 🌙 Dark mode toggle
- 📱 Responsive layout (mobile-first)

---

## 🧱 Tech Stack

### Frontend

- React (Vite)
- React Router
- CSS (mobile-first, design tokens)

### Backend

- Node.js + Express
- MongoDB (Atlas)
- JWT authentication
- Multer (image uploads)

---

## 🖥️ Running the Project

### 1. Start the backend

In `/backend`:

npm install  
npm run dev

Make sure you have a `.env` file configured (see below).

---

### 2. Start the frontend

In `/frontend`:

npm install  
npm run dev

Then open:

http://localhost:5173

---

## 🔐 Environment Variables (Backend)

Create a `.env` file inside `/backend`:

---

## 📁 Project Structure

frontend/ React app  
backend/ Express API + MongoDB  
shared/ Shared constants (routes, etc.)

---

## 🔄 API Overview

### Auth

- POST /api/users → Register
- POST /api/auth/tokens → Login

### Recipes (protected)

- GET /api/recipes
- POST /api/recipes
- PUT /api/recipes/:id
- DELETE /api/recipes/:id

### Meal Plans (protected)

- GET /api/meal-plans
- POST /api/meal-plans
- DELETE /api/meal-plans

---

## 🧠 Design Notes

- Each user has isolated data (recipes + meal plans)
- Meal plans are stored as individual entries per day/meal
- Calendar is reconstructed from backend data
- Images are stored on disk and served via `/uploads`

---

## ⚠️ Notes

- Uploaded images are stored locally and not committed to Git
- `.env` is excluded from version control for security
- Need to create `/uploads` folder inside `/backend`
- Authentication tokens are stored in localStorage

---

## ✨ Future Improvements

- Recipe editing with image replacement preview
- Drag-and-drop meal planning
- Nutrition tracking
- Sharing recipes between users

---

## 👨‍💻 Author

Caleb Huang  
CSC437 – Final Project