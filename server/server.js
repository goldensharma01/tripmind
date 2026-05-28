require('dotenv').config({ path: require('path').join(__dirname, '.env') });

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

// Middleware
app.use(
  cors({
    origin: '*',
    credentials: false,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
const authRoutes = require('./routes/authRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const itineraryRoutes = require('./routes/itineraryRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/api/itineraries', itineraryRoutes);

app.get('/', (req, res) => res.json({ message: 'TripMind API running' }));

// Connect MongoDB and start server
const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 10000;

console.log('Connecting to MongoDB...');
console.log('URI starts with:', MONGO_URI ? MONGO_URI.substring(0, 30) : 'NOT FOUND');

mongoose
  .connect(MONGO_URI, {
    serverSelectionTimeoutMS: 30000,
    socketTimeoutMS: 30000,
  })
  .then(() => {
    console.log('✅ MongoDB Connected:', mongoose.connection.host);
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('❌ MongoDB Failed:', err.message);
    process.exit(1);
  });
