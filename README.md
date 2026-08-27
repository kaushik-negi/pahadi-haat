# 🏔️ Pahadi Haat — Full Stack Marketplace

> A comprehensive full-stack e-commerce marketplace platform connecting local sellers, customers, and delivery drivers in hill regions.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Available%20Soon-brightgreen)](#-live-demo)
[![Spring Boot](https://img.shields.io/badge/Backend-Spring%20Boot%203-green)](pahadi-haat-backend)
[![React](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-blue)](pahadi-haat-react)
[![JWT Auth](https://img.shields.io/badge/Auth-Stateless%20JWT-orange)](pahadi-haat-backend)

---

## 🌐 Live Demo

🔗 **Live Application Link:** [https://your-live-deployment-link.com](https://your-live-deployment-link.com) *(Update with your deployed URL)*

---

## 📌 Project Overview

**Pahadi Haat** is built with a multi-role architecture tailored for local marketplaces:

- 🛒 **Customer Role:** Browse categories, shops, and products; manage persistent cart; place orders with server-side validation; track order status and real-time delivery timelines.
- 🏪 **Seller Role:** Manage shop profile, add/edit/delete products, and update live inventory & stock levels.
- 🚚 **Driver Role:** View unassigned/open delivery orders, claim deliveries, and update shipment progression (`PLACED` ➔ `SHIPPED` ➔ `DELIVERED`).
- 🔐 **Security:** Stateless JWT authentication, role-gated routes on both client and server, and BCrypt password encryption.

---

## 🛠️ Tech Stack

| Layer | Technology | Description |
|---|---|---|
| **Frontend** | React 18, Vite | Single Page Application with dynamic routing |
| **Styling** | Vanilla CSS Modules | Clean, responsive mobile-first design |
| **State & Auth** | Context API & JWT | `AuthContext` + `CartContext` with localStorage persistence |
| **Backend** | Java 17+, Spring Boot 3 | Modular REST API with Spring Data JPA |
| **Security** | Spring Security & JWT | Stateless Bearer token verification and RBAC |
| **Database** | H2 (Dev) / PostgreSQL (Prod) | Auto-seeding catalog & relational order models |
| **Containerization** | Docker | Production-ready multi-stage Docker build |

---

## 📂 Repository Structure

```
pahadi-haat-fullstack/
├── pahadi-haat-backend/         # Spring Boot 3 REST API
│   ├── src/main/java/           # Application source (Controllers, Services, Models, Repositories)
│   ├── src/main/resources/      # application.properties & application-prod.properties
│   ├── Dockerfile               # Backend Docker build configuration
│   └── pom.xml                  # Maven dependencies
│
├── pahadi-haat-react/           # React + Vite Frontend
│   ├── src/
│   │   ├── api/                 # Modular API client wrappers
│   │   ├── components/          # Reusable UI components & Role guards
│   │   ├── context/             # AuthContext and CartContext
│   │   ├── pages/               # Customer, Seller, and Driver pages
│   │   └── styles/              # Global and page-specific styles
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

## 💻 Local Machine Setup & Running Guide

### 📋 Prerequisites
Make sure the following tools are installed on your machine:
- **Node.js**: v18.0.0 or higher ([Download Node.js](https://nodejs.org/))
- **Java JDK**: Version 17 or higher ([Download OpenJDK / Oracle JDK](https://adoptium.net/))
- **Maven**: Version 3.8+ (or use your IDE's bundled Maven)
- **Git**: ([Download Git](https://git-scm.com/))

---

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/kaushik-negi/pahadi-haat.git
cd pahadi-haat
```

---

### 2️⃣ Run the Backend (Spring Boot)

1. Navigate to the backend folder:
   ```bash
   cd pahadi-haat-backend
   ```
2. Build and start the Spring Boot server:
   ```bash
   mvn spring-boot:run
   ```
3. The backend API will start at: **`http://localhost:8080`**
   - **Database:** Runs on a persistent local H2 file database (`./data/pahadihaat.mv.db`) seeded with initial products and shops.
   - **H2 Console:** Accessible at `http://localhost:8080/h2-console`
     - JDBC URL: `jdbc:h2:file:./data/pahadihaat`
     - User: `sa`
     - Password: *(leave blank)*

---

### 3️⃣ Run the Frontend (React + Vite)

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd pahadi-haat-react
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. *(Optional)* Configure environment:
   The frontend automatically connects to `http://localhost:8080/api`. To customize, create a `.env` file from the example:
   ```bash
   cp .env.example .env
   ```
4. Start the Vite development server:
   ```bash
   npm run dev
   ```
5. Open your browser and navigate to: **`http://localhost:5173`**

---

## 🚀 Deployment Guide

### A. Deploying the Frontend (Vercel / Netlify / Render)

1. **Build locally or link Git repo to hosting platform:**
   - **Framework Preset:** Vite
   - **Root Directory:** `pahadi-haat-react`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
2. **Environment Variables:**
   Set the following in your host settings:
   ```env
   VITE_API_BASE_URL=https://your-backend-api.com/api
   ```

---

### B. Deploying the Backend (Render / Railway / AWS / Docker)

#### Option 1: Using Docker
The backend includes a production Dockerfile.
```bash
cd pahadi-haat-backend
docker build -t pahadi-haat-backend .
docker run -p 8080:8080 \
  -e SPRING_PROFILES_ACTIVE=prod \
  -e DATABASE_URL=jdbc:postgresql://<db-host>:5432/<db-name> \
  -e DATABASE_USERNAME=<db-user> \
  -e DATABASE_PASSWORD=<db-password> \
  -e APP_JWT_SECRET=<strong-random-secret-key-32-chars> \
  -e APP_CORS_ALLOWED_ORIGINS=https://your-frontend-domain.com \
  pahadi-haat-backend
```

#### Option 2: Cloud Managed Service (e.g., Render / Railway)
1. Point your cloud service to `pahadi-haat-backend`.
2. Set Environment Variables:
   - `SPRING_PROFILES_ACTIVE`: `prod`
   - `DATABASE_URL`: `jdbc:postgresql://<host>:5432/<database>`
   - `DATABASE_USERNAME`: `<db_username>`
   - `DATABASE_PASSWORD`: `<db_password>`
   - `APP_JWT_SECRET`: `<minimum-32-character-secret>`
   - `APP_CORS_ALLOWED_ORIGINS`: `https://your-frontend-deployment.vercel.app`

---

## 🔑 Key API Endpoints Reference

### Public Routes
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/signup` | Register customer account |
| `POST` | `/api/auth/seller/register` | Register seller & create shop |
| `POST` | `/api/auth/driver/register` | Register delivery driver |
| `POST` | `/api/auth/login` | Login for any role (returns JWT) |
| `GET` | `/api/categories` | List all item categories |
| `GET` | `/api/products` | Browse catalog (filter by `category`, `shopId`) |
| `GET` | `/api/shops` | View local seller shops |

### Authenticated & Role-Gated Routes
| Role | Method | Endpoint | Description |
|---|---|---|---|
| **Any** | `POST` | `/api/orders` | Place order (recalculates server pricing) |
| **Any** | `GET` | `/api/orders/{orderId}/tracking` | Track real-time order status |
| **Seller** | `GET` | `/api/seller/shop` | View own shop details |
| **Seller** | `GET` | `/api/seller/products` | View seller's inventory |
| **Seller** | `POST` | `/api/seller/products` | Add a new product |
| **Seller** | `PUT` | `/api/seller/products/{id}/stock`| Update inventory stock count |
| **Driver** | `GET` | `/api/driver/deliveries` | View assigned & open delivery jobs |
| **Driver** | `PUT` | `/api/driver/deliveries/{id}/accept` | Claim an order for delivery |
| **Driver** | `PUT` | `/api/driver/deliveries/{id}/status` | Update status (`SHIPPED` / `DELIVERED`) |

---

## 📄 License
This project is open source and available under the [MIT License](LICENSE).

