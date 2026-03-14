require('dotenv').config();
const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const cors = require('cors');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');

const app = express();
const server = http.createServer(app);
// Allowed frontend URLs
const allowedOrigins = [
  "http://localhost:3000",
  "https://rescue-net-am.vercel.app"
];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    
    const isAllowed = allowedOrigins.includes(origin) || 
                     origin.endsWith(".vercel.app"); // Allows all Vercel preview branches

    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
};

// Initialize Socket.io
const io = socketio(server, {
  cors: corsOptions
});

// Make io accessible to our routes/controllers
app.set('socketio', io);

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Database Connection
connectDB();

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/incidents', require('./routes/incidentRoutes'));

// Socket Logic
require('./sockets/socketMain')(io);

// Global Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));