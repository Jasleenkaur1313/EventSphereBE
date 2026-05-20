require('dotenv').config();

const express = require('express');
const http = require('http');
const { initSocket } = require('./socket');
const path = require('path');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const connectDB = require('./config/db');
const prisma = require('./lib/prisma');

connectDB();

const adminAuth = require('./middleware/adminAuth');
const eventsRouter = require('./routes/events');
const contactRouter = require('./routes/contact');

const app = express();
const server = http.createServer(app);
initSocket(server);
const PORT = process.env.PORT || 9001;


// --- Middleware ---

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.use(express.static(path.join(__dirname, 'public')));
app.use('/admin', express.static(path.join(__dirname)));
app.use(express.static(path.join(__dirname, '..', 'frontend', 'dist')));


// --- Routes ---

app.use('/api/events', eventsRouter);
app.use('/api/contact', contactRouter);

const adminRouter = express.Router();
adminRouter.use(adminAuth);
adminRouter.use('/events', eventsRouter);
app.use('/api/admin', adminRouter);


// --- Auth ---

app.post('/api/auth/register', async (req, res, next) => {
  try {
    const { name, studentId, email, password, major } = req.body;

    if (!name || !studentId || !email || !password) {
      return res.status(400).json({ message: 'Missing fields' });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: { name, studentId, email, password: hashedPassword, major }
    });

    res.status(201).json({ success: true, message: 'User registered successfully' });
  } catch (err) {
    next(err);
  }
});


app.post('/api/auth/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      success: true,
      token,
      user: { id: user.id, email: user.email }
    });
  } catch (err) {
    next(err);
  }
});


// --- Error handling ---

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api') || req.path.startsWith('/admin')) return next();
  res.sendFile(path.join(__dirname, '..', 'frontend', 'dist', 'index.html'));
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`
  });
});

app.use((err, req, res, next) => {
  console.error(`[ERROR] ${err.message}`);
  console.error(err.stack);

  const status = err.statusCode || 500;
  res.status(status).json({
    success: false,
    message: status === 500 ? 'Internal server error' : err.message
  });
});


// --- Start ---

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`Socket.IO ready on ws://localhost:${PORT}`);
  console.log(`Admin Portal: http://localhost:${PORT}/admin/admin-portal.html`);
  console.log(`   POST   http://localhost:${PORT}/api/contact       (Submit contact form)`);
  console.log(`   GET    http://localhost:${PORT}/api/contact       (View all contacts)`);
});
