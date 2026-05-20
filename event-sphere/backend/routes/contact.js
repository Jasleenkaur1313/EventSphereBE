const express = require('express');
const router = express.Router();
const prisma = require('../lib/prisma');


// POST /api/contact — save contact message
router.post('/', async (req, res, next) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'All fields (name, email, message) are required.'
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: 'Invalid email format.' });
    }

    const newContact = await prisma.contact.create({
      data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        message: message.trim()
      }
    });

    res.status(201).json({ success: true, message: 'Message sent successfully!', contact: newContact });
  } catch (err) {
    next(err);
  }
});


// GET /api/contact — fetch all contacts
router.get('/', async (req, res, next) => {
  try {
    const contacts = await prisma.contact.findMany({
      orderBy: { submittedAt: 'desc' }
    });
    res.json({ success: true, data: contacts });
  } catch (err) {
    next(err);
  }
});


module.exports = router;
