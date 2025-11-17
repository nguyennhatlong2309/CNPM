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
];

function DriverManagement() {
  const [selectedDriverId, setSelectedDriverId] = useState(driversData[0].id);

  const selectedDriver = driversData.find(
    (driver) => driver.id === selectedDriverId
  );

  return (
    <main className="main-content">
      <section className="driver-management">
        <div className="title-row">
          <input
            type="search"
            placeholder="Tìm kiếm"
            aria-label="Tìm kiếm tài xế"
            className="search-input"
          />
          <button className="btn-add">+ Thêm tài xế</button>
        </div>
        <table className="driver-table" role="grid">
          <thead>
            <tr>
              <th>STT</th>
              <th>Họ tên tài xế</th>
              <th>Biển số</th>
              <th>Tình trạng</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {driversData.map((driver, index) => (
              <tr
                className={
                  selectedDriverId === driver.id ? "selected" : undefined
                }
                key={driver.id}
                onClick={() => setSelectedDriverId(driver.id)}
                role="row"
                tabIndex={0}
                aria-selected={selectedDriverId === driver.id}
              >
                <td>{index + 1}</td>
                <td>{driver.hoTen}</td>
                <td>{driver.bienSo}</td>
                <td>{driver.trangThai}</td>
                <td className="actions">
                  <button
                    aria-label={`Chỉnh sửa tài xế ${driver.hoTen}`}
                    className="btn-icon"
                  >
                    ✏️
                  </button>
                  <button
                    aria-label={`Xóa tài xế ${driver.hoTen}`}
                    className="btn-icon"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {selectedDriver && (
          <div className="driver-details">
            <div className="avatar-large" aria-hidden="true">
              {/* Ảnh mẫu */}
              <img
                src="https://i.ibb.co/VVqfwhr/driver-avatar.png"
                alt=""
                aria-hidden="true"
              />
            </div>

            <div className="info-group">
              <div className="info-label">Họ tên</div>
              <div className="info-value">
                <b>{selectedDriver.hoTen}</b>
              </div>
            </div>

            <div className="info-group">
              <div className="info-label">Trạng thái</div>
              <div className="info-value">
                <b>{selectedDriver.trangThai}</b>
              </div>
            </div>

            <div className="info-group">
              <div className="info-label">Tuyến đường</div>
              <div className="info-value">{selectedDriver.tuyenDuong}</div>
            </div>

            <div className="info-group">
              <div className="info-label">Lịch làm việc hôm nay</div>
              <div className="info-value">
                <b>{selectedDriver.lichLamViec}</b>
              </div>
            </div>

            <div className="info-group">
              <div className="info-label">Biển số</div>
              <div className="info-value">{selectedDriver.bienSo}</div>
            </div>

            <div className="info-group">
              <div className="info-label">Số điện thoại</div>
              <div className="info-value">{selectedDriver.soDienThoai}</div>
            </div>

            <button className="btn-edit">Chỉnh sửa</button>
          </div>
        )}
      </section>
    </main>
  );
}

export default DriverManagement;
