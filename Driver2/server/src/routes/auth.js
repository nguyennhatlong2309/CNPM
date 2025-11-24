'use strict';

const express = require('express');
const router = express.Router();
const { query } = require('../db');

// Get driver by ID
router.get('/driver/profile', async (req, res) => {
  const driverId = req.driverId; // từ middleware xác thực token
  try {
    const [driver] = await query(`
      SELECT 
        tx.MATX, tx.TenTX, tx.SDT, tx.giayphep,
        xb.biensoxe, xb.trangthai AS busStatus,
        lc.batdau AS shiftStart, lc.ketthuc AS shiftEnd, lc.ngaytrongtuan,
        td.Tentuyen
      FROM taixe tx
      LEFT JOIN xebuyt xb ON tx.MATX = xb.MATX
      LEFT JOIN phancong pc ON xb.MAXE = pc.MAXE
      LEFT JOIN lichtrinh lc ON pc.MALC = lc.MALC
      LEFT JOIN tuyenduong td ON pc.MaTuyen = td.MaTuyen
      WHERE tx.MATX = ?
    `, [driverId]);

    if (!driver) return res.status(404).json({ error: 'Driver not found' });

    res.json({
      id: driver.MATX,
      name: driver.TenTX,
      phone: driver.SDT,
      license: driver.giayphep,
      plate: driver.biensoxe,
      busStatus: driver.busStatus,
      shiftStart: driver.shiftStart || 'Chưa phân ca',
      shiftEnd: driver.shiftEnd,
      dayOfWeek: driver.ngaytrongtuan,
      routeName: driver.Tentuyen
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Driver login
router.post('/driver/login', async (req, res) => {
  const { username, password } = req.body;
  
  if (!username) {
    return res.status(400).json({ error: 'Username is required' });
  }
  
  try {
    const [driver] = await query(
      `
      SELECT 
        tx.MATX, tx.TenTX, tx.SDT, tx.giayphep,
        xb.biensoxe, xb.trangthai AS busStatus,
        lc.batdau AS shiftStart, lc.ketthuc AS shiftEnd, lc.ngaytrongtuan,
        td.Tentuyen
      FROM taixe tx
      LEFT JOIN xebuyt xb ON tx.MATX = xb.MATX
      LEFT JOIN phancong pc ON xb.MAXE = pc.MAXE
      LEFT JOIN lichtrinh lc ON pc.MALC = lc.MALC
      LEFT JOIN tuyenduong td ON pc.MaTuyen = td.MaTuyen
      WHERE tx.MATX = ? OR tx.SDT = ?
    `,
      [username, username]
    );
    
    if (!driver) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // In a real app, you would verify the password here
    // For now, we'll just return a token
    const token = `driver-${driver.MATX}`;
    
    res.json({
      token,
      user: {
        id: driver.MATX,
        name: driver.TenTX,
        phone: driver.SDT,
        license: driver.giayphep,
        plate: driver.biensoxe,
        busStatus: driver.busStatus,
        shiftStart: driver.shiftStart || 'Chưa phân ca',
        shiftEnd: driver.shiftEnd,
        dayOfWeek: driver.ngaytrongtuan,
        routeName: driver.Tentuyen
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;
