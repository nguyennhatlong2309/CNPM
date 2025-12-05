import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Driver.css";

const API = "http://localhost:5000/api/";

async function getDataDrivers() {
  try {
    const [drivers, buses] = await Promise.all([
      axios.get(`${API}drivers/getAllWBusRouteUser`),
      axios.get(`${API}bus`),
    ]);
    return {
      drivers: drivers.data,
      buses: buses.data,
    };
  } catch (err) {
    console.error("Lỗi:", err);
    return null;
  }
}

async function addDriver(newDriver) {
  try {
    const res = await axios.post(`${API}drivers`, newDriver);
    return res.data;
  } catch (err) {
    console.error("Lỗi thêm tài xế:", err);
    return null;
  }
}

async function updateDriver(driverId, updatedDriver) {
  try {
    const res = await axios.put(`${API}drivers/${driverId}`, updatedDriver);
    return res.data;
  } catch (err) {
    console.error("Lỗi cập nhật tài xế:", err);
    return null;
  }
}

async function deleteDriver(driverId) {
  try {
    await axios.delete(`${API}drivers/${driverId}`);
    return true;
  } catch (err) {
    console.error("Lỗi xóa tài xế:", err);
    return false;
  }
}

const examData = [];

function DriverManagement() {
  const [selectedDriverId, setSelectedDriverId] = useState(null);
  const [driversData, setDriversData] = useState([]);
  const [buses, setBuses] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    driver_name: "",
    phone: "",
    status: "",
    bus_id: "",
  });

  const selectedDriver = driversData.find(
    (driver) => driver.driver_id === selectedDriverId
  );

  const loadData = async () => {
    const data = await getDataDrivers();
    if (data.drivers) {
      data.drivers.forEach((element) => {
        element.status = element.status == "1" ? "Hoạt động" : "Tạm ngưng";
      });
      setDriversData(data.drivers);
      console.log(data.drivers);
      setBuses(data.buses);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Mở popup cho thêm mới
  const handleAddClick = () => {
    setIsEditing(false);
    setFormData({
      driver_name: "",
      phone: "",
      status: "Hoạt động",
      bus_id: "",
    });
    setIsPopupOpen(true);
  };

  // Mở popup cho chỉnh sửa
  const handleEditClick = (driver) => {
    setIsEditing(true);
    setFormData({
      driver_id: driver.driver_id,
      driver_name: driver.driver_name || "",
      phone: driver.phone || "",
      status: driver.status || "",
      bus_id: driver.bus_id || "",
    });
    setIsPopupOpen(true);
  };

  // Xử lý xóa tài xế
  const handleDeleteClick = async (driverId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa tài xế này?")) {
      const success = await deleteDriver(driverId);
      if (success) {
        setDriversData(
          driversData.filter((driver) => driver.driver_id !== driverId)
        );
        if (selectedDriverId === driverId) {
          setSelectedDriverId(driversData[0]?.driver_id || null);
        }
      }
    }
  };

  // Xử lý lưu form
  const handleSave = async () => {
    // Chuẩn bị DTO gửi lên backend
    const driverDTO = {
      driver_name: formData.driver_name,
      phone: formData.phone,
      status: formData.status == "Hoạt động" ? "1" : "0",
      bus_id: formData.bus_id ? Number(formData.bus_id) : null,
    };

    try {
      let savedDriver;

      if (isEditing) {
        savedDriver = await updateDriver(formData.driver_id, driverDTO);

        await loadData();
        setSelectedDriverId(formData.driver_id);
      } else {
        // CREATE
        savedDriver = await addDriver(driverDTO);

        await loadData();
        if (savedDriver && savedDriver.driver_id) {
          setSelectedDriverId(savedDriver.driver_id);
        }
      }
      setIsPopupOpen(false);
    } catch (err) {
      console.error("Lỗi lưu tài xế:", err);
      alert("Không thể lưu tài xế. Vui lòng thử lại.");
    }
  };

  // Xử lý thay đổi input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="driver-content">
      <div className="driver-content-header">
        <input
          type="search"
          placeholder="Tìm kiếm"
          aria-label="Tìm kiếm tài xế"
          className="driver-search-input"
        />
        <button className="driver-btn-add" onClick={handleAddClick}>
          + Thêm tài xế
        </button>
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
                selectedDriverId === driver.driver_id
                  ? "driver-row selected"
                  : "driver-row"
              }
              onClick={() => setSelectedDriverId(driver.driver_id)}
            >
              <div>{index + 1}</div>
              <div>{driver.driver_name}</div>
              <div>{driver.plate_number}</div>
              <div>{driver.status}</div>
              <div className="driver-actions">
                <button
                  className="driver-btn-icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditClick(driver);
                  }}
                >
                  ✏️
                </button>
                <button
                  className="driver-btn-icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteClick(driver.driver_id);
                  }}
                >
                  🗑️
                </button>
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
                <b>{selectedDriver.driver_name}</b>
              </div>
            </div>
            <div className="driver-info-group">
              <div className="driver-info-label">Trạng thái</div>
              <div className="driver-info-value">
                <b>{selectedDriver.status}</b>
              </div>
            </div>
            <div className="driver-info-group">
              <div className="driver-info-label">Số điện thoại</div>
              <div className="driver-info-value">{selectedDriver.phone}</div>
            </div>
            <div className="driver-info-group">
              <div className="driver-info-label">Biển số</div>
              <div className="driver-info-value">
                {selectedDriver.plate_number}
              </div>
            </div>
            <div className="driver-info-group">
              <div className="driver-info-label">Tuyến đường</div>
              <div className="driver-info-value">
                {selectedDriver.route_name}
              </div>
            </div>
            <div className="driver-info-group">
              <div className="driver-info-label">Giờ làm việc</div>
              <div className="driver-info-value">
                <b>{selectedDriver.start_time}</b>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Popup Modal */}
      {isPopupOpen && (
        <div
          className="driver-popup-overlay"
          onClick={() => setIsPopupOpen(false)}
        >
          <div
            className="driver-popup-content"
            onClick={(e) => e.stopPropagation()}
          >
            <h2>{isEditing ? "Chỉnh sửa tài xế" : "Thêm tài xế"}</h2>
            <form>
              <div className="driver-form-group">
                <label>Họ tên:</label>
                <input
                  type="text"
                  name="driver_name"
                  value={formData.driver_name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="driver-form-group">
                <label>Số điện thoại:</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="driver-form-group">
                <label>Trạng thái:</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  required
                >
                  <option value="Hoạt động">Hoạt động</option>
                  <option value="Tạm ngưng">Tạm ngưng</option>
                </select>
              </div>
              <div className="driver-form-group">
                <label>Xe Bus:</label>
                <select
                  name="bus_id"
                  value={formData.bus_id}
                  onChange={handleInputChange}
                  required
                >
                  <option value="" disabled>
                    -- Chọn xe bus --
                  </option>
                  <option value="">None</option>

                  {buses.map((bus) => (
                    <option key={bus.bus_id} value={bus.bus_id}>
                      {bus.plate_number}
                    </option>
                  ))}
                </select>
              </div>
            </form>
            <div className="driver-popup-actions">
              <button onClick={handleSave}>Lưu</button>
              <button onClick={() => setIsPopupOpen(false)}>Hủy</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DriverManagement;
