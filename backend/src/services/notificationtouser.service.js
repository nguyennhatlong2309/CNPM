const db = require("../config/db");
const NTU = require("../models/notificationtouser.model");

exports.getAll = async () => {
  const [rows] = await db.query(`SELECT * FROM ${NTU.table}`);
  return rows;
};

exports.getById = async (id) => {
  const [rows] = await db.query(
    `SELECT * FROM ${NTU.table} WHERE notificationtouser_id = ?`,
    [id]
  );
  return rows[0];
};

exports.create = async (data) => {
  const [result] = await db.query(`INSERT INTO ${NTU.table} SET ?`, data);
  return result.insertId;
};

exports.update = async (id, data) => {
  await db.query(`UPDATE ${NTU.table} SET ? WHERE notificationtouser_id = ?`, [
    data,
    id,
  ]);
  return true;
};

exports.delete = async (id) => {
  await db.query(`DELETE FROM ${NTU.table} WHERE notificationtouser_id = ?`, [
    id,
  ]);
  return true;
};
