const db = require("../config/db");
const Trip = require("../models/trip.model");

exports.getAll = async () => {
  const [rows] = await db.query(`SELECT * FROM ${Trip.table}`);
  return rows;
};

exports.getById = async (id) => {
  const [rows] = await db.query(
    `SELECT * FROM ${Trip.table} WHERE trip_id = ?`,
    [id]
  );
  return rows[0];
};

exports.getMaxMinDate = async () => {
  const [rows] = await db.query(
    `SELECT 
       DATE_FORMAT(MIN(trip_date), '%Y-%m-%d') AS min_date,
       DATE_FORMAT(MAX(trip_date), '%Y-%m-%d') AS max_date
     FROM trip`
  );

  return rows[0]; // trả về { min_date: '2025-08-03', max_date: '2025-08-10' } ví dụ
};

exports.getByTimeRange = async (startDate, endDate) => {
  if (!startDate || !endDate)
    throw new Error("startDate và endDate là bắt buộc");

  const [rows] = await db.query(
    `SELECT * FROM ${Trip.table} 
     WHERE trip_date >= ? AND trip_date <= ? 
     ORDER BY trip_date ASC`,
    [startDate, endDate]
  );

  return rows;
};

exports.create = async (data) => {
  const [result] = await db.query(`INSERT INTO ${Trip.table} SET ?`, data);
  return result.insertId;
};

exports.update = async (id, data) => {
  await db.query(`UPDATE ${Trip.table} SET ? WHERE trip_id = ?`, [data, id]);
  return true;
};

exports.delete = async (id) => {
  await db.query(`DELETE FROM ${Trip.table} WHERE trip_id = ?`, [id]);
  return true;
};
