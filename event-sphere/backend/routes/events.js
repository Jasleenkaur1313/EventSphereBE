

const express = require('express');
const router = express.Router();
const Event = require('../models/Event');


// ✅ GET all events (with optional category filter)
router.get('/', async (req, res, next) => {
  try {
    const { category } = req.query;

    const filter = category ? { category } : {};
    const events = await Event.find(filter);

    res.json({ success: true, data: events });
  } catch (err) {
    next(err);
  }
});


// ✅ GET single event
router.get('/:id', async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    res.json({ success: true, data: event });
  } catch (err) {
    next(err);
  }
});


// ✅ CREATE event
router.post('/', async (req, res, next) => {
  try {
    const { title, category, description, date, time, venue, image } = req.body;

    if (!title || !category || !description || !date) {
      return res.status(400).json({
        success: false,
        message: 'title, category, description and date are required'
      });
    }

    const newEvent = new Event({
      title,
      category,
      description,
      date,
      time: time || 'TBD',
      venue: venue || 'TBD',
      image: image || `https://placehold.co/400x250/cccccc/ffffff?text=${encodeURIComponent(title)}`
    });

    await newEvent.save();

    res.status(201).json({
      success: true,
      message: 'Event created!',
      data: newEvent
    });
  } catch (err) {
    next(err);
  }
});


// ✅ UPDATE event
router.put('/:id', async (req, res, next) => {
  try {
    const updated = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    res.json({
      success: true,
      message: 'Event updated!',
      data: updated
    });
  } catch (err) {
    next(err);
  }
});


// ✅ DELETE event
router.delete('/:id', async (req, res, next) => {
  try {
    const deleted = await Event.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    res.json({
      success: true,
      message: 'Event deleted!'
    });
  } catch (err) {
    next(err);
  }
});


// ✅ PAYMENT (same logic, but fetch from DB)
router.post('/:id/pay', async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    if (!event.price) {
      return res.status(400).json({
        success: false,
        message: 'This event is free — no payment needed.'
      });
    }

    const bookingRef =
      'BK-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7).toUpperCase();

    res.json({
      success: true,
      message: `Payment of Rs ${event.price} for "${event.title}" was successful!`,
      data: {
        bookingRef,
        eventId: event._id,
        eventTitle: event.title,
        amountPaid: event.price,
        paidAt: new Date().toISOString()
      }
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;