import React, { useState } from "react";
import "./Bus.css";

const busData = [
  {
    id: 1,
    bienSo: "SKS-1234",
    soGhe: 25,
    tinhTrang: "Đang hoạt động",
    taiXe: "Nguyễn Văn Tài",
    soHocSinh: "12/25",
    tuyenDuong: "Tuyến A",
    khoiHanh: "06:30",
  },
  {
    id: 2,
    bienSo: "LST-5678",
    soGhe: 30,
    tinhTrang: "Bảo trì",
    taiXe: "Trần Văn B",
    soHocSinh: "15/30",
    tuyenDuong: "Tuyến B",
    khoiHanh: "07:00",
  },
  {
    id: 3,
    bienSo: "SMM-2034",
    soGhe: 30,
    tinhTrang: "Đang hoạt động",
    taiXe: "Lê Thị C",
    soHocSinh: "28/30",
    tuyenDuong: "Tuyến C",
    khoiHanh: "06:45",
  },
  {
    id: 4,
    bienSo: "ABC-4567",
    soGhe: 45,
    tinhTrang: "Đang hoạt động",
    taiXe: "Phạm Văn D",
    soHocSinh: "43/45",
    tuyenDuong: "Tuyến D",
    khoiHanh: "06:50",
  },
  {
    id: 5,
    bienSo: "DEF-1234",
    soGhe: 25,
    tinhTrang: "Tạm dừng",
    taiXe: "Hoàng Thị E",
    soHocSinh: "0/25",
    tuyenDuong: "Tuyến E",
    khoiHanh: "N/A",
  },
];

export default function BusManagement() {
  const [selectedBus, setSelectedBus] = useState(busData[0]);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredBuses = busData.filter((bus) =>
    bus.bienSo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="title-row">
        <input
          className="search-input"
          placeholder="Tìm kiếm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="btn-add">+ Thêm xe bus</button>
      </div>
      <table className="bus-table">
        <thead>
          <tr>
            <th>STT</th>
            <th>Biển số</th>
            <th>Số ghế</th>
            <th>Tình trạng</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {filteredBuses.map((bus, index) => (
            <tr
              key={bus.id}
              className={selectedBus.id === bus.id ? "selected" : ""}
              onClick={() => setSelectedBus(bus)}
            >
              <td>{index + 1}</td>
              <td>{bus.bienSo}</td>
              <td>{bus.soGhe}</td>
              <td>{bus.tinhTrang}</td>
              <td>
                <button className="btn-icon" aria-label="Sửa">
                  ✏️
                </button>
                <button className="btn-icon" aria-label="Xóa">
                  🗑️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedBus && (
        <div className="bus-detail">
          <div>
            <div className="label">Biển số</div>
            <div className="value">
              <b>{selectedBus.bienSo}</b>
            </div>
          </div>
          <div>
            <div className="label">Tài xế</div>
            <div className="value">
              <b>{selectedBus.taiXe}</b>
            </div>
          </div>
          <div>
            <div className="label">Trạng thái</div>
            <div className="value">
              <b>{selectedBus.tinhTrang}</b>
            </div>
          </div>
          <div>
            <div className="label">Tuyến đường</div>
            <div className="value">{selectedBus.tuyenDuong}</div>
          </div>
          <div>
            <div className="label">Số học sinh</div>
            <div className="value">{selectedBus.soHocSinh}</div>
          </div>
          <div>
            <div className="label">Thời gian khởi hành</div>
            <div className="value">{selectedBus.khoiHanh}</div>
          </div>

          <button className="btn-edit">Chỉnh sửa</button>
        </div>
      )}
    </div>
  );
}
