# 🐾 RescueNet: Real-Time Emergency Response System

**RescueNet** is a decentralized reporting platform designed to eliminate the delay between animal accidents and medical assistance. By leveraging real-time geolocation and WebSockets, the system ensures help arrives as fast as possible.

🚀 **[Live Demo](https://rescue-net-am.vercel.app/)** | 🛠️ **[Backend API](https://rescuenet-k0jc.onrender.com/)**

---

## 📌 The Problem
The biggest issue in animal welfare is the critical time gap between an accident and professional medical help. Traditional reporting methods are slow, non-visual, and often fail to provide precise location data, leading to tragic delays.

## ✨ Key Features

* **📍 Geotagged Reporting**: Witnesses can report an injured animal with a single click. The web app automatically captures GPS coordinates via the Geolocation API for 100% accuracy.
* **⚡ Automated Alerts**: Powered by **WebSockets (Socket.io)**, the system immediately notifies the nearest registered NGOs, ambulances, or volunteers based on the incident's radius.
* **📡 Live Tracking**: Inspired by modern delivery apps, reporters can see the real-time status of the rescue, reducing the chances of the animal being left behind.
* **🛡️ Secure Authentication**: Implemented JWT-based authentication to manage roles for volunteers, admins, and reporters.

## 🛠️ Tech Stack

- **Frontend**: React.js, Tailwind CSS, Axios, Socket.io-client
- **Backend**: Node.js, Express.js, Socket.io
- **Database**: MongoDB Atlas (Mongoose ODM)
- **Deployment**: Vercel (Frontend), Render (Backend)

---

## 🏗️ System Architecture



1.  **Client**: React frontend captures incident data and sends it to the server.
2.  **Server**: Node/Express backend processes the data and emits a Socket event.
3.  **Real-time Layer**: Socket.io broadcasts the incident to all connected volunteers in the area.
4.  **Database**: MongoDB stores historical incident data and user profiles.

---

## 🔧 Installation & Setup

1. **Clone the Repo**
   ```bash
  git clone [https://github.com/tanusree0/RescueNet.git](https://github.com/tanusree0/RescueNet.git)
Configure Backend

Navigate to /backend.

Create a .env file and add:

Code snippet
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
Run npm install and npm start.
CLOUDINARY_NAME=your_name
CLOUDINARY_KEY=your_key
CLOUDINARY_SECRET=your_secret
Configure Frontend

Navigate to /frontend.

Run npm install.

Start the development server with npm start.

🚧 Challenges Overcome
CORS Management: Configured dynamic origin handling to allow secure communication between Vercel subdomains and Render.

Deployment Pipeline: Optimized the build process using CI=false and npx to bypass environment-specific permission errors on Vercel.

Real-time Sync: Implemented Socket.io logic to ensure that incident alerts are pushed instantly without requiring a page refresh.

🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

Developed with ❤️ for Animal Welfare by Tanusree Roy
