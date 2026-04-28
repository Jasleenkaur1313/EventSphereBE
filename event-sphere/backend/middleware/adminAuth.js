// simple token-based auth for admin routes
// expects header: Authorization: Bearer admin123

const ADMIN_TOKEN = 'admin123'; // swap this for an env var in production

function adminAuth(req, res, next) {
  try {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
    }

    const token = authHeader.split(' ')[1];

    if (token !== ADMIN_TOKEN) {
      return res.status(403).json({ success: false, message: 'Access denied. Invalid admin token.' });
    }

    next(); // all good, let them through
  } catch (err) {
    next(err);
  }
}

module.exports = adminAuth;
