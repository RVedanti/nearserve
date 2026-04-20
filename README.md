# 📍 NearServe — Hyperlocal Services Marketplace

> A full-stack web application that connects users with verified local service providers in their city, with real-time booking management and role-based dashboards.

---

## 🌐 Live Demo
> Coming soon after deployment

---

## 📸 Screenshots

> Add screenshots of your app here after deployment

---

## 🚀 Features

### 👤 User
- Register and login with JWT authentication
- Select city (Mumbai / Nanded) for hyperlocal filtering
- Browse and search verified vendors by category
- Book services with date, time and address
- View booking history with status tracking
- Cancel pending bookings
- Leave star ratings and reviews after service completion

### 🏪 Vendor
- Register as a vendor and create a business profile
- Add, edit and remove services with pricing
- View and manage incoming bookings
- Accept, reject or mark bookings as completed
- Track total revenue and booking statistics
- View customer reviews

### 👨‍💼 Admin
- Analytics dashboard with platform-wide stats
- Approve or block vendor profiles
- Manage service categories
- View all users and bookings

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 18 | UI library |
| Vite | Build tool |
| React Router v6 | Client-side routing |
| Tailwind CSS | Styling |
| Axios | HTTP client |
| Lucide React | Icons |
| Context API | Global state management |

### Backend
| Technology | Purpose |
|---|---|
| Node.js | Runtime environment |
| Express.js | Web framework |
| MongoDB | NoSQL database |
| Mongoose | ODM for MongoDB |
| JWT | Authentication |
| bcryptjs | Password hashing |

---

## 📁 Project Structure

```
nearserve/
├── backend/
│   ├── config/          # Database connection
│   ├── controllers/     # Business logic
│   ├── middleware/      # Auth & error middleware
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API route definitions
│   ├── utils/           # Helper functions
│   ├── seed.js          # Database seeder
│   └── server.js        # Entry point
│
├── src/
│   ├── components/      # Reusable UI components
│   │   ├── common/      # Navbar, Footer, etc.
│   │   └── user/        # User-specific components
│   ├── context/         # AuthContext, CityContext
│   ├── pages/
│   │   ├── admin/       # Admin dashboard pages
│   │   ├── auth/        # Login & Register
│   │   ├── public/      # Landing, Vendor listing
│   │   ├── user/        # User dashboard
│   │   └── vendor/      # Vendor dashboard
│   ├── services/        # API call functions
│   └── App.jsx          # Root component
```

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | /api/auth/register | Public | Register user/vendor |
| POST | /api/auth/login | Public | Login & get JWT |
| GET | /api/auth/me | Private | Get current user |

### Vendors
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | /api/vendors | Public | List verified vendors |
| GET | /api/vendors/:id | Public | Get vendor details |
| POST | /api/vendors/profile | Vendor | Create profile |
| PUT | /api/vendors/profile | Vendor | Update profile |
| GET | /api/vendors/revenue | Vendor | Get revenue stats |

### Bookings
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | /api/bookings | User | Create booking |
| GET | /api/bookings/my | User | Get my bookings |
| PATCH | /api/bookings/:id/cancel | User | Cancel booking |
| PATCH | /api/vendors/bookings/:id/accept | Vendor | Accept booking |
| PATCH | /api/vendors/bookings/:id/complete | Vendor | Complete booking |

### Admin
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | /api/admin/stats | Admin | Platform analytics |
| GET | /api/admin/vendors | Admin | List all vendors |
| PATCH | /api/admin/vendors/:id/approve | Admin | Approve vendor |
| PATCH | /api/admin/vendors/:id/block | Admin | Block vendor |

---

## ⚙️ Getting Started

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- npm or yarn

### 1. Clone the repository
```bash
git clone https://github.com/RVedanti/nearserve.git
cd nearserve
```

### 2. Setup Backend
```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` folder:
```env
MONGO_URI=mongodb://localhost:27017/nearserve
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

### 3. Seed the Database
```bash
node seed.js
```
This creates 7 categories, 16 vendors (8 Mumbai + 8 Nanded) with services.

### 4. Start the Backend
```bash
npm run dev
```

### 5. Setup Frontend
```bash
cd ..
npm install
```

Create a `.env` file in the root folder:
```env
VITE_API_URL=http://localhost:5000/api
```

### 6. Start the Frontend
```bash
npm run dev
```

Visit `http://localhost:5173`

---

## 👥 Test Accounts

### Admin
| Email | Password |
|---|---|
| admin@nearserve.com | Admin@123 |

### Seeded Vendors (Nanded)
| Email | Password | Business |
|---|---|---|
| lata@nearserve.com | Vendor@123 | Lata Tiffin Service |
| kavita@nearserve.com | Vendor@123 | Kavita Home Care |
| ganesh@nearserve.com | Vendor@123 | Kulkarni Plumbers |

### Seeded Vendors (Mumbai)
| Email | Password | Business |
|---|---|---|
| rahul@nearserve.com | Vendor@123 | Rahul Clean Pro |
| meena@nearserve.com | Vendor@123 | Meena Home Kitchen |
| ramesh@nearserve.com | Vendor@123 | Nair Cool Tech |

---

## 🗄️ Database Schema

- **Users** — name, email, password (hashed), role, phone, address
- **Vendors** — userId, businessName, categoryId, serviceAreas, isVerified, rating
- **Categories** — name, icon
- **Services** — vendorId, serviceName, price, description
- **Bookings** — userId, vendorId, serviceId, date, timeSlot, address, status
- **Reviews** — userId, vendorId, rating, comment

---

## 🏙️ Supported Cities
- Mumbai
- Nanded

> More cities can be added by updating `SUPPORTED_CITIES` in `src/context/CityContext.jsx`

---

## 👩‍💻 Built By

**Vedanti Rahatikar**

---

## 📄 License

This project is for educational purposes.
