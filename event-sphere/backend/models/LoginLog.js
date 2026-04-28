const mongoose = require('mongoose');

const loginLogSchema = new mongoose.Schema({
  username: String,
  isAdmin: Boolean,
  success: Boolean,
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('LoginLog', loginLogSchema);