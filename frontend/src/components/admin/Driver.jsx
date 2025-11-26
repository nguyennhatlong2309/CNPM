import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Driver.css";

const API = "http://localhost:8081/api/";

async function getDataDrivers() {
  try {
    const res = await axios.get(`${API}drivers`);
    console.log("Dữ liệu:", res.data);
    return res.data;
  } catch (err) {
    console.error("Lỗi:", err);
    return null;
  }
}

const examData = [
  {
    driverId: 1,
    driverName: "Nguyễn Văn Tài",
    plateNum: "SKS-1234",
    status: "Đang chạy",
    defaultRoute: "Tuyến A",
    starTime: "Ca sáng (06:30 - 08:00)",
    phoneNum: "0989542305",
  },
  {
    driverId: 2,
    driverName: "Trần Văn Lợi",
    plateNum: "NTT-3521",
    status: "Nghỉ",
    defaultRoute: "Tuyến B",
    starTime: "Không có ca làm việc",
    phoneNum: "0912345678",
  },
  {
    driverId: 3,
    driverName: "Dương Hoàng Nam",
    plateNum: "ABC-4567",
    status: "Đang chạy",
    defaultRoute: "Tuyến C",
    starTime: "Ca chiều (14:00 - 16:30)",
    phoneNum: "0908765432",
  },
];

function DriverManagement() {
  const [selectedDriverId, setSelectedDriverId] = useState(
    examData[0].driverId
  );
  const [driversData, setDriversData] = useState(examData);

  const selectedDriver = driversData.find(
    (driver) => driver.driverId === selectedDriverId
  );

  useEffect(() => {
    async function loadData() {
      const data = await getDataDrivers();
      if (data) setDriversData(data);
    }
    loadData();
  }, []);

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
                selectedDriverId === driver.driverId
                  ? "driver-row selected"
                  : "driver-row"
              }
              onClick={() => setSelectedDriverId(driver.driverId)}
            >
              <div>{index + 1}</div>
              <div>{driver.driverName}</div>
              <div>{driver.plateNum}</div>
              <div>{driver.status}</div>

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
                <b>{selectedDriver.driverName}</b>
              </div>
            </div>

            <div className="driver-info-group">
              <div className="driver-info-label">Trạng thái</div>
              <div className="driver-info-value">
                <b>{selectedDriver.status}</b>
              </div>
            </div>

            <div className="driver-info-group">
              <div className="driver-info-label">Tuyến đường</div>
              <div className="driver-info-value">
                {selectedDriver.defaultRoute}
              </div>
            </div>

            <div className="driver-info-group">
              <div className="driver-info-label">Giờ làm việc</div>
              <div className="driver-info-value">
                <b>{selectedDriver.starTime}</b>
              </div>
            </div>

            <div className="driver-info-group">
              <div className="driver-info-label">Biển số</div>
              <div className="driver-info-value">{selectedDriver.plateNum}</div>
            </div>

            <div className="driver-info-group">
              <div className="driver-info-label">Số điện thoại</div>
              <div className="driver-info-value">{selectedDriver.phoneNum}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DriverManagement;
