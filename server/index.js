require('dotenv').config();
const express = require('express');
const sequelize = require('./config/db');
const PORT = process.env.PORT || 5000;

const app = express();
app.use(express.json());

sequelize.authenticate()
  .then(() => console.log('✅ Connected to PostgreSQL via Sequelize'))
  .catch((err) => console.error('❌ Database connection failed:', err));

// Route
app.get('/', (req, res) => res.send('Maniffirm Backend is Running'));

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
