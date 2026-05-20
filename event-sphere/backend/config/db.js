const prisma = require('../lib/prisma');

const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log('PostgreSQL Connected via Prisma ✅');
  } catch (err) {
    console.error('Database connection failed ❌:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
