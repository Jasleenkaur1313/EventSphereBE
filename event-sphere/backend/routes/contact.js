
//mongodb
const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');


// ✅ POST /api/contact — Save contact message
router.post('/', async (req, res, next) => {
  try {
    const { name, email, message } = req.body;

    // validation
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'All fields (name, email, message) are required.'
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format.'
      });
    }

    const newContact = new Contact({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      message: message.trim()
    });

    await newContact.save();

    res.status(201).json({
      success: true,
      message: 'Message sent successfully!',
      contact: newContact
    });

  } catch (err) {
    next(err);
  }
});


// ✅ GET /api/contact — fetch all contacts
router.get('/', async (req, res, next) => {
  try {
    const contacts = await Contact.find().sort({ submittedAt: -1 });
    res.json({ success: true, data: contacts });
  } catch (err) {
    next(err);
  }
});


module.exports = router;