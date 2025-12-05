const db = require("../config/db");
const Incident = require("../models/incidents.model");

exports.getAll = async () => {
  const [rows] = await db.query(`SELECT * FROM ${Incident.table}`);
  return rows;
};

exports.getById = async (id) => {
  const [rows] = await db.query(
    `SELECT * FROM ${Incident.table} WHERE incident_id = ?`,
    [id]
  );
  return rows[0];
};

exports.create = async (data) => {
  const [result] = await db.query(`INSERT INTO ${Incident.table} SET ?`, data);
  return result.insertId;
};

exports.update = async (id, data) => {
  await db.query(`UPDATE ${Incident.table} SET ? WHERE incident_id = ?`, [
    data,
    id,
  ]);
  return true;
};

exports.delete = async (id) => {
  await db.query(`DELETE FROM ${Incident.table} WHERE incident_id = ?`, [id]);
  return true;
};
