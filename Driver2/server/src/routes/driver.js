const express = require('express');
const router = express.Router();
const driverRepository = require('../repositories/driverRepository');
const { authenticateToken } = require('../middleware/auth');

// Get driver profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'driver') {
      return res.status(403).json({ error: 'Access denied. Only drivers can access this resource.' });
    }
    
    const driverId = req.user.userId;
    const profile = await driverRepository.getDriverProfile(driverId);
    res.json(profile);
  } catch (error) {
    console.error('Error fetching driver profile:', error);
    res.status(500).json({ error: 'Failed to fetch driver profile' });
  }
});

// Update driver profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'driver') {
      return res.status(403).json({ error: 'Access denied. Only drivers can access this resource.' });
    }

    const driverId = req.user.userId;
    const updatedProfile = await driverRepository.updateDriverProfile(driverId, req.body);
    res.json(updatedProfile);
  } catch (error) {
    console.error('Error updating driver profile:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to update driver profile',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;
