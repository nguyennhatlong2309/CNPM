const db = require("../config/db");
const SY = require("../models/schoolyear.model");

const formatDate = (date) => {
  if (!date) return null;
  return date.toISOString().split("T")[0]; // YYYY-MM-DD
};

exports.getAll = async () => {
  const [rows] = await db.query(`SELECT * FROM ${SY.table}`);
  // format các cột DATE
  return rows.map((r) => ({
    ...r,
    start_date: formatDate(r.start_date),
    end_date: formatDate(r.end_date),
  }));
};

exports.getById = async (id) => {
  const [rows] = await db.query(`SELECT * FROM ${SY.table} WHERE year_id = ?`, [
    id,
  ]);
  if (!rows[0]) return null;
  return {
    ...rows[0],
    start_date: formatDate(rows[0].start_date),
    end_date: formatDate(rows[0].end_date),
  };
};

exports.create = async (data) => {
  const [result] = await db.query(`INSERT INTO ${SY.table} SET ?`, data);
  return result.insertId;
};

exports.update = async (id, data) => {
  await db.query(`UPDATE ${SY.table} SET ? WHERE year_id = ?`, [data, id]);
  return true;
};

exports.delete = async (id) => {
  await db.query(`DELETE FROM ${SY.table} WHERE year_id = ?`, [id]);
  return true;
};
