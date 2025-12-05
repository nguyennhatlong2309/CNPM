const db = require("../config/db");
const User = require("../models/user.model");

exports.getAll = async () => {
  const [rows] = await db.query(`SELECT * FROM ${User.table}`);
  return rows;
};

exports.getById = async (id) => {
  const [rows] = await db.query(
    `SELECT * FROM ${User.table} WHERE user_id = ?`,
    [id]
  );
  return rows[0];
};

exports.create = async (data) => {
  const [result] = await db.query(`INSERT INTO ${User.table} SET ?`, data);
  return result.insertId;
};

exports.update = async (id, data) => {
  await db.query(`UPDATE ${User.table} SET ? WHERE user_id = ?`, [data, id]);
  return true;
};

exports.delete = async (id) => {
  await db.query(`DELETE FROM ${User.table} WHERE user_id = ?`, [id]);
  return true;
};
