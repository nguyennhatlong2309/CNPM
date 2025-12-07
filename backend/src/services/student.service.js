const db = require("../config/db");
const Student = require("../models/student.model");

exports.getAll = async () => {
  const [rows] = await db.query(`SELECT * FROM ${Student.table}`);
  return rows;
};

exports.getAllFL = async () => {
  const [rows] =
    await db.query(`select s.*,p.parent_id,p.parent_name,u.phone,pi.point_name,r.route_id,r.route_name from student s 
left join parent p on p.parent_id = s.parent_id
left join user u on u.user_id = p.user_id
left join pickupdropoffpoint pi on pi.point_id = s.pickup_point_id 
left join route r on r.route_id = pi.route_id`);
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
