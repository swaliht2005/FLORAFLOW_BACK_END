

const express = require('express');
const cors = require('cors');
const connectMongoDB = require('./config/db');
const { apiRouter } = require('./routes/server');
const path = require('path');

const PORT = 5000;
const app = express();

app.use(cors());
app.use(express.json());
app.use('/api', apiRouter);

// Serve uploaded files
app.use('/api/seller/uploads', express.static(path.join(__dirname, 'Uploads')));

connectMongoDB();

app.listen(PORT, () => {
  console.log(`FloraFlow server running at http://localhost:${PORT}`);
});