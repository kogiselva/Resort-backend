const express = require('express');
const router = express.Router();
const Booking = require('../models/bookings');
const Review = require('../models/review');
const Room = require('../models/Room');

// Admin dashboard stats
router.get('/dashboard', async (req, res) => {
  try {
    const totalBookings = await Booking.countDocuments();
    const pendingBookings = await Booking.countDocuments({ status: 'pending' });
    const totalReviews = await Review.countDocuments();
    const pendingReviews = await Review.countDocuments({ approved: false });
    const totalRooms = await Room.countDocuments();

    // Recent bookings
    const recentBookings = await Booking.find()
      .populate('room', 'name type')
      .sort({ createdAt: -1 })
      .limit(5);

    // Revenue calculation (for confirmed/completed bookings)
    const revenueData = await Booking.aggregate([
      { $match: { status: { $in: ['confirmed', 'completed'] } } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalPrice' } } }
    ]);

    const totalRevenue = revenueData.length > 0 ? revenueData[0].totalRevenue : 0;

    res.status(200).json({
      success: true,
      data: {
        stats: {
          totalBookings,
          pendingBookings,
          totalReviews,
          pendingReviews,
          totalRooms,
          totalRevenue
        },
        recentBookings
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get all bookings for admin
router.get('/bookings', async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('room', 'name type pricePerNight images')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Update booking status
router.put('/bookings/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('room', 'name type');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.status(200).json({
      success: true,
      message: `Booking ${status} successfully`,
      data: booking
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Get pending reviews for approval
router.get('/reviews/pending', async (req, res) => {
  try {
    const reviews = await Review.find({ approved: false })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Approve review
router.put('/reviews/:id/approve', async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { approved: true },
      { new: true }
    );

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Review approved successfully',
      data: review
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;