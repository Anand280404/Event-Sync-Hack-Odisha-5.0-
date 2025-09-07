const Event = require('../models/Event');
const Registration = require('../models/Registration');
const { validationResult } = require('express-validator');

// Get all events with filtering and pagination
exports.getEvents = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Build filter object
    const filter = {};
    
    if (req.query.category) {
      filter.category = req.query.category;
    }
    
    if (req.query.status) {
      filter.status = req.query.status;
    }
    
    if (req.query.mode) {
      filter.mode = req.query.mode;
    }
    
    if (req.query.search) {
      filter.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } },
        { tags: { $regex: req.query.search, $options: 'i' } }
      ];
    }
    
    // Date filtering
    if (req.query.upcoming === 'true') {
      filter.startDate = { $gte: new Date() };
    }
    
    const events = await Event.find(filter)
      .populate('organizer', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Event.countDocuments(filter);
    
    res.json({
      events,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalEvents: total
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get single event
exports.getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('organizer', 'name email avatar');
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    // Get registration count
    const registrationCount = await Registration.countDocuments({ 
      event: req.params.id, 
      status: { $in: ['confirmed', 'attended'] } 
    });
    
    // Check if user is registered
    let userRegistration = null;
    if (req.user) {
      userRegistration = await Registration.findOne({
        event: req.params.id,
        user: req.user.id
      });
    }
    
    res.json({
      ...event.toObject(),
      registrationCount,
      userRegistration: userRegistration ? {
        status: userRegistration.status,
        paymentStatus: userRegistration.paymentStatus
      } : null
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create new event
exports.createEvent = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const eventData = {
      ...req.body,
      organizer: req.user.id
    };
    
    if (req.file) {
      eventData.image = req.file.path;
    }
    
    const event = await Event.create(eventData);
    
    res.status(201).json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update event
exports.updateEvent = async (req, res) => {
  try {
    let event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    // Check if user is the organizer or admin
    if (event.organizer.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this event' });
    }
    
    if (req.file) {
      req.body.image = req.file.path;
    }
    
    event = await Event.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    
    res.json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete event
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    // Check if user is the organizer or admin
    if (event.organizer.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this event' });
    }
    
    await Event.findByIdAndDelete(req.params.id);
    
    // Also delete all registrations for this event
    await Registration.deleteMany({ event: req.params.id });
    
    res.json({ message: 'Event removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get events by organizer
exports.getOrganizerEvents = async (req, res) => {
  try {
    const events = await Event.find({ organizer: req.user.id })
      .sort({ createdAt: -1 });
    
    res.json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};