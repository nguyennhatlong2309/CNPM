import React, { useState } from "react";
import "./Student.css";

const studentsData = [
  {
    id: 1,
    hoTen: "Trần Minh Hiếu",
    diaChi: "123 ABC",
    tinhTrang: "hoạt động",
    tuyenDuong: "Tuyến A",
    phuHuynh: "Trần Minh Quang ",
    soDienThoai: "0989542305",
    taiXePhuTrach: "Nguyễn Văn Tài",
    gioDonTra: "Đón 06:45 / Trả 17:10",
  },
  {
    id: 2,
    hoTen: "Nguyễn Thị Lan",
    diaChi: "456 DEF",
    tinhTrang: "không hoạt động",
    tuyenDuong: "Tuyến B",
    phuHuynh: "Nguyễn Văn An",
    soDienThoai: "0978345678",
    taiXePhuTrach: "Trần Văn Hùng",
    gioDonTra: "Đón 07:00 / Trả 17:15",
  },
  {
    id: 3,
    hoTen: "Lê Văn Cường",
    diaChi: "789 GHI",
    tinhTrang: "hoạt động",
    tuyenDuong: "Tuyến C",
    phuHuynh: "Lê Thị Mai",
    soDienThoai: "0961234567",
    taiXePhuTrach: "Phạm Văn Toàn",
    gioDonTra: "Đón 06:50 / Trả 17:20",
  },
  {
    id: 4,
    hoTen: "Trần Văn Minh",
    diaChi: "321 JKL",
    tinhTrang: "không hoạt động",
    tuyenDuong: "Tuyến D",
    phuHuynh: "Trần Văn Bình",
    soDienThoai: "0909876543",
    taiXePhuTrach: "Nguyễn Văn Dũng",
    gioDonTra: "Đón 07:10 / Trả 17:30",
  },
  {
    id: 5,
    hoTen: "Nguyễn Hòa Bình",
    diaChi: "654 MNO",
    tinhTrang: "hoạt động",
    tuyenDuong: "Tuyến E",
    phuHuynh: "Nguyễn Thị Hoa",
    soDienThoai: "0912345678",
    taiXePhuTrach: "Lê Văn Kiệt",
    gioDonTra: "Đón 07:20 / Trả 17:40",
  },
  {
    id: 6,
    hoTen: "Nguyễn Văn Sơn",
    diaChi: "987 PQR",
    tinhTrang: "không hoạt động",
    tuyenDuong: "Tuyến F",
    phuHuynh: "Nguyễn Văn Hòa",
    soDienThoai: "0923456789",
    taiXePhuTrach: "Trần Quốc Huy",
    gioDonTra: "Đón 07:30 / Trả 17:50",
  },
  {
    id: 7,
    hoTen: "Lê Thị Bích",
    diaChi: "111 STU",
    tinhTrang: "hoạt động",
    tuyenDuong: "Tuyến G",
    phuHuynh: "Lê Văn Trường",
    soDienThoai: "0934567890",
    taiXePhuTrach: "Nguyễn Hữu Công",
    gioDonTra: "Đón 07:40 / Trả 18:00",
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
    <div className="student-content">
      <div className="student-content-header">
        <input
          type="search"
          placeholder="Tìm kiếm"
          aria-label="Tìm kiếm học sinh"
          className="student-search-input"
        />
        <button className="student-btn-add">+ Thêm học sinh</button>
      </div>

      <div className="student-table">
        <div className="student-table-header">
          <div>STT</div>
          <div>Họ tên học sinh</div>
          <div>Địa chỉ</div>
          <div>Trạng thái</div>
          <div>Thao tác</div>
        </div>
        <div className="student-table-body">
          {students.map((student, idx) => (
            <div
              key={student.id}
              className={
                selectedId === student.id
                  ? "selected student-table-row"
                  : "student-table-row"
              }
              onClick={() => handleSelectStudent(student.id)}
              tabIndex={0}
              aria-selected={selectedId === student.id}
            >
              <div>{idx + 1}</div>
              <div>{student.hoTen}</div>
              <div>{student.diaChi}</div>
              <div>{student.tinhTrang}</div>
              <div className="actions">
                <button
                  aria-label={`Chỉnh sửa ${student.hoTen}`}
                  className="student-btn-icon"
                >
                  ✏️
                </button>
                <button
                  aria-label={`Xóa ${student.hoTen}`}
                  className="student-btn-icon"
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
              <b>{selectedStudent.hoTen}</b>
            </div>
          </div>

          <div className="student-info-gr">
            <div className="label">Tuyến đường</div>
            <div className="value">
              <b>{selectedStudent.tuyenDuong || "Tuyến A"}</b>
            </div>
          </div>
          <div className="student-info-gr">
            <div className="label">Trạng thái</div>
            <div className="value">
              <b>{selectedStudent.tinhTrang}</b>
            </div>
          </div>

          <div className="student-info-gr">
            <div className="label">Điểm đón/trả</div>
            <div className="value">
              <b>{selectedStudent.diaChi} - 123a</b>
            </div>
          </div>
          <div className="student-info-gr">
            <div className="label">Phụ huynh</div>
            <div className="value">
              <b>{selectedStudent.phuHuynh || ""}</b>
            </div>
          </div>
          <div className="student-info-gr">
            <div className="label">Số điện thoại</div>
            <div className="value">
              <b>{selectedStudent.soDienThoai || ""}</b>
            </div>
          </div>

          <div className="student-info-gr">
            <div className="label">Tài xế phụ trách</div>
            <div className="value">
              <b>{selectedStudent.taiXePhuTrach || ""}</b>
            </div>
          </div>
          <div className="student-info-gr">
            <div className="label">Giờ đón/trả</div>
            <div className="value">
              <b>{selectedStudent.gioDonTra || ""}</b>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
