require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const dataRoutes = require('./routes/dataRoutes');
const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(bodyParser.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB', err);
  });

// Routes
app.use('/api', authRoutes);
app.use('/api', dataRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
