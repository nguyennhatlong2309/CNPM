const db = require("../config/db");
const SY = require("../models/schoolyear.model");

exports.getAll = async () => {
  const [rows] = await db.query(`SELECT * FROM ${SY.table}`);
  return rows;
};

exports.getById = async (id) => {
  const [rows] = await db.query(`SELECT * FROM ${SY.table} WHERE year_id = ?`, [
    id,
  ]);
  return rows[0];
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
