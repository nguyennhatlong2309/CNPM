import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Student.css";

const API = "http://localhost:5000/api/";

async function getDataStudents() {
  try {
    const [students, routes, points, parents] = await Promise.all([
      axios.get(`${API}student/FL`),
      axios.get(`${API}route`),
      axios.get(`${API}point`),
      axios.get(`${API}parent`),
    ]);
    return {
      students: students.data,
      routes: routes.data,
      points: points.data,
      parents: parents.data,
    };
  } catch (err) {
    console.error("Lỗi:", err);
    return null;
  }
}

async function addStudent(newStudent) {
  try {
    const res = await axios.post(`${API}student`, newStudent);
    return res.data;
  } catch (err) {
    console.error("Lỗi thêm học sinh:", err);
    return null;
  }
}

async function updateStudent(studentId, updatedStudent) {
  try {
    const res = await axios.put(`${API}student/${studentId}`, updatedStudent);
    return res.data;
  } catch (err) {
    console.error("Lỗi cập nhật học sinh:", err);
    return null;
  }
}

async function deleteStudent(studentId) {
  try {
    await axios.delete(`${API}student/${studentId}`);
    return true;
  } catch (err) {
    console.error("Lỗi xóa học sinh:", err);
    return false;
  }
}

export default function StudentManagement() {
  const [students, setDataStudents] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [points, setPoints] = useState([]);
  const [parents, setParents] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    student_name: "",
    parent_id: "",
    phone: "",
    status: "",
    route_id: "",
    pickup_point_id: "",
    dropoff_point_id: "",
    pickuptime: "",
    dropofftime: "",
  });
  const [errors, setErrors] = useState({});

  const selectedStudent = students.find((st) => st.student_id === selectedId);

  const loadData = async () => {
    const data = await getDataStudents();
    if (data.students) {
      data.students.forEach((element) => {
        element.status =
          element.status == "1" ? "Hoạt động" : "Không hoạt động";
      });
      setDataStudents(data.students);
      console.log(data.students);
      setRoutes(data.routes);
      setPoints(data.points);
      setParents(data.parents);
      if (data.students.length > 0 && !selectedId) {
        setSelectedId(data.students[0].student_id);
      }
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Reset pickup và dropoff point khi route_id thay đổi
  useEffect(() => {
    if (formData.route_id && !isEditing) {
      setFormData((prev) => ({
        ...prev,
        pickup_point_id: "",
        dropoff_point_id: "",
      }));
    }
  }, [formData.route_id, isEditing]);

  const handleSelectStudent = (student_id) => {
    setSelectedId(student_id);
  };

  // Mở popup cho thêm mới
  const handleAddClick = () => {
    setIsEditing(false);
    setFormData({
      student_name: "",
      parent_id: "",
      status: "Hoạt động",
      route_id: "",
      pickup_point_id: "",
      dropoff_point_id: "",
      pickuptime: "",
      dropofftime: "",
    });
    setErrors({});
    setIsPopupOpen(true);
  };

  // Mở popup cho chỉnh sửa
  const handleEditClick = (student) => {
    setIsEditing(true);

    setFormData({
      student_id: student.student_id,
      student_name: student.student_name || "",
      parent_id: student.parent_id || "",
      status: student.status || "",
      route_id: student.route_id || "",
      pickup_point_id: student.pickup_point_id || "",
      dropoff_point_id: student.dropoff_point_id || "",
      pickuptime: student.pickuptime || "",
      dropofftime: student.dropofftime || "",
    });
    setErrors({});
    setIsPopupOpen(true);
  };

  // Xử lý xóa học sinh
  const handleDeleteClick = async (studentId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa học sinh này?")) {
      const success = await deleteStudent(studentId);
      if (success) {
        setDataStudents(
          students.filter((student) => student.student_id !== studentId)
        );
        if (selectedId === studentId) {
          setSelectedId(students[0]?.student_id || null);
        }
      }
    }
  };

  // Xử lý lưu form
  const handleSave = async () => {
    const newErrors = {};
    const student_name = formData.student_name.trim();
    if (!student_name) {
      newErrors.student_name = "Họ tên học sinh không được để trống!";
    }

    const parent_id = formData.parent_id;
    if (!parent_id) {
      newErrors.parent_id = "Phụ huynh không được để trống!";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});

    // Chuẩn bị DTO gửi lên backend
    const studentDTO = {
      student_name: student_name,
      parent_id: Number(formData.parent_id),
      status: formData.status == "Hoạt động" ? "1" : "0",
      pickup_point_id: formData.pickup_point_id
        ? Number(formData.pickup_point_id)
        : null,
      dropoff_point_id: formData.dropoff_point_id
        ? Number(formData.dropoff_point_id)
        : null,
      pickuptime: formData.pickuptime,
      dropofftime: formData.dropofftime,
    };

    try {
      let savedStudent;
      if (isEditing) {
        savedStudent = await updateStudent(formData.student_id, studentDTO);
        await loadData();
        setSelectedId(formData.student_id);
      } else {
        savedStudent = await addStudent(studentDTO);
        await loadData();
        if (savedStudent && savedStudent.student_id) {
          setSelectedId(savedStudent.student_id);
        }
      }
      // setIsPopupOpen(false);
    } catch (err) {
      console.error("Lỗi lưu học sinh:", err);
      alert("Không thể lưu học sinh. Vui lòng thử lại.");
    }
  };

  // Xử lý thay đổi input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: undefined });
    }
  };

  return (
    <div className="student-content">
      <div className="student-content-header">
        <input
          type="search"
          placeholder="Tìm kiếm"
          aria-label="Tìm kiếm học sinh"
          className="student-search-input"
        />
        <button className="student-btn-add" onClick={handleAddClick}>
          + Thêm học sinh
        </button>
      </div>

      <div className="student-table">
        <div className="student-table-header">
          <div>STT</div>
          <div>Họ tên học sinh</div>
          <div>Phụ huynh</div>
          <div>Số điện thoại</div>
          <div>Trạng thái</div>
          <div>Thao tác</div>
        </div>
        <div className="student-table-body">
          {students.map((student, idx) => (
            <div
              key={student.student_id}
              className={
                selectedId === student.student_id
                  ? "selected student-table-row"
                  : "student-table-row"
              }
              onClick={() => handleSelectStudent(student.student_id)}
              tabIndex={0}
              aria-selected={selectedId === student.student_id}
            >
              <div>{idx + 1}</div>
              <div>{student.student_name}</div>
              <div>{student.parent_name}</div>
              <div>{student.phone}</div>
              <div>{student.status}</div>
              <div className="actions">
                <button
                  aria-label={`Chỉnh sửa ${student.student_name}`}
                  className="student-btn-icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditClick(student);
                  }}
                >
                  ✏️
                </button>
                <button
                  aria-label={`Xóa ${student.student_name}`}
                  className="student-btn-icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteClick(student.student_id);
                  }}
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedStudent && (
        <div className="student-detail">
          <div className="student-info-gr">
            <div className="label">Họ tên</div>
            <div className="value">
              <b>{selectedStudent.student_name}</b>
            </div>
          </div>
          <div className="student-info-gr">
            <div className="label">Phụ huynh</div>
            <div className="value">
              <b>
                {parents.find((p) => p.parent_id == selectedStudent.parent_id)
                  ?.parent_name || ""}
              </b>
            </div>
          </div>

          <div className="student-info-gr">
            <div className="label">Số điện thoại</div>
            <div className="value">
              <b>
                {parents.find((p) => p.parent_id == selectedStudent.parent_id)
                  ?.phone || ""}
              </b>
            </div>
          </div>

          <div className="student-info-gr">
            <div className="label">Trạng thái</div>
            <div className="value">
              <b>{selectedStudent.status}</b>
            </div>
          </div>

          <div className="student-info-gr">
            <div className="label">Tuyến đường</div>
            <div className="value">
              <b>
                {routes.find((r) => r.route_id == selectedStudent.route_id)
                  ?.route_name || ""}
              </b>
            </div>
          </div>

          <div className="student-info-gr">
            <div className="label">Điểm đón</div>
            <div className="value">
              <b>
                {points.find(
                  (p) => p.point_id == selectedStudent.pickup_point_id
                )?.point_name || ""}
              </b>
            </div>
          </div>

          <div className="student-info-gr">
            <div className="label">Điểm trả</div>
            <div className="value">
              <b>
                {points.find(
                  (p) => p.point_id == selectedStudent.dropoff_point_id
                )?.point_name || ""}
              </b>
            </div>
          </div>

          <div className="student-info-gr">
            <div className="label">Giờ đón/trả</div>
            <div className="value">
              <b>
                {`${selectedStudent.pickuptime} / ${selectedStudent.dropofftime}` ||
                  ""}
              </b>
            </div>
          </div>
        </div>
      )}

      {/* Popup Modal */}
      {isPopupOpen && (
        <div
          className="student-popup-overlay"
          onClick={() => setIsPopupOpen(false)}
        >
          <div
            className="student-popup-content"
            onClick={(e) => e.stopPropagation()}
          >
            <h2>{isEditing ? "Chỉnh sửa học sinh" : "Thêm học sinh"}</h2>
            <form>
              <div className="student-form-group">
                <label>Họ tên học sinh:</label>
                <input
                  type="text"
                  name="student_name"
                  value={formData.student_name}
                  className={errors.student_name ? "error" : ""}
                  onChange={handleInputChange}
                  required
                />
                {errors.student_name && (
                  <div className="error-text">{errors.student_name}</div>
                )}
              </div>

              <div className="student-form-group">
                <label>Phụ huynh:</label>
                <select
                  name="parent_id"
                  value={formData.parent_id}
                  onChange={handleInputChange}
                  className={errors.parent_id ? "error" : ""}
                  required
                >
                  <option value="">-- Chọn phụ huynh --</option>
                  {parents.map((pr) => (
                    <option key={pr.parent_id} value={pr.parent_id}>
                      {pr.parent_name}
                    </option>
                  ))}
                </select>
                {errors.parent_id && (
                  <div className="error-text">{errors.parent_id}</div>
                )}
              </div>
              <div className="student-form-group">
                <label>Trạng thái:</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  required
                >
                  <option value="Hoạt động">Hoạt động</option>
                  <option value="Không hoạt động">Không hoạt động</option>
                </select>
              </div>
              <div className="student-form-group">
                <label>Tuyến đường:</label>
                <select
                  name="route_id"
                  value={formData.route_id}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">-- Chọn tuyến đường --</option>
                  {routes.map((route) => (
                    <option key={route.route_id} value={route.route_id}>
                      {route.route_name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="student-form-row">
                <div className="student-form-group student-form-col">
                  <label>Điểm đón:</label>
                  <select
                    name="pickup_point_id"
                    value={formData.pickup_point_id}
                    onChange={handleInputChange}
                    disabled={!formData.route_id}
                    required
                  >
                    <option value="">-- Chọn điểm đón --</option>
                    {points
                      .filter((p) => p.route_id == formData.route_id)
                      .map((p) => (
                        <option key={p.point_id} value={p.point_id}>
                          {p.point_name}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="student-form-group student-form-col">
                  <label>Điểm trả:</label>
                  <select
                    name="dropoff_point_id"
                    value={formData.dropoff_point_id}
                    onChange={handleInputChange}
                    disabled={!formData.route_id}
                    required
                  >
                    <option value="">-- Chọn điểm trả --</option>
                    {points
                      .filter((p) => p.route_id == formData.route_id)
                      .map((p) => (
                        <option key={p.point_id} value={p.point_id}>
                          {p.point_name}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div className="student-form-row">
                <div className="student-form-group student-form-col">
                  <label>Giờ đón:</label>
                  <input
                    type="time"
                    name="pickuptime"
                    value={formData.pickuptime}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="student-form-group student-form-col">
                  <label>Giờ trả:</label>
                  <input
                    type="time"
                    name="dropofftime"
                    value={formData.dropofftime}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </form>
            <div className="student-popup-actions">
              <button onClick={handleSave}>Lưu</button>
              <button onClick={() => setIsPopupOpen(false)}>Hủy</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
