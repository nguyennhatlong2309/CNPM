const db = require("../config/db");
const Bus = require("../models/bus.model");

exports.getAll = async () => {
  const [rows] = await db.query(`SELECT * FROM ${Bus.table}`);
  return rows;
};

exports.getAllWDnameRName = async () => {
  const [rows] =
    await db.query(`select b.bus_id,b.plate_number,b.capacity,b.model,b.status,b.route_id,b.start_time,d.driver_id,d.driver_name,r.route_name 
from bus b
left join driver d on b.bus_id = d.bus_id
left join route r on r.route_id = b.route_id`);
  return rows;
};

exports.getById = async (id) => {
  const [rows] = await db.query(`SELECT * FROM ${Bus.table} WHERE bus_id = ?`, [
    id,
  ]);
  return rows[0];
};

exports.create = async (data) => {
  const [result] = await db.query(`INSERT INTO ${Bus.table} SET ?`, data);
  return result.insertId;
};

exports.update = async (id, data) => {
  await db.query(`UPDATE ${Bus.table} SET ? WHERE bus_id = ?`, [data, id]);
  return true;
};

exports.delete = async (id) => {
  await db.query(`DELETE FROM ${Bus.table} WHERE bus_id = ?`, [id]);
  return true;
};
