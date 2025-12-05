const db = require("../config/db");
const Student = require("../models/student.model");

exports.getAll = async () => {
  const [rows] = await db.query(`SELECT * FROM ${Student.table}`);
  return rows;
};

exports.getById = async (id) => {
  const [rows] = await db.query(
    `SELECT * FROM ${Student.table} WHERE student_id = ?`,
    [id]
  );
  return rows[0];
};

exports.create = async (data) => {
  const [result] = await db.query(`INSERT INTO ${Student.table} SET ?`, data);
  return result.insertId;
};

exports.update = async (id, data) => {
  await db.query(`UPDATE ${Student.table} SET ? WHERE student_id = ?`, [
    data,
    id,
  ]);
  return true;
};

exports.delete = async (id) => {
  await db.query(`DELETE FROM ${Student.table} WHERE student_id = ?`, [id]);
  return true;
};
