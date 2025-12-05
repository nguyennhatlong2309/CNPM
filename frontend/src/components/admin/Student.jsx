import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Student.css";

const studentsData = [
  {
    studentId: 1,
    name: "Trần Minh Hiếu",
    defaultPickUpPointName: "123 ABCC",
    defaultDropOffPointName: "123 ABCC",
    status: "hoạt động",
    route: "Tuyến A",
    parentName: "Trần Minh Quang ",
    parentNum: "0989542305",
    defaultTimePickUp: "Đón 06:45",
    defaultTimeDropOff: "Trả 17:10",
  },
  {
    studentId: 2,
    name: "Nguyễn Thị Lan",
    defaultPickUpPointName: "456 DEF",
    defaultDropOffPointName: "456 DEF",
    status: "không hoạt động",
    route: "Tuyến B",
    parentName: "Nguyễn Văn An",
    parentNum: "0978345678",
    defaultTimePickUp: "Đón 07:00",
    defaultTimeDropOff: "Trả 17:15",
  },
  {
    studentId: 3,
    name: "Lê Văn Cường",
    defaultPickUpPointName: "789 GHI",
    defaultDropOffPointName: "789 GHI",
    status: "hoạt động",
    route: "Tuyến C",
    parentName: "Lê Thị Mai",
    parentNum: "0961234567",
    defaultTimePickUp: "Đón 06:50",
    defaultTimeDropOff: "Trả 17:15",
  },
  {
    studentId: 4,
    name: "Trần Văn Minh",
    defaultPickUpPointName: "321 JKL",
    defaultDropOffPointName: "321 JKL",
    status: "không hoạt động",
    route: "Tuyến D",
    parentName: "Trần Văn Bình",
    parentNum: "0909876543",
    defaultTimePickUp: "Đón 07:10",
    defaultTimeDropOff: "Trả 17:15",
  },
  {
    studentId: 5,
    name: "Nguyễn Hòa Bình",
    defaultPickUpPointName: "654 MNO",
    defaultDropOffPointName: "654 MNO",
    status: "hoạt động",
    route: "Tuyến E",
    parentName: "Nguyễn Thị Hoa",
    parentNum: "0912345678",
    defaultTimePickUp: "Đón 07:20",
    defaultTimeDropOff: "Trả 17:15",
  },
  {
    studentId: 6,
    name: "Nguyễn Văn Sơn",
    defaultPickUpPointName: "987 PQR",
    defaultDropOffPointName: "987 PQR",
    status: "không hoạt động",
    route: "Tuyến F",
    parentName: "Nguyễn Văn Hòa",
    parentNum: "0923456789",
    defaultTimePickUp: "Đón 07:30",
    defaultTimeDropOff: "Trả 17:15",
  },
  {
    studentId: 7,
    name: "Lê Thị Bích",
    defaultPickUpPointName: "111 STU",
    defaultDropOffPointName: "111 STU",
    status: "hoạt động",
    route: "Tuyến G",
    parentName: "Lê Văn Trường",
    parentNum: "0934567890",
    defaultTimePickUp: "Đón 07:40",
    defaultTimeDropOff: "Trả 17:15",
  },
];
const API = "http://localhost:8081/api/";

async function getDataStudents() {
  try {
    const res = await axios.get(`${API}students`);
    console.log("Dữ liệu:", res.data);
    return res.data;
  } catch (err) {
    console.error("Lỗi:", err);
    return null;
  }
}

export default function StudentManagement() {
  const [students, setDataStudents] = useState(studentsData);
  const [selectedId, setSelectedId] = useState(studentsData[0].studentId);

  const selectedStudent = students.find((st) => st.studentId === selectedId);

  const handleSelectStudent = (studentId) => {
    setSelectedId(studentId);
  };

  // useEffect(() => {
  //   async function loadData() {
  //     const data = await getDataStudents();
  //     if (data) setDataStudents(data);
  //   }
  //   loadData();
  // }, []);

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
          <div>Điểm đón</div>
          <div>điểm trả</div>
          <div>Trạng thái</div>
          <div>Thao tác</div>
        </div>
        <div className="student-table-body">
          {students.map((student, idx) => (
            <div
              key={student.studentId}
              className={
                selectedId === student.studentId
                  ? "selected student-table-row"
                  : "student-table-row"
              }
              onClick={() => handleSelectStudent(student.studentId)}
              tabIndex={0}
              aria-selected={selectedId === student.studentId}
            >
              <div>{idx + 1}</div>
              <div>{student.name}</div>
              <div>{student.defaultPickUpPointName}</div>
              <div>{student.defaultDropOffPointName}</div>
              <div>{student.status}</div>
              <div className="actions">
                <button
                  aria-label={`Chỉnh sửa ${student.name}`}
                  className="student-btn-icon"
                >
                  ✏️
                </button>
                <button
                  aria-label={`Xóa ${student.name}`}
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
              <b>{selectedStudent.name}</b>
            </div>
          </div>
          <div className="student-info-gr">
            <div className="label">Phụ huynh</div>
            <div className="value">
              <b>{selectedStudent.parentName || ""}</b>
            </div>
          </div>

          <div className="student-info-gr">
            <div className="label">Số điện thoại</div>
            <div className="value">
              <b>{selectedStudent.parentNum || ""}</b>
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
              <b>{selectedStudent.route || "Tuyến A"}</b>
            </div>
          </div>

          <div className="student-info-gr">
            <div className="label">Điểm đón</div>
            <div className="value">
              <b>{selectedStudent.defaultPickUpPointName}</b>
            </div>
          </div>

          <div className="student-info-gr">
            <div className="label">Điểm trả</div>
            <div className="value">
              <b>{selectedStudent.defaultDropOffPointName}</b>
            </div>
          </div>

          <div className="student-info-gr">
            <div className="label">Giờ đón/trả</div>
            <div className="value">
              <b>
                {`${selectedStudent.defaultTimePickUp} / ${selectedStudent.defaultTimeDropOff}` ||
                  ""}
              </b>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
