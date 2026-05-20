const express = require('express');
const router = express.Router();
const prisma = require('../lib/prisma');
const { getIO } = require('../socket');


// GET all events (with optional category filter)
router.get('/', async (req, res, next) => {
  try {
    const { category } = req.query;
    const events = await prisma.event.findMany({
      where: category ? { category } : undefined,
      orderBy: { createdAt: 'desc' }
    });
    res.json({ success: true, data: events });
  } catch (err) {
    next(err);
  }
});


// GET single event
router.get('/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ success: false, message: 'Invalid event ID' });

    const event = await prisma.event.findUnique({ where: { id } });
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });

    res.json({ success: true, data: event });
  } catch (err) {
    next(err);
  }
});


// CREATE event
router.post('/', async (req, res, next) => {
  try {
    const { title, category, description, date, time, venue, image, price } = req.body;

    if (!title || !category || !description || !date) {
      return res.status(400).json({
        success: false,
        message: 'title, category, description and date are required'
      });
    }

    const newEvent = await prisma.event.create({
      data: {
        title,
        category,
        description,
        date,
        time: time || 'TBD',
        venue: venue || 'TBD',
        image: image || `https://placehold.co/400x250/cccccc/ffffff?text=${encodeURIComponent(title)}`,
        price: price != null ? parseFloat(price) : null
      }
    });

    try {
      getIO().emit('event:created', { event: newEvent });
      getIO().emit('notification', {
        type: 'new',
        message: `New event added: "${newEvent.title}"`,
        category: newEvent.category,
        eventId: newEvent.id
      });
    } catch (_) {}

    res.status(201).json({ success: true, message: 'Event created!', data: newEvent });
  } catch (err) {
    next(err);
  }
});


// UPDATE event
router.put('/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ success: false, message: 'Invalid event ID' });

    const { title, category, description, date, time, venue, image, price } = req.body;

    const updated = await prisma.event.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(category !== undefined && { category }),
        ...(description !== undefined && { description }),
        ...(date !== undefined && { date }),
        ...(time !== undefined && { time }),
        ...(venue !== undefined && { venue }),
        ...(image !== undefined && { image }),
        ...(price !== undefined && { price: parseFloat(price) })
      }
    });

    try {
      getIO().emit('event:updated', { event: updated });
      getIO().emit('notification', {
        type: 'update',
        message: `Event updated: "${updated.title}"`,
        category: updated.category,
        eventId: updated.id
      });
    } catch (_) {}

    res.json({ success: true, message: 'Event updated!', data: updated });
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ success: false, message: 'Event not found' });
    next(err);
  }
});


// DELETE event
router.delete('/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ success: false, message: 'Invalid event ID' });

    const deleted = await prisma.event.delete({ where: { id } });

    try {
      getIO().emit('event:deleted', { eventId: deleted.id, title: deleted.title, category: deleted.category });
      getIO().emit('notification', {
        type: 'delete',
        message: `Event removed: "${deleted.title}"`,
        category: deleted.category,
        eventId: deleted.id
      });
    } catch (_) {}

    res.json({ success: true, message: 'Event deleted!' });
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ success: false, message: 'Event not found' });
    next(err);
  }
});


// PAYMENT
router.post('/:id/pay', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ success: false, message: 'Invalid event ID' });

    const event = await prisma.event.findUnique({ where: { id } });
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });

    if (!event.price) {
      return res.status(400).json({ success: false, message: 'This event is free — no payment needed.' });
    }

    const bookingRef = 'BK-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7).toUpperCase();

    res.json({
      success: true,
      message: `Payment of Rs ${event.price} for "${event.title}" was successful!`,
      data: {
        bookingRef,
        eventId: event.id,
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
