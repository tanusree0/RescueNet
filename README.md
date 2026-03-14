# 🐾 RescueNet – Real-Time Emergency Response System

**RescueNet** is a real-time decentralized emergency reporting platform designed to reduce the delay between an animal accident and medical assistance.

By leveraging **GPS geolocation, WebSockets, and live tracking**, the system instantly connects reporters with nearby NGOs, volunteers, and rescue teams to ensure faster response.

🚀 **Live Demo:** https://rescue-net-am.vercel.app/
🛠 **Backend API:** https://rescuenet-k0jc.onrender.com/

---

# 📌 Problem Statement

One of the biggest challenges in **animal welfare and rescue operations** is the **critical time gap between an accident and medical assistance**.

Traditional reporting methods:

* Require phone calls or manual reporting
* Often provide **inaccurate location information**
* Do not support **real-time rescue coordination**

These limitations frequently lead to **delayed rescue operations and preventable animal fatalities**.

**RescueNet solves this problem by providing a fast, location-aware, and real-time reporting system.**

---

# ✨ Key Features

## 📍 Geotagged Emergency Reporting

Witnesses can report injured animals with **one click**.

The system automatically captures:

* Latitude
* Longitude
* User location

using the **Browser Geolocation API**, ensuring accurate location data.

---

## ⚡ Instant Emergency Alerts

The platform uses **WebSockets via Socket.io** to instantly notify nearby rescue organizations.

When a report is submitted:

1. The backend processes the incident
2. A **socket event** is emitted
3. Nearby NGOs and volunteers receive **instant alerts**

---

## 📡 Live Rescue Tracking

Similar to modern delivery or ride-sharing applications, reporters can monitor the rescue progress in **real time**.

This includes:

* Rescue team acceptance
* Arrival updates
* Incident resolution status

---

## 🛡️ Secure Authentication

The system implements **JWT-based authentication** for secure user access.

Role-based access includes:

* Reporter
* Volunteer
* NGO/Admin

This ensures secure and structured rescue coordination.

---

# 🛠️ Tech Stack

## Frontend

* React.js
* Tailwind CSS
* Axios
* Socket.io Client

## Backend

* Node.js
* Express.js
* Socket.io

## Database

* MongoDB Atlas
* Mongoose ODM

## Deployment

* Frontend: Vercel
* Backend: Render
* Database: MongoDB Atlas

---

# 🏗️ System Architecture

The system follows a **real-time event-driven architecture**.

### 1. Client Layer

The **React frontend** captures incident details including location, description, and images, then sends the data to the backend.

### 2. Server Layer

The **Node.js + Express backend**:

* processes incoming reports
* stores them in MongoDB
* emits real-time socket events

### 3. Real-Time Communication Layer

Using **Socket.io**, the system broadcasts emergency alerts to all connected volunteers and NGOs within a predefined radius.

### 4. Database Layer

**MongoDB Atlas** stores:

* incident history
* user profiles
* rescue status updates

---

# ⚙️ Installation & Setup

## 1. Clone the Repository

```bash
git clone https://github.com/tanusree0/RescueNet.git
cd RescueNet
```

---

# Backend Setup

Navigate to backend directory:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file and add:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

CLOUDINARY_NAME=your_name
CLOUDINARY_KEY=your_key
CLOUDINARY_SECRET=your_secret
```

Run the backend server:

```bash
npm start
```

---

# Frontend Setup

Navigate to frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm start
```

---

# 🚧 Challenges Overcome

### CORS Configuration

Handled cross-origin requests between **frontend hosted on Vercel** and **backend hosted on Render** by configuring dynamic CORS policies.

### Deployment Pipeline

Resolved deployment issues on Vercel by optimizing the build process using:

```
CI=false
```

### Real-Time Synchronization

Implemented **Socket.io event broadcasting** to ensure that emergency alerts are delivered instantly without requiring a page refresh.

---

# 📈 Future Improvements

Possible future enhancements include:

* AI-based animal injury detection using uploaded images
* Smart volunteer radius detection
* Mobile app integration
* Automated ambulance dispatch system
* Push notification system

---

# 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a feature branch
3. Submit a Pull Request

---

# 👩‍💻 Author

Developed with ❤️ for animal welfare by **Tanusree Roy**
