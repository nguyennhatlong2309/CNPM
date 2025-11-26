import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Bus.css";

const initialBusData = [];

const API = "http://localhost:8081/api/";

async function getBuses() {
  try {
    const res = await axios.get(`${API}buses`);
    console.log("Dữ liệu:", res.data);
    return res.data;
  } catch (err) {
    console.error("Lỗi:", err);
    return null;
  }
}

export default function BusManagement() {
  const [buses, setBuses] = useState(initialBusData);
  const [selectedBus, setSelectedBus] = useState(buses[0]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentBus, setCurrentBus] = useState(null);

  const filteredBuses = buses.filter((bus) =>
    bus.plateNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddBus = () => {
    setIsEditing(false);
    setCurrentBus({
      busId: Date.now(), // Tạo busId mới
      plateNumber: "",
      capacity: "",
      status: "Đang hoạt động",
      driver: "",
      soHocSinh: "",
      tuyenDuong: "",
      startTime: "",
    });
    setIsPopupOpen(true);
  };

  const handleEditBus = (bus) => {
    setIsEditing(true);
    const [currentSoHocSinh] = bus.soHocSinh.split("/");
    setCurrentBus({
      ...bus,
      soHocSinh: currentSoHocSinh, // Chỉ lấy số học sinh hiện tại
    });
    setIsPopupOpen(true);
  };

  const handleDeleteBus = (busbusId) => {
    setBuses(buses.filter((bus) => bus.busId !== busbusId));
    if (selectedBus.busId === busbusId) {
      setSelectedBus(buses.find((bus) => bus.busId !== busbusId) || null);
    }
  };

  const handleSaveBus = () => {
    const updatedBus = {
      ...currentBus,
      soHocSinh: `${currentBus.soHocSinh}/${currentBus.capacity}`, // Ghép lại
    };
    if (isEditing) {
      setBuses(
        buses.map((bus) => (bus.busId === currentBus.busId ? updatedBus : bus))
      );
      setSelectedBus(updatedBus);
    } else {
      setBuses([...buses, updatedBus]);
      setSelectedBus(updatedBus);
    }
    setIsPopupOpen();
    false;
  };

  const handleCancel = () => {
    setIsPopupOpen(false);
  };

  useEffect(() => {
    async function fetchData() {
      const data = await getBuses();
      if (data) {
        setBuses(data);
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
              key={bus.busId}
              className={
                selectedBus && selectedBus.busId === bus.busId
                  ? "bus-selected bus-table-row "
                  : " bus-table-row "
              }
              onClick={() => setSelectedBus(bus)}
            >
              <div>{index + 1}</div>
              <div>{bus.plateNumber}</div>
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
                    handleDeleteBus(bus.busId);
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
              <b>{selectedBus.plateNumber}</b>
            </div>
          </div>
          <div>
            <div className="bus-label">Tài xế</div>
            <div className="bus-value">
              <b>{selectedBus.driver}</b>
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
            <div className="bus-value">{selectedBus.defaultRoute}</div>
          </div>

          <div>
            <div className="bus-label">Thời gian khởi hành</div>
            <div className="bus-value">{selectedBus.startTime}</div>
          </div>
        </div>
      )}

      {isPopupOpen && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h2>{isEditing ? "Chỉnh sửa xe bus" : "Thêm xe bus mới"}</h2>
            <div className="popup-form">
              <label>
                Biển số:
                <input
                  type="text"
                  value={currentBus.plateNumber}
                  onChange={(e) =>
                    setCurrentBus({
                      ...currentBus,
                      plateNumber: e.target.value,
                    })
                  }
                />
              </label>
              <label>
                Số ghế:
                <input
                  type="number"
                  value={currentBus.capacity}
                  onChange={(e) =>
                    setCurrentBus({ ...currentBus, capacity: e.target.value })
                  }
                />
              </label>
              <label>
                Tình trạng:
                <select
                  value={currentBus.status}
                  onChange={(e) =>
                    setCurrentBus({ ...currentBus, status: e.target.value })
                  }
                >
                  <option value="Đang hoạt động">Đang hoạt động</option>
                  <option value="Bảo trì">Bảo trì</option>
                  <option value="Tạm dừng">Tạm dừng</option>
                </select>
              </label>
              <label>
                Tài xế: (không bắt buộc)
                <input
                  type="text"
                  value={currentBus.driver}
                  onChange={(e) =>
                    setCurrentBus({ ...currentBus, driver: e.target.value })
                  }
                />
              </label>

              <label>
                Tuyến đường:
                <input
                  type="text"
                  value={currentBus.tuyenDuong}
                  onChange={(e) =>
                    setCurrentBus({ ...currentBus, tuyenDuong: e.target.value })
                  }
                />
              </label>
              <label>
                Thời gian khởi hành:
                <input
                  type="time"
                  value={currentBus.startTime}
                  onChange={(e) =>
                    setCurrentBus({ ...currentBus, startTime: e.target.value })
                  }
                />
              </label>
            </div>
            <div className="popup-buttons">
              <button onClick={handleSaveBus}>Lưu</button>
              <button onClick={handleCancel}>Hủy</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
