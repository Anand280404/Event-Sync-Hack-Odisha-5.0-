const express = require('express');
const Event = require('../models/Event');
const Registration = require('../models/Registration');
const auth = require('../middleware/auth');
const router = express.Router();

// Get all events
router.get('/', async (req, res) => {
  try {
    const events = await Event.findAll({
      include: [
        {
          association: 'organizer',
          attributes: ['id', 'name', 'email']
        }
      ],
      order: [['date', 'ASC']]
    });

    res.json({ events });
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's events
router.get('/user', auth, async (req, res) => {
  try {
    const events = await Event.findAll({
      where: { userId: req.user.id },
      include: [
        {
          association: 'registrations',
          attributes: ['id', 'paymentStatus']
        }
      ],
      order: [['date', 'ASC']]
    });

    res.json({ events });
  } catch (error) {
    console.error('Get user events error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create event
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, date, location, price } = req.body;

    const event = await Event.create({
      title,
      description,
      date,
      location,
      price: price || 0,
      userId: req.user.id
    });

    res.status(201).json({
      message: 'Event created successfully',
      event
    });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete event
router.delete('/:id', auth, async (req, res) => {
  try {
    const event = await Event.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    await event.destroy();
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;