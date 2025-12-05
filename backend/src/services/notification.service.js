const db = require("../config/db");
const Noti = require("../models/notification.model");

exports.getAll = async () => {
  const [rows] = await db.query(`SELECT * FROM ${Noti.table}`);
  return rows;
};

exports.getById = async (id) => {
  const [rows] = await db.query(
    `SELECT * FROM ${Noti.table} WHERE notifi_id = ?`,
    [id]
  );
  return rows[0];
};

exports.create = async (data) => {
  const [result] = await db.query(`INSERT INTO ${Noti.table} SET ?`, data);
  return result.insertId;
};

exports.update = async (id, data) => {
  await db.query(`UPDATE ${Noti.table} SET ? WHERE notifi_id = ?`, [data, id]);
  return true;
};

exports.delete = async (id) => {
  await db.query(`DELETE FROM ${Noti.table} WHERE notifi_id = ?`, [id]);
  return true;
};
