const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  studentId: String,
  email: { type: String, unique: true },
  password: String,
  major: String,
  registeredAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);