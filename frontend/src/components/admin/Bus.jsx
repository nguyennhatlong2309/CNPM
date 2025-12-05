import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Bus.css";

const API = "http://localhost:5000/api/";

async function getBuses_Routes() {
  try {
    const [buses, routes, drivers] = await Promise.all([
      axios.get(`${API}bus/WDNameRName`),
      axios.get(`${API}route`),
      axios.get(`${API}drivers`),
    ]);
    return {
      buses: buses.data,
      routes: routes.data,
      drivers: drivers.data,
    };
  } catch (err) {
    console.error("Lỗi:", err);
    return null;
  }
}

async function createBus(bus) {
  try {
    const res = await axios.post(`${API}bus`, bus);
    return res.data;
  } catch (error) {
    console.error("Create Bus Error:", error);
    throw error;
  }
}

async function updateBus(busId, bus) {
  try {
    const res = await axios.put(`${API}bus/${busId}`, bus);
    return res.data;
  } catch (error) {
    console.error("Update Bus Error:", error);
    throw error;
  }
}

async function deleteBus(busID) {
  try {
    const res = await axios.delete(`${API}bus/${busID}`);
    return res.data;
  } catch (error) {
    console.error("Delete Bus Error:", error);
    throw error;
  }
}

export default function BusManagement() {
  const [buses, setBuses] = useState([]);
  const [selectedBus, setSelectedBus] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentBus, setCurrentBus] = useState(null);
  const [routes, setRoutes] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [errors, setErrors] = useState({}); // Thêm state để theo dõi lỗi

  const filteredBuses = buses.filter((bus) =>
    bus.plate_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddBus = () => {
    setIsEditing(false);
    setCurrentBus({
      plate_number: "",
      capacity: "",
      status: "Hoạt động",
      driver_id: "",
      route_id: "",
      start_time: "",
    });
    setErrors({}); // Reset lỗi khi mở popup thêm
    setIsPopupOpen(true);
  };

  const handleEditBus = (bus) => {
    setIsEditing(true);
    setCurrentBus({
      ...bus,
    });
    setErrors({}); // Reset lỗi khi mở popup sửa
    setIsPopupOpen(true);
  };

  const handleDeleteBus = async (busId) => {
    // Thêm thông báo xác nhận trước khi xóa
    if (window.confirm("Bạn có chắc chắn muốn xóa xe bus này?")) {
      try {
        await deleteBus(busId);
        setBuses(buses.filter((bus) => bus.bus_id !== busId));
        if (selectedBus && selectedBus.bus_id === busId) {
          setSelectedBus(buses.find((bus) => bus.bus_id !== busId) || null);
        }
      } catch (error) {}
    }
  };

  const handleSaveBus = async () => {
    if (!currentBus) return;
    const newErrors = {};
    const plate_number = currentBus.plate_number.trim();

    if (!plate_number) {
      newErrors.plate_number = "Biển số không được để trống!";
    }

    const capacity = parseInt(currentBus.capacity);
    if (isNaN(capacity) || capacity <= 0 || capacity >= 100) {
      newErrors.capacity = "Số ghế phải là số nguyên lớn hơn 0 và nhỏ hơn 100!";
    }

    if (!currentBus.start_time) {
      newErrors.start_time = "Thời gian khởi hành không được để trống!";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});

    const busDTO = {
      plate_number: plate_number,
      model: null,
      capacity: capacity,
      status: currentBus.status === "Hoạt động" ? "1" : "0",
      route_id: currentBus.route_id ? Number(currentBus.route_id) : null,
      start_time: currentBus.start_time,
    };
    const driver = drivers.find((d) => d.driver_id == currentBus.driver_id);
    currentBus.driver_name = driver ? driver.driver_name : "";
    const route = routes.find((r) => r.route_id == currentBus.route_id);
    currentBus.route_name = route ? route.route_name : "";

    try {
      let savedBus;

      if (isEditing) {
        // PUT UPDATE
        savedBus = await updateBus(currentBus.bus_id, busDTO);
        console.log(busDTO, currentBus.bus_id);
        setBuses(
          buses.map((bus) =>
            bus.bus_id === currentBus.bus_id ? currentBus : bus
          )
        );

        setSelectedBus(currentBus);
      } else {
        // POST CREATE

        savedBus = await createBus(busDTO);
        currentBus.driver_name = setBuses([...buses, currentBus]);

        setSelectedBus(currentBus);
      }

      setIsPopupOpen(false);
    } catch (err) {
      alert("Lỗi lưu xe bus!");
      console.error(err);
    }
  };

  const handleCancel = () => {
    setIsPopupOpen(false);
  };

  const handleFieldChange = (field, value) => {
    setCurrentBus({ ...currentBus, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: undefined });
    }
  };

  useEffect(() => {
    async function fetchData() {
      const data = await getBuses_Routes();
      if (data) {
        data.buses.forEach((element) => {
          element.status = "1" ? "Hoạt động" : "Tạm ngưng";
        });

        setBuses(data.buses);
        console.log(data.buses);
        setRoutes(data.routes);

        setDrivers(data.drivers);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="bus-content">
      <div className="bus-title-row">
        <input
          className="bus-search-input"
          placeholder="Tìm kiếm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="bus-btn-add" onClick={handleAddBus}>
          + Thêm xe bus
        </button>
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
              key={bus.bus_id}
              className={
                selectedBus && selectedBus.bus_id === bus.bus_id
                  ? "bus-selected bus-table-row "
                  : " bus-table-row "
              }
              onClick={() => setSelectedBus(bus)}
            >
              <div>{index + 1}</div>
              <div>{bus.plate_number}</div>
              <div>{bus.capacity}</div>
              <div>{bus.status}</div>
              <div>
                <button
                  className="bus-btn-icon"
                  aria-label="Sửa"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditBus(bus);
                  }}
                >
                  ✏️
                </button>
                <button
                  className="bus-btn-icon"
                  aria-label="Xóa"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteBus(bus.bus_id);
                  }}
                >
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
              <b>{selectedBus.plate_number}</b>
            </div>
          </div>
          <div>
            <div className="bus-label">Tài xế</div>
            <div className="bus-value">
              <b>
                {selectedBus.driver_id} - {selectedBus.driver_name}
              </b>
            </div>
          </div>
          <div>
            <div className="bus-label">Trạng thái</div>
            <div className="bus-value">
              <b>{selectedBus.status}</b>
            </div>
          </div>
          <div>
            <div className="bus-label">Tuyến đường</div>
            <div className="bus-value">{selectedBus.route_name}</div>
          </div>
          <div>
            <div className="bus-label">Thời gian khởi hành</div>
            <div className="bus-value">{selectedBus.start_time}</div>
          </div>
        </div>
      )}

      {isPopupOpen && (
        <div className="bus-popup-overlay">
          <div className="bus-popup-content">
            <h2>{isEditing ? "Chỉnh sửa xe bus" : "Thêm xe bus mới"}</h2>
            <div className="bus-popup-form">
              <label>
                Biển số:
                <input
                  type="text"
                  value={currentBus.plate_number}
                  className={errors.plate_number ? "error" : ""}
                  onChange={(e) =>
                    handleFieldChange("plate_number", e.target.value)
                  }
                />
                {errors.plate_number && (
                  <div className="error-text">{errors.plate_number}</div>
                )}
              </label>
              <label>
                Số ghế:
                <input
                  type="number"
                  value={currentBus.capacity}
                  className={errors.capacity ? "error" : ""}
                  onChange={(e) =>
                    handleFieldChange("capacity", e.target.value)
                  }
                />
                {errors.capacity && (
                  <div className="error-text">{errors.capacity}</div>
                )}
              </label>
              <label>
                Tình trạng:
                <select
                  value={currentBus.status}
                  onChange={(e) =>
                    setCurrentBus({ ...currentBus, status: e.target.value })
                  }
                >
                  <option value="Hoạt động">Hoạt động</option>
                  <option value="Tạm dừng">Tạm dừng</option>
                </select>
              </label>
              <label>
                Tài xế: (không bắt buộc)
                <select
                  value={currentBus.driver_id ?? ""}
                  onChange={(e) =>
                    setCurrentBus({
                      ...currentBus,
                      driver_id: e.target.value,
                    })
                  }
                >
                  <option value="">None</option>
                  {drivers.map((driver) => (
                    <option key={driver.driver_id} value={driver.driver_id}>
                      {driver.driver_id} - {driver.driver_name}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Tuyến đường:
                <select
                  value={currentBus.route_id ?? ""}
                  onChange={(e) =>
                    handleFieldChange("route_id", e.target.value)
                  }
                >
                  <option value="">Chọn tuyến đường</option>
                  {routes.map((route) => (
                    <option key={route.route_id} value={route.route_id}>
                      {route.route_name}
                    </option>
                  ))}
                </select>
                {errors.route_id && (
                  <div className="error-text">{errors.route_id}</div>
                )}
              </label>
              <label>
                Thời gian khởi hành:
                <input
                  type="time"
                  value={currentBus.start_time}
                  className={errors.start_time ? "error" : ""}
                  onChange={(e) =>
                    handleFieldChange("start_time", e.target.value)
                  }
                />
                {errors.start_time && (
                  <div className="error-text">{errors.start_time}</div>
                )}
              </label>
            </div>
            <div className="bus-popup-buttons">
              <button onClick={handleSaveBus}>Lưu</button>
              <button onClick={handleCancel}>Hủy</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
