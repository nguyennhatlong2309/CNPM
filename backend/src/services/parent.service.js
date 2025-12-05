const db = require("../config/db");
const Parent = require("../models/parent.model");

exports.getAll = async () => {
  const [rows] = await db.query(`SELECT * FROM ${Parent.table}`);
  return rows;
};

exports.getById = async (id) => {
  const [rows] = await db.query(
    `SELECT * FROM ${Parent.table} WHERE parent_id = ?`,
    [id]
  );
  return rows[0];
};

exports.create = async (data) => {
  const [result] = await db.query(`INSERT INTO ${Parent.table} SET ?`, data);
  return result.insertId;
};

exports.update = async (id, data) => {
  await db.query(`UPDATE ${Parent.table} SET ? WHERE parent_id = ?`, [
    data,
    id,
  ]);
  return true;
};

exports.delete = async (id) => {
  await db.query(`DELETE FROM ${Parent.table} WHERE parent_id = ?`, [id]);
  return true;
};
