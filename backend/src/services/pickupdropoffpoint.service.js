const db = require("../config/db");
const P = require("../models/pickupdropoffpoint.model");

exports.getAll = async () => {
  const [rows] = await db.query(`SELECT * FROM ${P.table}`);
  return rows;
};

exports.getById = async (id) => {
  const [rows] = await db.query(`SELECT * FROM ${P.table} WHERE point_id = ?`, [
    id,
  ]);
  return rows[0];
};

exports.create = async (data) => {
  const [result] = await db.query(`INSERT INTO ${P.table} SET ?`, data);
  return result.insertId;
};

exports.update = async (id, data) => {
  await db.query(`UPDATE ${P.table} SET ? WHERE point_id = ?`, [data, id]);
  return true;
};

exports.delete = async (id) => {
  await db.query(`DELETE FROM ${P.table} WHERE point_id = ?`, [id]);
  return true;
};
