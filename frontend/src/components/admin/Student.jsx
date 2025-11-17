import React, { useState } from "react";
import "./Student.css";

const studentsData = [
  {
    id: 1,
    hoTen: "Trần Minh Hiếu",
    diaChi: "123 ABC",
    tinhTrang: "Đã đón",
    tuyenDuong: "Tuyến A",
    phuHuynh: "Trần Minh Quang",
    soDienThoai: "0989542305",
    taiXePhuTrach: "Nguyễn Văn Tài",
    gioDonTra: "Đón 06:45 / Trả 17:10",
  },
  {
    id: 2,
    hoTen: "Trần Văn Lợi",
    diaChi: "321 BCD",
    tinhTrang: "Đã trả",
  },
  {
    id: 3,
    hoTen: "Dương Hoàng Nam",
    diaChi: "12 DEF",
    tinhTrang: "Nghỉ",
  },
  {
    id: 4,
    hoTen: "Lê Hoàng Long",
    diaChi: "156 AFG",
    tinhTrang: "Đã đón",
  },
];

export default function StudentManagement() {
  const [students] = useState(studentsData);
  const [selectedId, setSelectedId] = useState(studentsData[0].id);

  const selectedStudent = students.find((st) => st.id === selectedId);

  const handleSelectStudent = (id) => {
    setSelectedId(id);
  };

  return (
    <div
      className="student-management-container"
      style={{ border: "1px solid black" }}
    >
      <main className="main-content">
        <section className="student-management">
          <div className="title-row">
            <input
              type="search"
              placeholder="Tìm kiếm"
              aria-label="Tìm kiếm học sinh"
              className="search-input"
            />
            <button className="btn-add">+ Thêm học sinh</button>
          </div>

          <table
            className="student-table"
            role="grid"
            aria-label="Danh sách học sinh"
          >
            <thead>
              <tr>
                <th>STT</th>
                <th>Họ tên học sinh</th>
                <th>Địa chỉ</th>
                <th>Tình trạng</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, idx) => (
                <tr
                  key={student.id}
                  className={selectedId === student.id ? "selected" : ""}
                  onClick={() => handleSelectStudent(student.id)}
                  role="row"
                  tabIndex={0}
                  aria-selected={selectedId === student.id}
                >
                  <td>{idx + 1}</td>
                  <td>{student.hoTen}</td>
                  <td>{student.diaChi}</td>
                  <td>{student.tinhTrang}</td>
                  <td className="actions">
                    <button
                      aria-label={`Chỉnh sửa ${student.hoTen}`}
                      className="btn-icon"
                    >
                      ✏️
                    </button>
                    <button
                      aria-label={`Xóa ${student.hoTen}`}
                      className="btn-icon"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {selectedStudent && (
            <div className="student-detail">
              <div className="detail-row">
                <div>
                  <div className="label">Họ tên</div>
                  <div className="value">
                    <b>{selectedStudent.hoTen}</b>
                  </div>
                </div>
                <div>
                  <div className="label">Tuyến đường</div>
                  <div className="value">
                    <b>{selectedStudent.tuyenDuong || "Tuyến A"}</b>
                  </div>
                </div>
                <div>
                  <div className="label">Trạng thái</div>
                  <div className="value">
                    <b>{selectedStudent.tinhTrang}</b>
                  </div>
                </div>
                <button className="btn-edit">Chỉnh sửa</button>
              </div>

              <div className="detail-row">
                <div>
                  <div className="label">Địa chỉ</div>
                  <div className="value">
                    <b>{selectedStudent.diaChi}</b>
                  </div>
                </div>
                <div>
                  <div className="label">Phụ huynh</div>
                  <div className="value">
                    <b>{selectedStudent.phuHuynh || ""}</b>
                  </div>
                </div>
                <div>
                  <div className="label">Số điện thoại</div>
                  <div className="value">
                    <b>{selectedStudent.soDienThoai || ""}</b>
                  </div>
                </div>
              </div>

              <div className="detail-row">
                <div>
                  <div className="label">Tài xế phụ trách</div>
                  <div className="value">
                    <b>{selectedStudent.taiXePhuTrach || ""}</b>
                  </div>
                </div>
                <div>
                  <div className="label">Giờ đón/trả</div>
                  <div className="value">
                    <b>{selectedStudent.gioDonTra || ""}</b>
                  </div>
                </div>
                <div></div>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
