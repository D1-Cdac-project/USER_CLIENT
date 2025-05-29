# BOOKMYMANDAP ADMIN BACKEND

This repository contains the backend server for the Admin module of the BookMyMandap application. Built using the **MERN Stack** (MongoDB, ExpressJS, ReactJS, NodeJS), this backend is designed to manage and control administrative operations such as user management, order monitoring, provider verification, and overall platform analytics.

---

## 📁 File Structure

```
ADMIN_BACKEND_SERVER/
│
├── config/              # Application configuration (e.g., DB setup)
├── controllers/         # Logic for handling admin-specific requests
├── middlewares/         # Middleware for admin authentication/authorization
├── models/              # MongoDB schemas and models
├── routes/              # API route definitions
│
├── .env.example         # Sample environment configuration
├── .gitignore           # Git ignored files list
├── README.md            # Project documentation
├── package.json         # Project metadata and dependencies
├── package-lock.json    # Dependency lock file
└── server.js            # Application entry point
```

---

## 🛠️ Tech Stack

- **Server:** Node.js, Express.js  
- **Database:** MongoDB  
- **Authentication:** JWT, Role-based access control  
- **File Storage:** Cloudinary  
- **Real-Time:** Socket.IO  
- **Payment:** Razorpay  

---

## 🚀 Getting Started

Follow these instructions to set up the Admin backend server on your local development machine:

### Step 1: Clone the Repository

```bash
git clone https://github.com/D1-Cdac-project/ADMIN_BACKEND_SERVER.git
cd ADMIN_BACKEND_SERVER
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Configure Environment Variables

Create a `.env` file in the root directory by copying the `.env.example` file and filling in the required values:

```env
PORT=4000
MONGODB_CONNECTION=your_mongodb_connection_string
SECRET_KEY=your_secret_key


KEY_ID=your_razorpay_key_id
KEY_SECRET=your_razorpay_key_secret
```

### Step 4: Start the Server

```bash
npm start
```

Once the server starts, it should be running at:

```
http://localhost:4000
```

---

## 📬 API Structure

This backend supports various administrative APIs such as:

- User and Provider Management
- Mandap Approval
- Booking Oversight
- Payments and Refunds
- Notifications and Reports

---

