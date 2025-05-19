const express = require('express');
const cors = require('cors');
const connectMongoDB = require('./config/db');
const profileRoutes = require('./routes/profileRoutes'); // Correct import
const path = require('path');

const PORT = 5000;
const app = express();

app.use(cors());
app.use(express.json());

// Mount profile routes under /api
app.use('/api', profileRoutes);

// Serve uploaded files
app.use('/api/uploads', express.static(path.join(__dirname, 'Uploads')));

// Test route to verify server is running
app.get('/', (req, res) => {
  res.send('FloraFlow server is running');
});

connectMongoDB();

app.listen(PORT, () => {
  console.log(`FloraFlow server running at http://localhost:${PORT}`);
});