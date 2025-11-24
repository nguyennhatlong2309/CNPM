'use strict';

const express = require('express');
const router = express.Router();
const { query, execute } = require('../db');

// Update student status for a trip
router.post('/trips/:tripId/students/:studentId/status', async (req, res) => {
  const { tripId, studentId } = req.params;
  const { status } = req.body;
  
  if (!status) {
    return res.status(400).json({ error: 'Status is required' });
  }
  
  const allowedStatuses = ['pending', 'picked', 'dropped'];
  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({ 
      error: 'Invalid status', 
      allowedStatuses 
    });
  }
  
  try {
    // First, verify the trip and student exist
    const [trip] = await query(
      'SELECT 1 FROM chitietchuyendi WHERE MACD = ? AND MAHS = ?',
      [tripId, studentId]
    );
    
    if (!trip) {
      return res.status(404).json({ 
        error: 'Trip or student not found in this trip' 
      });
    }
    
    // Update the status
    await execute(
      'UPDATE chitietchuyendi SET status = ? WHERE MACD = ? AND MAHS = ?',
      [status, tripId, studentId]
    );
    
    // Get the updated record
    const [updated] = await query(
      'SELECT * FROM chitietchuyendi WHERE MACD = ? AND MAHS = ?',
      [tripId, studentId]
    );
    
    res.json({
      success: true,
      data: updated[0]
    });
  } catch (error) {
    console.error('Error updating student status:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get trip details
router.get('/trips/:tripId', async (req, res) => {
  const { tripId } = req.params;
  
  try {
    const [trip] = await query(
      `SELECT cd.*, tx.TenTX, x.BienSoXe 
       FROM chuyendi cd
       JOIN phancong pc ON cd.MAPC = pc.MAPC
       JOIN taixe tx ON pc.MATX = tx.MATX
       JOIN xebuyt x ON pc.MAXE = x.MAXE
       WHERE cd.MACD = ?`,
      [tripId]
    );
    
    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }
    
    // Get students for this trip
    const students = await query(
      `SELECT hs.MAHS, hs.TenHS, hs.DiaChi, ctd.status
       FROM hocsinh hs
       JOIN chitietchuyendi ctd ON hs.MAHS = ctd.MAHS
       WHERE ctd.MACD = ?`,
      [tripId]
    );
    
    res.json({
      ...trip,
      students
    });
  } catch (error) {
    console.error('Error fetching trip details:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;
