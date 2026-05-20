const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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

// Hash password before saving to MongoDB
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;

  this.password = await bcrypt.hash(this.password, 10);
});
// Helper to verify password
userSchema.methods.comparePassword = function (plain) {
  return bcrypt.compare(plain, this.password);
};

module.exports = mongoose.model('User', userSchema);