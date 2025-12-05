const db = require("../config/db");
const Driver = require("../models/drivers.model");

exports.getAll = async () => {
  const [rows] = await db.query(`SELECT * FROM ${Driver.table}`);
  return rows;
};

exports.getAllWBusRouteUser = async () => {
  const [rows] =
    await db.query(`select d.*,b.bus_id,b.plate_number,b.start_time,r.route_id,r.route_name from driver d 
left join bus b on d.bus_id = b.bus_id 
left join route r on r.route_id = b.route_id
left join user u on u.user_id = d.user_id`);
  return rows;
};

exports.getById = async (id) => {
  const [rows] = await db.query(
    `SELECT * FROM ${Driver.table} WHERE driver_id = ?`,
    [id]
  );
  return rows[0];
};

exports.create = async (data) => {
  const [result] = await db.query(`INSERT INTO ${Driver.table} SET ?`, data);
  return result.insertId;
};

exports.update = async (id, data) => {
  await db.query(`UPDATE ${Driver.table} SET ? WHERE driver_id = ?`, [
    data,
    id,
  ]);
  return true;
};

exports.delete = async (id) => {
  await db.query(`DELETE FROM ${Driver.table} WHERE driver_id = ?`, [id]);
  return true;
};
