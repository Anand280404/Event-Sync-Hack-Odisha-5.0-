const express = require('express');
const router = express.Router();
const Registration = require('../models/Registration');
const Event = require('../models/Event');
const { auth } = require('../middleware/auth');
const QRCode = require('qrcode');

// @route   POST /api/registrations/:eventId
// @desc    Register for an event
// @access  Private
router.post('/:eventId', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    // Check if event is published
    if (event.status !== 'published') {
      return res.status(400).json({ message: 'Event is not available for registration' });
    }
    
    // Check if registration is open
    if (new Date(event.startDate) <= new Date()) {
      return res.status(400).json({ message: 'Registration for this event has closed' });
    }
    
    // Check if event has capacity
    if (event.capacity > 0) {
      const registrationCount = await Registration.countDocuments({ 
        event: req.params.eventId, 
        status: { $in: ['confirmed', 'attended'] } 
      });
      
      if (registrationCount >= event.capacity) {
        return res.status(400).json({ message: 'Event is at full capacity' });
      }
    }
    
    // Check if user is already registered
    const existingRegistration = await Registration.findOne({
      event: req.params.eventId,
      user: req.user.id
    });
    
    if (existingRegistration) {
      return res.status(400).json({ message: 'You are already registered for this event' });
    }
    
    // Generate QR code
    const qrCodeData = JSON.stringify({
      userId: req.user.id,
      eventId: req.params.eventId,
      timestamp: Date.now()
    });
    
    const qrCode = await QRCode.toDataURL(qrCodeData);
    
    // Create registration
    const registration = await Registration.create({
      user: req.user.id,
      event: req.params.eventId,
      teamMembers: req.body.teamMembers || [],
      qrCode: qrCode
    });
    
    // If event is free, mark as paid
    if (event.price === 0) {
      registration.paymentStatus = 'paid';
      await registration.save();
    }
    
    await registration.populate('event', 'title startDate endDate location');
    
    res.status(201).json(registration);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/registrations/user/my-registrations
// @desc    Get user's registrations
// @access  Private
router.get('/user/my-registrations', auth, async (req, res) => {
  try {
    const registrations = await Registration.find({ user: req.user.id })
      .populate('event', 'title startDate endDate location image category')
      .sort({ createdAt: -1 });
    
    res.json(registrations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/registrations/event/:eventId
// @desc    Get registrations for an event (Organizer only)
// @access  Private
router.get('/event/:eventId', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    // Check if user is the organizer or admin
    if (event.organizer.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view registrations for this event' });
    }
    
    const registrations = await Registration.find({ event: req.params.eventId })
      .populate('user', 'name email avatar')
      .sort({ createdAt: -1 });
    
    res.json(registrations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/registrations/:id/check-in
// @desc    Check in a participant
// @access  Private (Organizer and Admins)
router.put('/:id/check-in', auth, async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.id)
      .populate('event');
    
    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }
    
    // Check if user is the organizer or admin
    if (registration.event.organizer.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to check in participants for this event' });
    }
    
    registration.checkInTime = new Date();
    registration.status = 'attended';
    await registration.save();
    
    res.json(registration);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/registrations/:id
// @desc    Cancel registration
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.id);
    
    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }
    
    // Check if user owns the registration or is admin
    if (registration.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to cancel this registration' });
    }
    
    await Registration.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Registration cancelled' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;