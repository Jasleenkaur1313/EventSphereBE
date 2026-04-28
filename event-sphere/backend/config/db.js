const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://ishita09990_db_user:Ishita123@cluster0.butedeg.mongodb.net/event-sphere');
    console.log('MongoDB Connected ✅');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;