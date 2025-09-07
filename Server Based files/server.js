const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { testConnection, sequelize } = require('./config/database');

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));
app.use(express.json());

// Database connection
testConnection();

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));
// ... other routes

// Sync database
sequelize.sync({ force: false, alter: true })
  .then(() => {
    console.log('✅ Database synced successfully');
  })
  .catch(err => {
    console.error('❌ Database sync failed:', err);
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});