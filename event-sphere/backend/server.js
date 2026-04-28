// server.js — run with: node server.js or npm run dev

const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

//MONGODB PART
const connectDB = require('./config/db');
connectDB();

const adminAuth = require('./middleware/adminAuth');
const eventsRouter  = require('./routes/events');
const contactRouter = require('./routes/contact');  


const app = express();
const PORT = 9001;

// paths to our JSON "database" files
const DATA_DIR = path.join(__dirname, 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const LOGINS_FILE = path.join(DATA_DIR, 'login_logs.json');

// quick helpers to read/write JSON files
function readJSON(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return [];
  }
}

function writeJSON(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}


// --- Middleware ---

// let the React frontend (port 5173) talk to this API
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// log every request that comes in
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// serve static files (admin portal, etc.)
app.use(express.static(path.join(__dirname, 'public')));
app.use('/admin', express.static(path.join(__dirname)));


// --- Routes ---

// health check
app.get('/', (req, res) => {
  res.json({ message: 'EventSphere Backend is running!', port: PORT });
});

// public — anyone can browse events
// public routes
app.use('/api/events', eventsRouter);
app.use('/api/contact', contactRouter); // ✅ ADD THIS


// admin routes — separate router so adminAuth runs on everything under /api/admin
const adminRouter = express.Router();
adminRouter.use(adminAuth); // token check before any admin action
adminRouter.use('/events', eventsRouter);
app.use('/api/admin', adminRouter);


// --- Auth ---

// register a new user
app.post('/api/auth/register', (req, res, next) => {
  try {
    const { name, studentId, email, password, major } = req.body;

    if (!name || !studentId || !email || !password) {
      return res.status(400).json({ success: false, message: 'Missing required fields.' });
    }

    const users = readJSON(USERS_FILE);

    if (users.some(u => u.email === email)) {
      return res.status(409).json({ success: false, message: 'Email already registered.' });
    }

    const newUser = {
      id: Date.now(),
      name,
      studentId,
      email,
      password, // should hash this in production (bcrypt etc)
      major: major || '',
      registeredAt: new Date().toISOString()
    };

    users.push(newUser);
    writeJSON(USERS_FILE, users);

    console.log(`New registration: ${name} (${email})`);
    res.status(201).json({ success: true, message: 'Registration successful.' });
  } catch (err) {
    next(err);
  }
});

// login — saves to login_logs.json for tracking
app.post('/api/auth/login', (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username and password are required.' });
    }

    const logins = readJSON(LOGINS_FILE);
    const isAdmin = username === 'admin' || username.toLowerCase().startsWith('admin');

    const logEntry = {
      id: Date.now(),
      username,
      isAdmin,
      success: true,
      timestamp: new Date().toISOString()
    };

    logins.push(logEntry);
    writeJSON(LOGINS_FILE, logins);

    console.log(`Login: ${username} at ${logEntry.timestamp}`);
    res.json({ success: true, isAdmin });
  } catch (err) {
    next(err);
  }
});


// --- Error handling ---

// 404 — no matching route found
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`
  });
});

// global error handler — catches anything passed via next(err)
// needs all 4 params or express won't treat it as an error handler
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

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`Admin Portal: http://localhost:${PORT}/admin/admin-portal.html`);
  console.log(`   POST   http://localhost:${PORT}/api/contact       (Submit contact form)`);
console.log(`   GET    http://localhost:${PORT}/api/contact       (View all contacts)`);
});