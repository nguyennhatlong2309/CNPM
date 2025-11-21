import React, { useState } from "react";
import "./Driver.css";

const driversData = [
  {
    id: 1,
    hoTen: "Nguyễn Văn Tài",
    bienSo: "SKS-1234",
    trangThai: "Đang chạy",
    tuyenDuong: "Tuyến A",
    lichLamViec: "Ca sáng (06:30 - 08:00)",
    soDienThoai: "0989542305",
  },
  {
    id: 2,
    hoTen: "Trần Văn Lợi",
    bienSo: "NTT-3521",
    trangThai: "Nghỉ",
    tuyenDuong: "Tuyến B",
    lichLamViec: "Không có ca làm việc",
    soDienThoai: "0912345678",
  },
  {
    id: 3,
    hoTen: "Dương Hoàng Nam",
    bienSo: "ABC-4567",
    trangThai: "Đang chạy",
    tuyenDuong: "Tuyến C",
    lichLamViec: "Ca chiều (14:00 - 16:30)",
    soDienThoai: "0908765432",
  },
  {
    id: 4,
    hoTen: "Lê Hoàng Long",
    bienSo: "TTT-115",
    trangThai: "Gặp sự cố",
    tuyenDuong: "Tuyến D",
    lichLamViec: "Ca tối (18:30 - 20:30)",
    soDienThoai: "0977123456",
  },
  {
    id: 1,
    hoTen: "Nguyễn Văn Tài",
    bienSo: "SKS-1234",
    trangThai: "Đang chạy",
    tuyenDuong: "Tuyến A",
    lichLamViec: "Ca sáng (06:30 - 08:00)",
    soDienThoai: "0989542305",
  },
  {
    id: 2,
    hoTen: "Trần Văn Lợi",
    bienSo: "NTT-3521",
    trangThai: "Nghỉ",
    tuyenDuong: "Tuyến B",
    lichLamViec: "Không có ca làm việc",
    soDienThoai: "0912345678",
  },
  {
    id: 3,
    hoTen: "Dương Hoàng Nam",
    bienSo: "ABC-4567",
    trangThai: "Đang chạy",
    tuyenDuong: "Tuyến C",
    lichLamViec: "Ca chiều (14:00 - 16:30)",
    soDienThoai: "0908765432",
  },
  {
    id: 4,
    hoTen: "Lê Hoàng Long",
    bienSo: "TTT-115",
    trangThai: "Gặp sự cố",
    tuyenDuong: "Tuyến D",
    lichLamViec: "Ca tối (18:30 - 20:30)",
    soDienThoai: "0977123456",
  },
  {
    id: 3,
    hoTen: "Dương Hoàng Nam",
    bienSo: "ABC-4567",
    trangThai: "Đang chạy",
    tuyenDuong: "Tuyến C",
    lichLamViec: "Ca chiều (14:00 - 16:30)",
    soDienThoai: "0908765432",
  },
  {
    id: 4,
    hoTen: "Lê Hoàng Long",
    bienSo: "TTT-115",
    trangThai: "Gặp sự cố",
    tuyenDuong: "Tuyến D",
    lichLamViec: "Ca tối (18:30 - 20:30)",
    soDienThoai: "0977123456",
  },
  {
    id: 1,
    hoTen: "Nguyễn Văn Tài",
    bienSo: "SKS-1234",
    trangThai: "Đang chạy",
    tuyenDuong: "Tuyến A",
    lichLamViec: "Ca sáng (06:30 - 08:00)",
    soDienThoai: "0989542305",
  },
  {
    id: 2,
    hoTen: "Trần Văn Lợi",
    bienSo: "NTT-3521",
    trangThai: "Nghỉ",
    tuyenDuong: "Tuyến B",
    lichLamViec: "Không có ca làm việc",
    soDienThoai: "0912345678",
  },
  {
    id: 3,
    hoTen: "Dương Hoàng Nam",
    bienSo: "ABC-4567",
    trangThai: "Đang chạy",
    tuyenDuong: "Tuyến C",
    lichLamViec: "Ca chiều (14:00 - 16:30)",
    soDienThoai: "0908765432",
  },
  {
    id: 4,
    hoTen: "Lê Hoàng Long",
    bienSo: "TTT-115",
    trangThai: "Gặp sự cố",
    tuyenDuong: "Tuyến D",
    lichLamViec: "Ca tối (18:30 - 20:30)",
    soDienThoai: "0977123456",
  },
];

function DriverManagement() {
  const [selectedDriverId, setSelectedDriverId] = useState(driversData[0].id);

  const selectedDriver = driversData.find(
    (driver) => driver.id === selectedDriverId
  );

  return (
    <div className="driver-content">
      <div className="driver-content-header">
        <input
          type="search"
          placeholder="Tìm kiếm"
          aria-label="Tìm kiếm tài xế"
          className="driver-search-input"
        />

        <button className="driver-btn-add">+ Thêm tài xế</button>
      </div>
      <div className="driver-table">
        <div className="driver-table-header">
          <div>STT</div>
          <div>Họ tên tài xế</div>
          <div>Biển số</div>
          <div>Tình trạng</div>
          <div>Thao tác</div>
        </div>
        <div className="driver-table-body">
          {driversData.map((driver, index) => (
            <div
              key={index}
              className={
                selectedDriverId === driver.id
                  ? "driver-row selected"
                  : "driver-row"
              }
              onClick={() => setSelectedDriverId(driver.id)}
            >
              <div>{index + 1}</div>
              <div>{driver.hoTen}</div>
              <div>{driver.bienSo}</div>
              <div>{driver.trangThai}</div>

              <div className="driver-actions">
                <button className="driver-btn-icon">✏️</button>
                <button className="driver-btn-icon">🗑️</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedDriver && (
        <div className="driver-details">
          <div className="driver-details-avt">
            <div className="driver-avatar-large" aria-hidden="true">
              <img
                src="https://i.ibb.co/VVqfwhr/driver-avatar.png"
                alt=""
                aria-hidden="true"
              />
            </div>
          </div>

          <div className="driver-details-info">
            <div className="driver-info-group">
              <div className="driver-info-label">Họ tên</div>
              <div className="driver-info-value">
                <b>{selectedDriver.hoTen}</b>
              </div>
            </div>

            <div className="driver-info-group">
              <div className="driver-info-label">Trạng thái</div>
              <div className="driver-info-value">
                <b>{selectedDriver.trangThai}</b>
              </div>
            </div>

            <div className="driver-info-group">
              <div className="driver-info-label">Tuyến đường</div>
              <div className="driver-info-value">
                {selectedDriver.tuyenDuong}
              </div>
            </div>

            <div className="driver-info-group">
              <div className="driver-info-label">Lịch làm việc hôm nay</div>
              <div className="driver-info-value">
                <b>{selectedDriver.lichLamViec}</b>
              </div>
            </div>

            <div className="driver-info-group">
              <div className="driver-info-label">Biển số</div>
              <div className="driver-info-value">{selectedDriver.bienSo}</div>
            </div>

            <div className="driver-info-group">
              <div className="driver-info-label">Số điện thoại</div>
              <div className="driver-info-value">
                {selectedDriver.soDienThoai}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DriverManagement;
