
const express = require('express');
const cors = require('cors');
const connectMongoDB = require('./config/db');
const apiRoutes = require('./routes/server');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');
const { authMiddleware } = require('./middlewares/chatmiddlewares');
const chatController = require('./controllers/chatController');

const PORT = 5000;
const app = express();

// Create HTTP server for Express and Socket.IO
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: '*', // Adjust for production: e.g., 'http://your-frontend.com'
    methods: ['GET', 'POST']
  }
});

// Apply Socket.IO middleware
io.use(authMiddleware);

// Setup chat controller
const chat = chatController(io);
io.on('connection', chat.handleConnection);

// Express middleware
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

// Connect to MongoDB
connectMongoDB();

// Start the server
server.listen(PORT, () => {
  console.log(`FloraFlow server running at http://localhost:${PORT}`);
});
