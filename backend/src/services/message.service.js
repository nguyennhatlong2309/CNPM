const db = require("../config/db");
const Msg = require("../models/message.model");

exports.getAll = async () => {
  const [rows] = await db.query(`SELECT * FROM ${Msg.table}`);
  return rows;
};

exports.getById = async (id) => {
  const [rows] = await db.query(
    `SELECT * FROM ${Msg.table} WHERE mess_id = ?`,
    [id]
  );
  return rows[0];
};

exports.create = async (data) => {
  const [result] = await db.query(`INSERT INTO ${Msg.table} SET ?`, data);
  return result.insertId;
};

exports.update = async (id, data) => {
  await db.query(`UPDATE ${Msg.table} SET ? WHERE mess_id = ?`, [data, id]);
  return true;
};

exports.delete = async (id) => {
  await db.query(`DELETE FROM ${Msg.table} WHERE mess_id = ?`, [id]);
  return true;
};
