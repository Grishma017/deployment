# स्वा – Swad: Taste of Nepal

> **A celebration and digital archive of authentic Nepali culinary heritage, recipes, and food culture with a full-stack Admin Management Console.**

---

## 📌 Table of Contents

- [Overview](#-overview)
  - [What Swad Does](#what-swad-does)
  - [Core Mission \& Value](#core-mission--value)
- [System Architecture](#-system-architecture)
  - [High-Level Architectural Diagram](#high-level-architectural-diagram)
  - [Client-Server Workflow](#client-server-workflow)
  - [Project Directory Structure](#project-directory-structure)
- [Tech Stack](#-tech-stack)
  - [Frontend](#frontend)
  - [Backend](#backend)
  - [Database](#database)
  - [Authentication \& Security](#authentication--security)
- [Admin Panel \& Authentication](#-admin-panel--authentication)
  - [Admin Security Model](#admin-security-model)
  - [Admin Routes \& Views](#admin-routes--views)
  - [Recipe CRUD Capabilities](#recipe-crud-capabilities)
- [Frontend Architecture \& Components](#-frontend-architecture--components)
  - [Lightweight Path-Based Routing](#lightweight-path-based-routing)
  - [Component Hierarchy \& Responsibilities](#component-hierarchy--responsibilities)
  - [Design System \& UI/UX Styling](#design-system--uiux-styling)
- [Backend Architecture \& RESTful API](#-backend-architecture--restful-api)
  - [Server Architecture](#server-architecture)
  - [Database Models (Recipe & Admin)](#database-models-recipe--admin)
  - [API Endpoints Summary](#api-endpoints-summary)
  - [Error Handling Strategy](#error-handling-strategy)
- [What Has Been Implemented](#-what-has-been-implemented)
- [Setup and Running Guide](#-setup-and-running-guide)
  - [Prerequisites](#prerequisites)
  - [1. Backend Setup](#1-backend-setup)
  - [2. Admin Account Initialization](#2-admin-account-initialization)
  - [3. Recipe Database Seeding](#3-recipe-database-seeding)
  - [4. Frontend Setup](#4-frontend-setup)
  - [5. Accessing URLs](#5-accessing-urls)
- [License \& Attribution](#-license--attribution)

---

## 📖 Overview

### What Swad Does
**Swad** (*स्वा* - meaning "taste" or "flavor" in Nepali) is a full-stack MERN web application celebrating the rich culinary traditions of Nepal.

It allows public visitors to:
1. **Discover authentic Nepali recipes** across diverse categories: Main Course, Snacks, Traditional Newari Food, Desserts, and Drinks.
2. **Filter and browse recipes** dynamically by category or with real-time keyword search.
3. **Inspect full recipe details** including ingredient lists, cooking methods/steps, servings, prep time, cook time, and difficulty ratings via a dedicated modal.
4. **Learn about culinary storytelling & cultural heritage** like everyday Dal Bhat Tarkari and communal Newari feasts.

And provides administrators with:
1. **Secure Admin Authentication** via bcryptjs password hashing and JWT sessions.
2. **Full CRUD Management**: Create, Read, Update, and Delete recipes directly affecting MongoDB in real time.
3. **Interactive Dashboard**: Metrics on total recipes, category distribution, and recent additions.

---

## 🏛 System Architecture

The project follows a decoupled **MERN Client-Server Architecture**:

### High-Level Architectural Diagram

```
+--------------------------------------------------------------------------+
|                                 CLIENT                                   |
|                                                                          |
|  [ React 19 Frontend (Vite) ]                                            |
|   ├── Public Portal                                                      |
|   │    ├── Navbar with Brand Logo (स्वा) & Search Input                  |
|   │    ├── Category Filter Pills & Category Deep-Dive Pages              |
|   │    ├── Recipe Showcase Grid (Interactive Modal Details)              |
|   │    ├── Cultural Storytelling & Community Call-to-Action              |
|   │    └── Footer with Admin Portal Link & CC Photo Credits              |
|   └── Admin Management Console                                           |
|        ├── /admin/login     (Secure login, show/hide password)           |
|        ├── /admin/dashboard (Recipe count & category distribution)       |
|        ├── /admin/recipes   (Manage, search, filter, delete confirmation)|
|        ├── /admin/recipes/add  (Dynamic ingredient & step builder)       |
|        └── /admin/recipes/edit/:id (Auto-populated edit form)            |
+-------------------------------------┬------------------------------------+
                                      │
                         REST API (HTTP / JSON / JWT)
                                      │
+-------------------------------------▼------------------------------------+
|                        NODE.JS / EXPRESS BACKEND                         |
|                                                                          |
|  [ Express 5 Server (Port 5000) ]                                        |
|   ├── CORS Middleware (Cross-Origin Resource Sharing with credentials)   |
|   ├── Cookie-Parser & Express JSON Body Parser                           |
|   ├── Authentication Middleware (JWT verification + Cookie/Bearer)       |
|   ├── Auth Routes Controller (/api/auth)                                 |
|   │     ├── POST /api/auth/login                                         |
|   │     ├── POST /api/auth/logout                                        |
|   │     └── GET  /api/auth/me                                            |
|   └── Recipe Routes Controller (/api/recipes)                            |
|         ├── GET    /api/recipes        (Public)                          |
|         ├── GET    /api/recipes/:id    (Public)                          |
|         ├── POST   /api/recipes        (Protected - Admin Only)          |
|         ├── PUT    /api/recipes/:id    (Protected - Admin Only)          |
|         └── DELETE /api/recipes/:id    (Protected - Admin Only)          |
+-------------------------------------┬------------------------------------+
                                      │
                              Mongoose ODM Driver
                                      │
+-------------------------------------▼------------------------------------+
|                                DATABASE                                  |
|                                                                          |
|  [ MongoDB ('swad') ]                                                    |
|   ├── 'admins' Collection   (Hashed passwords, email, timestamps)        |
|   └── 'recipes' Collection  (Name, categories, ingredients, steps, etc.) |
+--------------------------------------------------------------------------+
```

---

### Project Directory Structure

```
swad-taste-of-nepal/
├── README.md                           <-- Comprehensive documentation
├── .gitignore                          <-- Git ignore rules
│
├── backend/                            <-- Node.js + Express 5 Backend
│   ├── .env                            <-- Environment variables (JWT_SECRET, MONGODB_URI)
│   ├── .env.example                    <-- Template for environment setup
│   ├── package.json                    <-- Backend dependencies & scripts
│   ├── server.js                       <-- Express application entrypoint
│   ├── middleware/
│   │   └── authMiddleware.js           <-- JWT authentication middleware
│   ├── models/
│   │   ├── Admin.js                    <-- Admin Mongoose schema with bcrypt hashing
│   │   └── Recipe.js                   <-- Recipe Mongoose schema with validation
│   ├── routes/
│   │   ├── authRoutes.js               <-- Admin login, logout, and me endpoints
│   │   └── recipeRoutes.js             <-- Public read & protected write endpoints
│   └── scripts/
│       ├── seedAdmin.js                <-- Script to create/reset initial admin account
│       └── seedRecipes.js              <-- Script to populate MongoDB with authentic recipes
│
└── frontend/                           <-- React 19 + Vite Frontend SPA
    ├── index.html                      <-- HTML template & Google Fonts
    ├── package.json                    <-- Frontend dependencies & scripts
    ├── vite.config.js                  <-- Vite configuration
    └── src/
        ├── main.jsx                    <-- React entrypoint
        ├── App.jsx                     <-- Master router (Public & Admin flows)
        ├── App.css                     <-- Public portal styling
        ├── index.css                   <-- Swad color palette & design tokens
        ├── admin/
        │   ├── admin.css               <-- Swad-themed admin console styling
        │   ├── AdminLogin.jsx          <-- Admin sign-in screen
        │   ├── AdminLayout.jsx         <-- Responsive sidebar & topbar layout
        │   ├── AdminDashboard.jsx      <-- Metric overview & category breakdown
        │   ├── ManageRecipes.jsx       <-- Recipe table, search, category filter, delete modal
        │   ├── AddRecipe.jsx           <-- Add recipe form with dynamic list rows
        │   └── EditRecipe.jsx          <-- Edit recipe form auto-populated with current data
        ├── components/
        │   ├── Navbar.jsx              <-- Top navigation with SVG logo & search
        │   ├── HeroSection.jsx         <-- Hero banner & vision
        │   ├── CategoryFilter.jsx      <-- Category preview cards
        │   ├── RecipeGrid.jsx          <-- Live recipe grid connected to MongoDB API
        │   ├── RecipeCard.jsx          <-- Dish card with click-to-view detail
        │   ├── RecipeDetailModal.jsx   <-- Full ingredients & instructions modal
        │   ├── CultureSection.jsx      <-- Storytelling on Dal Bhat & Newari feasts
        │   ├── ShareRecipeSection.jsx  <-- Community call-to-action
        │   └── Footer.jsx              <-- Navigation, admin portal link, CC photo credits
        ├── data/
        │   ├── categories.js           <-- Category definitions & image CDN URLs
        │   └── categoryPages.js        <-- Fallback static curated recipes
        ├── pages/
        │   ├── CategoryRecipesPage.jsx <-- Dedicated category recipe view
        │   └── CategoryRecipesPage.css
        └── services/
            └── api.js                  <-- Centralized API client for recipes and auth
```

---

## 🛠 Tech Stack

### Frontend
- **React 19 (`^19.3.1`)**: Modern functional components, hooks (`useState`, `useEffect`).
- **Vite (`^8.3.6`)**: Ultra-fast build tool and local development server.
- **Modern CSS3**: Built using Swad's warm design system tokens, CSS Grid, and responsive flexbox.
- **Typography & Vector Graphics**: Google Fonts (`Bodoni Moda`, `Playfair Display`, `Noto Serif Devanagari`, `Inter`) and custom SVGs.

### Backend
- **Node.js**: Modern JavaScript runtime.
- **Express 5 (`^5.3.0`)**: Fast, minimalist web framework.
- **Mongoose (`^9.12.2`)**: ODM for MongoDB with strict schema validation.
- **bcryptjs (`^3.0.3`)**: One-way salt and hash for passwords.
- **jsonwebtoken (`^9.0.3`)**: Token generation and verification.
- **cookie-parser (`^1.4.7`)**: Secure HTTP-only cookie extraction.
- **CORS (`^2.8.6`)**: Cross-Origin Resource Sharing with credential support.
- **dotenv (`^18.0.10`)**: Environment variable configuration.

### Database
- **MongoDB**: Document-based NoSQL database running locally or via MongoDB Atlas.

---

## 🔐 Admin Panel & Authentication

### Admin Security Model
1. **Password Hashing:** Passwords are never stored as plain text. The `Admin` model uses a Mongoose pre-save hook with `bcryptjs.genSalt(10)` and `bcryptjs.hash()`.
2. **Password Verification:** Passwords are verified via `bcryptjs.compare()`.
3. **Session Management:** On successful authentication at `/api/auth/login`, a signed JWT is returned and stored in an HTTP-only cookie (`adminToken`) as well as in `localStorage` for cross-tab resiliency.
4. **Protected Routes:** The `authenticateAdmin` middleware protects `POST /api/recipes`, `PUT /api/recipes/:id`, and `DELETE /api/recipes/:id`.
5. **No Public Registration:** Admin accounts can only be created via the backend script (`npm run seed:admin`) using environment variables.

### Admin Routes & Views

| Route | View Component | Description |
| :--- | :--- | :--- |
| `/admin/login` | `AdminLogin.jsx` | Secure login form with show/hide password and validation |
| `/admin/dashboard` | `AdminDashboard.jsx` | Quick stats, total recipes, category distribution, recent entries |
| `/admin/recipes` | `ManageRecipes.jsx` | Recipe table, keyword search, category filter, edit/delete actions |
| `/admin/recipes/add` | `AddRecipe.jsx` | Recipe creation form with dynamic ingredient/instruction rows |
| `/admin/recipes/edit/:id`| `EditRecipe.jsx` | Pre-populated recipe editor saving via `PUT /api/recipes/:id` |

---

## ⚙️ Backend Architecture & RESTful API

### API Endpoints Summary

| Method | Endpoint | Access | Purpose |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Public | Admin login, sets token |
| `POST` | `/api/auth/logout` | Public | Admin logout, clears cookie |
| `GET` | `/api/auth/me` | Protected | Returns authenticated admin profile |
| `GET` | `/api/recipes` | Public | List all recipes (supports `?category=` and `?search=`) |
| `GET` | `/api/recipes/:id` | Public | Get single recipe details |
| `POST` | `/api/recipes` | **Protected (Admin)** | Create a new recipe |
| `PUT` | `/api/recipes/:id` | **Protected (Admin)** | Update an existing recipe |
| `DELETE` | `/api/recipes/:id`| **Protected (Admin)** | Permanently delete a recipe |
| `GET` | `/api/health` | Public | Backend health check and database connectivity |

---

## 💻 Setup and Running Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB](https://www.mongodb.com/) (running locally on port 27017 or a MongoDB Atlas URI)

---

### 1. Backend Setup

```bash
cd backend
npm install
```

Configure your `.env` file (one has already been generated):
```env
MONGODB_URI=mongodb://127.0.0.1:27017/swad
JWT_SECRET=swad_jwt_secret_key_authenticity_2026_nepal
PORT=5000
ADMIN_EMAIL=admin@swad.com
ADMIN_PASSWORD=Admin@Swad123
ADMIN_NAME=Chief Admin
NODE_ENV=development
```

---

### 2. Admin Account Initialization

Run the one-time admin seeding script to create or update the admin account:
```bash
npm run seed:admin
```
*Default Credentials:*
- **Email:** `admin@swad.com`
- **Password:** `Admin@Swad123`

---

### 3. Recipe Database Seeding

Populate MongoDB with authentic Nepali recipes (Dal Bhat, Momo, Chatamari, Sel Roti, Masala Chiya, Thukpa, Kwati):
```bash
npm run seed:recipes
```

---

### 4. Running the Servers

**Start Backend Server:**
```bash
cd backend
npm run dev
# Server will listen on http://localhost:5000
```

**Start Frontend Client:**
```bash
cd frontend
npm run dev
# Frontend will run on http://localhost:5173
```

---

### 5. Accessing URLs

- **Public Website:** [http://localhost:5173](http://localhost:5173)
- **Admin Login:** [http://localhost:5173/admin/login](http://localhost:5173/admin/login)
- **Admin Dashboard:** [http://localhost:5173/admin/dashboard](http://localhost:5173/admin/dashboard)
- **Manage Recipes:** [http://localhost:5173/admin/recipes](http://localhost:5173/admin/recipes)
- **Add Recipe:** [http://localhost:5173/admin/recipes/add](http://localhost:5173/admin/recipes/add)
- **Backend Health Check:** [http://localhost:5000/api/health](http://localhost:5000/api/health)
#   M e r n _ S t a c k  
 