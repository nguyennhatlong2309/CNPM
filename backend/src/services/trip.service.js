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
