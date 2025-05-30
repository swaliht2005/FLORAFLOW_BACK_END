
const express = require('express');
const cors = require('cors');
const connectMongoDB = require('./config/db');
const apiRoutes = require('./routes/server');
const path = require('path');

const PORT = 5000;
const app = express();

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

console.log('Mounting apiRoutes at /api');
app.use('/api', apiRoutes);

app.use('/api/uploads', express.static(path.join(__dirname, 'Uploads')));

app.get('/', (req, res) => {
    res.send('FloraFlow server is running');
});

app.use((req, res) => {
    console.log(`404 Not Found: ${req.method} ${req.url}`);
    res.status(404).json({ error: 'Route not found' });
});

connectMongoDB();

app.listen(PORT, () => {
    console.log(`FloraFlow server running at http://localhost:${PORT}`);
});