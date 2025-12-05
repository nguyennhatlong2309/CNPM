const db = require("../config/db");
const Route = require("../models/route.model");

exports.getAll = async () => {
  const [rows] = await db.query(`SELECT * FROM ${Route.table}`);
  return rows;
};

exports.getById = async (id) => {
  const [rows] = await db.query(
    `SELECT * FROM ${Route.table} WHERE route_id = ?`,
    [id]
  );
  return rows[0];
};

exports.create = async (data) => {
  const [result] = await db.query(`INSERT INTO ${Route.table} SET ?`, data);
  return result.insertId;
};

exports.update = async (id, data) => {
  await db.query(`UPDATE ${Route.table} SET ? WHERE route_id = ?`, [data, id]);
  return true;
};

exports.delete = async (id) => {
  await db.query(`DELETE FROM ${Route.table} WHERE route_id = ?`, [id]);
  return true;
};
