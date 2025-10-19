// server.js
require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');


const app = express();
app.use(express.json());
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));

// connect mongo
if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser:true, useUnifiedTopology:true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB error', err));
}


if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'frontend', 'build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
