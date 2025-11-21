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
  {
    id: 6,
    bienSo: "SMM-2034",
    soGhe: 30,
    tinhTrang: "Đang hoạt động",
    taiXe: "Lê Thị C",
    soHocSinh: "28/30",
    tuyenDuong: "Tuyến C",
    khoiHanh: "06:45",
  },
  {
    id: 7,
    bienSo: "ABC-4567",
    soGhe: 45,
    tinhTrang: "Đang hoạt động",
    taiXe: "Phạm Văn D",
    soHocSinh: "43/45",
    tuyenDuong: "Tuyến D",
    khoiHanh: "06:50",
  },
];

export default function BusManagement() {
  const [selectedBus, setSelectedBus] = useState(busData[0]);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredBuses = busData.filter((bus) =>
    bus.bienSo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bus-content">
      <div className="bus-title-row">
        <input
          className="bus-search-input"
          placeholder="Tìm kiếm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="bus-btn-add">+ Thêm xe bus</button>
      </div>
      <div className="bus-table">
        <div className="bus-table-header">
          <div>STT</div>
          <div>Biển số</div>
          <div>Số ghế</div>
          <div>Tình trạng</div>
          <div>Thao tác</div>
        </div>

        <div className="bus-table-body">
          {filteredBuses.map((bus, index) => (
            <div
              key={bus.id}
              className={
                selectedBus.id === bus.id
                  ? "bus-selected bus-table-row "
                  : " bus-table-row "
              }
              onClick={() => setSelectedBus(bus)}
            >
              <div>{index + 1}</div>
              <div>{bus.bienSo}</div>
              <div>{bus.soGhe}</div>
              <div>{bus.tinhTrang}</div>
              <div>
                <button className="bus-btn-icon" aria-label="Sửa">
                  ✏️
                </button>
                <button className="bus-btn-icon" aria-label="Xóa">
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedBus && (
        <div className="bus-detail">
          <div>
            <div className="bus-label">Biển số</div>
            <div className="bus-value">
              <b>{selectedBus.bienSo}</b>
            </div>
          </div>
          <div>
            <div className="bus-label">Tài xế</div>
            <div className="bus-value">
              <b>{selectedBus.taiXe}</b>
            </div>
          </div>
          <div>
            <div className="bus-label">Trạng thái</div>
            <div className="bus-value">
              <b>{selectedBus.tinhTrang}</b>
            </div>
          </div>
          <div>
            <div className="bus-label">Tuyến đường</div>
            <div className="bus-value">{selectedBus.tuyenDuong}</div>
          </div>
          <div>
            <div className="bus-label">Số học sinh</div>
            <div className="bus-value">{selectedBus.soHocSinh}</div>
          </div>
          <div>
            <div className="bus-label">Thời gian khởi hành</div>
            <div className="bus-value">{selectedBus.khoiHanh}</div>
          </div>
        </div>
      )}
    </div>
  );
}
