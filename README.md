# BookMyMandap User Frontend

The BookMyMandap User Frontend, built with the MERN stack (MongoDB, ExpressJS, ReactJS, NodeJS), powers the administrative module of the platform. It enables mandap providers to manage user accounts, monitor orders, verify providers, and analyze platform performance.

## File Structure

The User Frontend repository follows a modular structure for scalability and maintainability:

```
src/                  Source files for the React application
  app/                Main application components and configuration
  components/         Reusable React components
  features/           Feature-specific modules
  lib/                Utility libraries and shared code
  pages/              Page-level components
  services/           Service layer for API calls and utilities
  store/              State management using Redux or similar
  utils/              Utility functions and helpers
App.tsx               Main application component
index.css             Global CSS styles
main.tsx              Entry point for the React application
razorpay-config.ts      Configuration for razorpay payment integration
vite-env.d.ts         TypeScript declaration file for Vite
.gitignore            Files and directories to be ignored by Git
Dockerfile            Configuration for Docker containerization
eslintrc.config.js    ESLint configuration file
```

## Tech Stack

**Frontend:** ReactJS, TypeScript
**Build Tool:** Vite
**Styling:** CSS
**Payment:** razorpay
**Containerization:** Docker
**Backend Integration:** ExpressJS, MongoDB

---

## 🛠️ Installation Guide

To run the BookMyMandap User Frontend on your local system, follow these steps:

### Step-1: Clone the Repository

Clone the project to your local system:

```bash
git clone https://github.com/D1-Cdac-project/USER_CLIENT.git
cd USER_CLIENT
```

### Step-2: Install Dependencies

Install the required dependencies for the User Frontend:

```bash
cd USER_CLIENT
npm install
```

### Step-3: Start the User Frontend

Start the development server:

```bash
cd USER_CLIENT
npm run dev
```

Once the server is running, it will be accessible at:

```
http://localhost:5173
```

---
