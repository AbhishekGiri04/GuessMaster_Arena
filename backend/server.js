// backend/server.js
require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const morgan = require('morgan');
const passport = require('passport');

const connectDB = require('./config/db');
connectDB();

const app = express();
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// passport setup
require('./config/passport')(passport);
app.use(passport.initialize());

// routes
const authRoutes = require('./routes/auth');
const gameRoutes = require('./routes/game');
const roomRoutes = require('./routes/rooms');

app.use('/api/auth', authRoutes);
app.use('/api/game', gameRoutes);
app.use('/api/rooms', roomRoutes);

// sockets
const gameSocketInit = require('./sockets/game');
gameSocketInit(io);

// fallback root route
app.get('/', (req, res) => res.json({ ok:true, msg: 'GuessMaster Arena API' }));

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

