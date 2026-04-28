const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: String,
  category: String,
  description: String,
  date: String,
  time: String,
  venue: String,
  image: String,
  price: Number,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Event', eventSchema);