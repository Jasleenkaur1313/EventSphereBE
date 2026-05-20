// middleware/requestLogger.js
// Logs every incoming request to the console AND to a log file on disk.
// Output format: [DATE TIME] METHOD /route — STATUS — Xms — IP: x.x.x.x
 
const fs   = require('fs');
const path = require('path');
 
// log file lives at: backend/logs/requests.log
const LOG_DIR  = path.join(__dirname, '..', 'logs');
const LOG_FILE = path.join(LOG_DIR, 'requests.log');
 
// create the logs/ folder if it doesn't exist yet
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}
 
app.use(requestLogger);

function requestLogger(req, res, next) {
  const start = Date.now(); // record when request arrived
 
  // 'finish' fires after the response has been sent
  res.on('finish', () => {
    const duration  = Date.now() - start;           // how long it took in ms
    const status    = res.statusCode;               // 200, 404, 500 etc
    const method    = req.method;                   // GET, POST, PUT, DELETE
    const url       = req.originalUrl;              // /api/events, /api/contact etc
    const ip        = req.ip || req.connection.remoteAddress || 'unknown';
    const timestamp = new Date().toISOString().replace('T', ' ').split('.')[0]; // 2024-01-15 10:32:45
 
    const logLine = `[${timestamp}] ${method.padEnd(6)} ${url.padEnd(30)} — ${status} — ${duration}ms — IP: ${ip}`;
 
    // print to console
    console.log(logLine);
 
    // also write to logs/requests.log file
    fs.appendFile(LOG_FILE, logLine + '\n', (err) => {
      if (err) console.error('[Logger] Could not write to log file:', err.message);
    });
  });
 
  next(); // pass to next middleware/route
}
 
module.exports = requestLogger;