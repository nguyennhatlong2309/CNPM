'use strict';

require('dotenv').config();

const http = require('http');
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const { wss, broadcast } = require('./src/websocket');

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 4000;
const HOST = process.env.HOST || '0.0.0.0';

// Attach WebSocket server to the HTTP server
server.on('upgrade', (request, socket, head) => {
  // You can add authentication here if needed
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request);
  });
});

app.use(cors());
app.use(express.json());

// DB pool (promise-based)
const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'cnpm',
  waitForConnections: true,
  connectionLimit: 10,
  charset: 'utf8mb4',
  dateStrings: true,
});

async function query(sql, params) {
  const [rows] = await pool.query(sql, params);
  return rows;
}

async function execute(sql, params) {
  const [result] = await pool.execute(sql, params);
  return result;
}

// Minimal async error wrapper
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

// Centralized error handler
function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  res.status(status).json({ error: message });
}

// In-file repositories (encapsulate SQL)
const repos = {
  students: {
    getAll: () => query('SELECT MAHS, TenHS, Lop, MAPH, MaDiemDung FROM hocsinh ORDER BY MAHS'),
  },
  trips: {
    list: () => query(`
      SELECT cd.MACD, cd.batdau, cd.ketthuc, cd.trangthai,
             xe.biensoxe, tx.TenTX, pc.MAPC, cd.MALC
      FROM chuyendi cd
      JOIN phancong pc ON pc.MAPC = cd.MAPC
      JOIN xebuyt xe ON xe.MAXE = pc.MAXE
      JOIN taixe tx ON tx.MATX = xe.MATX
      ORDER BY cd.batdau DESC
    `),
    details: (macd) => query(`
      SELECT ctd.MACD, hs.MAHS, hs.TenHS, ctd.status
      FROM chitietchuyendi ctd
      JOIN hocsinh hs ON hs.MAHS = ctd.MAHS
      WHERE ctd.MACD = ?
      ORDER BY hs.MAHS
    `, [macd]),
    updateDetailStatus: async (macd, mahs, status) => {
      const allowed = new Set(['pending', 'picked', 'dropped']);
      if (!allowed.has(status)) {
        const e = new Error('Invalid status');
        e.status = 400;
        throw e;
      }
      const r = await execute('UPDATE chitietchuyendi SET status = ? WHERE MACD = ? AND MAHS = ?', [status, macd, mahs]);
      return { affectedRows: r.affectedRows };
    },
  },
  auth: {
    findDriver: async (username) => {
      const rows = await query('SELECT MATX, TenTX, SDT FROM taixe WHERE MATX = ? OR SDT = ? LIMIT 1', [username, username]);
      return rows[0] || null;
    },
  },
};

// Import routes
const driverRoutes = require('./src/routes/driver');

// Add db to all requests
app.use((req, res, next) => {
  req.db = { query, execute };
  next();
});

// Apply routes
app.use('/api', require('./src/routes/trips'));
app.use('/api/driver', driverRoutes);
app.use('/auth', require('./src/routes/auth'));

// Health check endpoint
app.get('/api/health', asyncHandler(async (req, res) => {
  const [result] = await query('SELECT NOW() AS now');
  res.json({ 
    status: 'ok', 
    timestamp: result.now,
    uptime: process.uptime()
  });
}));

// Debug endpoint to list tables (only in development)
if (process.env.NODE_ENV === 'development') {
  app.get('/api/tables', asyncHandler(async (req, res) => {
    const [tables] = await query('SHOW TABLES');
    res.json(tables);
  }));
}

// Legacy endpoints (kept for backward compatibility)
app.post('/auth/driver/login', asyncHandler(async (req, res) => {
  const { username, password } = req.body || {};
  if (!username) return res.status(400).json({ error: 'Missing username' });
  const r = await repos.auth.findDriver(username);
  if (!r) return res.status(401).json({ error: 'Invalid credentials' });
  const driver = { id: r.MATX, name: r.TenTX, phone: r.SDT };
  const token = `driver-${driver.id}`;
  res.json({ token, driver });
}));

// --- Additional routes used by the current UI ---
function getDriverId(req) {
  const auth = req.headers.authorization || '';
  const m = auth.match(/^Bearer\s+driver-(.+)$/);
  return m ? m[1] : null;
}

function requireDriver(req, res, next) {
  const driverId = getDriverId(req);
  if (!driverId) return res.status(401).json({ error: 'Unauthorized' });
  req.driverId = driverId;
  next();
}

// Return today's trip for the authenticated driver; fallback to latest if none today
app.get('/driver/trips/today', requireDriver, asyncHandler(async (req, res) => {
  const driverId = req.driverId;
  const sqlBase = `
    SELECT cd.MACD, cd.batdau, cd.ketthuc, cd.trangthai,
           td.Tentuyen AS routeName
    FROM chuyendi cd
    JOIN phancong pc ON pc.MAPC = cd.MAPC
    JOIN xebuyt xe ON xe.MAXE = pc.MAXE
    JOIN taixe tx ON tx.MATX = xe.MATX
    LEFT JOIN tuyenduong td ON td.MaTuyen = pc.MaTuyen
    WHERE tx.MATX = ?
  `;
  let trips = await query(sqlBase + ' AND DATE(cd.batdau) = CURDATE() ORDER BY cd.batdau DESC LIMIT 1', [driverId]);
  if (!trips || trips.length === 0) {
    trips = await query(sqlBase + ' ORDER BY cd.batdau DESC LIMIT 1', [driverId]);
  }
  if (!trips || trips.length === 0) {
    return res.status(404).json({ error: 'No trips found' });
  }
  const t = trips[0];
  const macd = t.MACD;
  const studentsRows = await query(`
    SELECT hs.MAHS, hs.TenHS, hs.MaDiemDung, dd.Vitri AS address, ctd.status
    FROM chitietchuyendi ctd
    JOIN hocsinh hs ON hs.MAHS = ctd.MAHS
    LEFT JOIN diemdung dd ON dd.MaDiemDung = hs.MaDiemDung
    WHERE ctd.MACD = ?
    ORDER BY hs.MAHS
  `, [macd]);
  const students = studentsRows.map((r, idx) => ({
    id: r.MAHS,
    name: r.TenHS,
    status: r.status || 'pending',
    pickupOrder: idx + 1,
    pickupAddress: r.address || 'Chưa có',
    dropAddress: r.address || 'Chưa có',
  }));
  const tripDto = {
    id: macd,
    routeName: t.routeName || `Chuyến ${macd}`,
    departTime: t.batdau,
    students,
  };
  res.json(tripDto);
}));

// Update a student status inside a trip (pending|picked|dropped)
app.post('/trips/:id/students/:studentId/status', requireDriver, asyncHandler(async (req, res) => {
  const macd = req.params.id;
  const mahs = req.params.studentId;
  const status = (req.body && req.body.status) || '';
  const allowed = new Set(['pending', 'picked', 'dropped']);
  if (!allowed.has(status)) return res.status(400).json({ error: 'Invalid status' });
  await execute('UPDATE chitietchuyendi SET status = ? WHERE MACD = ? AND MAHS = ?', [status, macd, mahs]);
  // return updated students of the trip to sync UI
  const studentsRows = await query(`
    SELECT hs.MAHS, hs.TenHS, hs.MaDiemDung, dd.Vitri AS address, ctd.status
    FROM chitietchuyendi ctd
    JOIN hocsinh hs ON hs.MAHS = ctd.MAHS
    LEFT JOIN diemdung dd ON dd.MaDiemDung = hs.MaDiemDung
    WHERE ctd.MACD = ?
    ORDER BY hs.MAHS
  `, [macd]);
  const students = studentsRows.map((r, idx) => ({
    id: r.MAHS,
    name: r.TenHS,
    status: r.status || 'pending',
    pickupOrder: idx + 1,
    pickupAddress: r.address || 'Chưa có',
    dropAddress: r.address || 'Chưa có',
  }));
  res.json({ id: macd, students });
}));

// Get a specific trip by id, returns the same DTO shape as /driver/trips/today
app.get('/trips/:id', requireDriver, asyncHandler(async (req, res) => {
  const macd = req.params.id;
  const rows = await query(`
    SELECT cd.MACD, cd.batdau, cd.ketthuc, cd.trangthai,
           td.Tentuyen AS routeName
    FROM chuyendi cd
    LEFT JOIN phancong pc ON pc.MAPC = cd.MAPC
    LEFT JOIN tuyenduong td ON td.MaTuyen = pc.MaTuyen
    WHERE cd.MACD = ?
    LIMIT 1
  `, [macd]);
  if (!rows || rows.length === 0) return res.status(404).json({ error: 'Trip not found' });
  const t = rows[0];
  const studentsRows = await query(`
    SELECT hs.MAHS, hs.TenHS, hs.MaDiemDung, dd.Vitri AS address, ctd.status
    FROM chitietchuyendi ctd
    JOIN hocsinh hs ON hs.MAHS = ctd.MAHS
    LEFT JOIN diemdung dd ON dd.MaDiemDung = hs.MaDiemDung
    WHERE ctd.MACD = ?
    ORDER BY hs.MAHS
  `, [macd]);
  const students = studentsRows.map((r, idx) => ({
    id: r.MAHS,
    name: r.TenHS,
    status: r.status || 'pending',
    pickupOrder: idx + 1,
    pickupAddress: r.address || 'Chưa có',
    dropAddress: r.address || 'Chưa có',
  }));
  const tripDto = {
    id: macd,
    routeName: t.routeName || `Chuyến ${macd}`,
    departTime: t.batdau,
    students,
  };
  res.json(tripDto);
}));

// Error handler last
app.use(errorHandler);

// Start server
server.listen(PORT, HOST, () => {
  console.log(`Server listening on ${HOST}:${PORT}`);
});
