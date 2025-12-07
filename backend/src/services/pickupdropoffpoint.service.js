const db = require("../config/db");
const P = require("../models/pickupdropoffpoint.model");

exports.getAll = async () => {
  const [rows] = await db.query(
    `SELECT * FROM ${P.table} where is_delete = '0'`
  );
  return rows;
};

exports.getById = async (id) => {
  const [rows] = await db.query(`SELECT * FROM ${P.table} WHERE point_id = ?`, [
    id,
  ]);
  return rows[0];
};

exports.create = async (data) => {
  const [result] = await db.query(`INSERT INTO ${P.table} SET ?`, data);
  return result.insertId;
};

exports.createMultiple = async (points) => {
  console.log("helllo world");
  if (!points.length) return [];
  const values = points.map((p) => [
    p.point_name,
    p.latitude,
    p.longitude,
    p.order_in_route,
    p.route_id,
  ]);
  const [result] = await db.query(
    `INSERT INTO ${P.table} (point_name, latitude, longitude, order_in_route, route_id) VALUES ?`,
    [values]
  );
  return result.insertId; // id của bản ghi đầu tiên
};

exports.update = async (id, data) => {
  await db.query(`UPDATE ${P.table} SET ? WHERE point_id = ?`, [data, id]);
  return true;
};

exports.updateMultiple = async (points) => {
  try {
    for (const p of points) {
      const { point_id, ...data } = p; // tách ra rõ ràng hơn
      await db.query(`UPDATE ${P.table} SET ? WHERE point_id = ?`, [
        data,
        point_id,
      ]);
    }
    return true;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

exports.deletePoint = async (id) => {
  await db.query(`UPDATE ${P.table} SET is_delete = '1' WHERE point_id = ?`, [
    id,
  ]);
  return true;
};

exports.deleteMultiple = async (points) => {
  if (!points || !points.length) return 0;

  const ids = points.map((p) => p.point_id);

  if (!ids.length) return 0;

  const placeholders = ids.map(() => "?").join(",");
  await db.query(
    `UPDATE ${P.table} SET is_delete = '1' WHERE point_id IN (${placeholders})`,
    ids
  );

  return placeholders;
};

exports.delete = async (id) => {
  await db.query(`DELETE FROM ${P.table} WHERE point_id = ?`, [id]);
  return true;
};
