const db = require("../config/db");
const DT = require("../models/detailtrips.model");

exports.getAll = async () => {
  const [rows] = await db.query(`SELECT * FROM ${DT.table}`);
  return rows;
};

exports.getById = async (id) => {
  const [rows] = await db.query(
    `SELECT * FROM ${DT.table} WHERE detail_id = ?`,
    [id]
  );
  return rows[0];
};

exports.create = async (data) => {
  const [result] = await db.query(`INSERT INTO ${DT.table} SET ?`, data);
  return result.insertId;
};

exports.update = async (id, data) => {
  await db.query(`UPDATE ${DT.table} SET ? WHERE detail_id = ?`, [data, id]);
  return true;
};

exports.delete = async (id) => {
  await db.query(`DELETE FROM ${DT.table} WHERE detail_id = ?`, [id]);
  return true;
};
