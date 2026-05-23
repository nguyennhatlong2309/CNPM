import React, { useMemo, useEffect, useState } from "react";
import axios from "axios";
import "./Schedule.css";

const API = "http://localhost:5000/api/";

const dayOfWeek = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "CN"];

// ============================= FETCH =============================
async function getListYear_Routes() {
  try {
    const [years, routes, drivers, buses, maxMinDate] = await Promise.all([
      axios.get(`${API}route`),
      axios.get(`${API}drivers`),
      axios.get(`${API}bus`),
      axios.get(`${API}trip/MaxMinDate`),
    ]);
    return {
      years: years.data,
      routes: routes.data,
      drivers: drivers.data,
      buses: buses.data, // Thêm buses
      maxMinDate: maxMinDate.data || maxMinDate,
    };
  } catch (error) {
    console.error("Lỗi:", error);
    return null;
  }
}

async function getTripBydate(selectedWeek, weeks) {
  const week = weeks.find((w) => w.id == selectedWeek);
  if (!week) return [];

  const start = week.start.toISOString().split("T")[0];
  const end = week.end.toISOString().split("T")[0];
  try {
    const res = await axios.get(
      `${API}trip/time-range?startDate=${start}&endDate=${end}`
    );
    return res.data;
  } catch (error) {
    console.error("Lỗi:", error);
    return [];
  }
}

async function updateTrip(tripID, trip) {}

// ============================= FUNCTIONS =============================
function formatDateDD_MM_YYYY(date) {
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

function covertToWeeks(maxMinDate) {
  if (!maxMinDate) return [];
  let start_date = new Date(maxMinDate.min_date);
  let end_date = new Date(maxMinDate.max_date);

  while (start_date.getDay() !== 1) {
    start_date.setDate(start_date.getDate() - 1);
  }

  const weeks = [];
  let i = 0;
  let current = new Date(start_date);

  while (current <= end_date) {
    i++;
    const endWeek = new Date(current);
    endWeek.setDate(endWeek.getDate() + 6);

    weeks.push({
      id: i,
      start: new Date(current),
      end: endWeek,
    });

    current.setDate(current.getDate() + 7);
  }

  return weeks;
}

// Chuyển tuần thành các ngày (header) dựa vào tuần được chọn
function convertWeekToDay(week) {
  if (!week) return [];
  const daysInWeek = [];
  const current = new Date(week.start);
  let i = 0;

  while (current <= week.end && i < 7) {
    const dd = String(current.getDate()).padStart(2, "0");
    const mm = String(current.getMonth() + 1).padStart(2, "0");
    daysInWeek.push(`${dayOfWeek[i]} - ${dd}/${mm}`);
    current.setDate(current.getDate() + 1);
    i++;
  }

  return daysInWeek;
}

// ============================= COMPONENT =============================
const CellTable = ({ listDriver, id, onEditTrip }) => {
  if (!listDriver || listDriver.length === 0)
    return <div className="empty-cell"></div>;

  return (
    <div id={id}>
      {listDriver.map((driver) => (
        <div
          key={`${driver.driver_id}_${driver.trip_id}`}
          className="driver-chip"
          onClick={() => onEditTrip(driver)}
        >
          {driver.driver_name}
        </div>
      ))}
    </div>
  );
};

const ScheduleManager = () => {
  const [routes, setRoutes] = useState([]);
  const [maxMinDate, setMaxMinDate] = useState(null);
  const [selectedWeekID, setSelectedWeekID] = useState(1);
  const [drivers, setDrivers] = useState([]);
  const [buses, setBuses] = useState([]);

  const listWeeks = useMemo(() => covertToWeeks(maxMinDate), [maxMinDate]);
  const currentWeek = useMemo(
    () => listWeeks.find((w) => w.id == selectedWeekID),
    [listWeeks, selectedWeekID]
  );

  const days = useMemo(() => convertWeekToDay(currentWeek), [currentWeek]);

  const [showAddMenu, setShowAddMenu] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMode, setPopupMode] = useState("");

  const [formData, setFormData] = useState({
    tripId: "",
    date: "",
    driverId: "",
    busId: "",
    routeId: "",
    departureTime: "",
  });

  const [tripsByWeek, setTripsByWeek] = useState([]);
  const [editingTrip, setEditingTrip] = useState(null);

  function getDriversForRouteAndDay(routeId, dayString) {
    if (!tripsByWeek || tripsByWeek.length === 0 || !maxMinDate) return [];

    const [dd, mm] = dayString.split(" - ")[1].split("/");
    const year = new Date(maxMinDate.min_date).getFullYear();
    const dayDate = `${year}-${mm}-${dd}`;

    return tripsByWeek
      .filter(
        (trip) =>
          trip.route_id === routeId && trip.trip_date.split("T")[0] === dayDate
      )
      .map((trip) => {
        const driver = drivers.find((d) => d.driver_id === trip.driver_id);
        return {
          driver_id: trip.driver_id,
          trip_id: trip.trip_id,
          driver_name: driver ? driver.driver_name : `Driver ${trip.driver_id}`,
        };
      });
  }

  useEffect(() => {
    async function getData() {
      const data = await getListYear_Routes();
      setRoutes(data.routes);
      setDrivers(data.drivers);
      setBuses(data.buses);
      setMaxMinDate(data.maxMinDate);
    }
    getData();
  }, []);

  useEffect(() => {
    async function getTrips() {
      const data = await getTripBydate(selectedWeekID, listWeeks);
      setTripsByWeek(data);
    }
    getTrips();
  }, [selectedWeekID, listWeeks]);

  const handleEditTrip = (driver) => {
    const trip = tripsByWeek.find((t) => t.trip_id === driver.trip_id);
    if (trip) {
      setFormData({
        tripId: trip.trip_id,
        date: trip.trip_date.split("T")[0],
        driverId: trip.driver_id,
        busId: trip.bus_id,
        routeId: trip.route_id,
        departureTime: trip.departure_time,
      });
      setEditingTrip(trip);
      setPopupMode("edit");
      setShowPopup(true);
    }
  };

  const openPopup = (mode) => {
    setPopupMode(mode);
    setShowPopup(true);
    if (mode === "add") {
      setFormData({
        tripId: "",
        date: "",
        driverId: "",
        busId: "",
        routeId: "",
        departureTime: "",
      });
    }
  };

  const closePopup = () => {
    setShowPopup(false);
    setPopupMode("");
    setEditingTrip(null);
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        trip_date: formData.date,
        driver_id: formData.driverId,
        bus_id: formData.busId,
        route_id: formData.routeId,
        departure_time: formData.departureTime,
      };
      if (popupMode === "add") {
        await axios.post(`${API}trip`, payload);
        alert("Thêm lịch trình thành công!");
      } else if (popupMode === "edit") {
        await axios.put(`${API}trip/${formData.tripId}`, payload);
        alert("Chỉnh sửa thành công!");
      }
      closePopup();
      const data = await getTripBydate(selectedWeekID, listWeeks);
      setTripsByWeek(data);
    } catch (error) {
      console.error("Lỗi submit:", error);
      alert("Có lỗi xảy ra!");
    }
  };

  return (
    <div className="schedule-content">
      <div className="schedule-controls">
        <select
          className="schedule-week-picker"
          value={selectedWeekID}
          onChange={(e) => setSelectedWeekID(e.target.value)}
        >
          {listWeeks.map((w) => (
            <option key={w.id} value={w.id}>
              Tuần {w.id} ({formatDateDD_MM_YYYY(w.start)} -{" "}
              {formatDateDD_MM_YYYY(w.end)})
            </option>
          ))}
        </select>

        <div className="schedule-dropdown">
          <button
            className="schedule-btn-edit"
            onClick={() => openPopup("edit")}
          >
            Chỉnh sửa
          </button>
        </div>

        <div
          className="schedule-dropdown"
          onMouseEnter={() => setShowAddMenu(true)}
          onMouseLeave={() => setShowAddMenu(false)}
        >
          <button className="schedule-btn-add">
            + Thêm mới
          </button>
          {showAddMenu && (
            <div className="schedule-dropdown-menu">
              <button onClick={() => openPopup("add")}>
                Thêm mới lịch trình
              </button>
              <button>Thêm tuần lịch trình mặc định</button>
            </div>
          )}
        </div>
      </div>

      {showPopup && (
        <div className="schedule-popup-overlay">
          <div className="schedule-popup-content">
            <h2>
              {popupMode === "add" ? "Thêm lịch trình" : "Chỉnh sửa lịch trình"}
            </h2>
            {popupMode === "add" ? (
              <div>
                <div className="schedule-form-group">
                  <label>Ngày:</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="schedule-form-group">
                  <label>Tài xế:</label>
                  <select
                    value={formData.driverId}
                    onChange={(e) =>
                      setFormData({ ...formData, driverId: e.target.value })
                    }
                    required
                  >
                    <option value="">Chọn tài xế</option>
                    {drivers.map((driver) => (
                      <option key={driver.driver_id} value={driver.driver_id}>
                        {driver.driver_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="schedule-form-group">
                  <label>Xe buýt:</label>
                  <select
                    value={formData.busId}
                    onChange={(e) =>
                      setFormData({ ...formData, busId: e.target.value })
                    }
                    required
                  >
                    <option value="">Chọn xe buýt</option>
                    {buses.map((bus) => (
                      <option key={bus.bus_id} value={bus.bus_id}>
                        {bus.bus_name || `Bus ${bus.bus_id}`}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="schedule-form-group">
                  <label>Tuyến đường:</label>
                  <select
                    value={formData.routeId}
                    onChange={(e) =>
                      setFormData({ ...formData, routeId: e.target.value })
                    }
                    required
                  >
                    <option value="">Chọn tuyến đường</option>
                    {routes.map((route) => (
                      <option key={route.route_id} value={route.route_id}>
                        {route.route_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="schedule-form-group">
                  <label>Giờ xuất phát:</label>
                  <input
                    type="time"
                    value={formData.departureTime}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        departureTime: e.target.value,
                      })
                    }
                    required
                  />
                </div>
              </div>
            ) : (
              <div className="schedule-form-cols">
                <div className="schedule-form-col">
                  <h3>Thông tin hiện tại</h3>
                  <div>
                    <div className="schedule-info-item">
                      <div className="schedule-info-label">Ngày:</div>
                      <div className="schedule-info-value">{editingTrip ? editingTrip.trip_date.split("T")[0] : ""}</div>
                    </div>
                    <div className="schedule-info-item">
                      <div className="schedule-info-label">Tài xế:</div>
                      <div className="schedule-info-value">{drivers.find(
                        (d) => d.driver_id === editingTrip?.driver_id
                      )?.driver_name || ""}</div>
                    </div>
                    <div className="schedule-info-item">
                      <div className="schedule-info-label">Xe buýt:</div>
                      <div className="schedule-info-value">{buses.find((b) => b.bus_id === editingTrip?.bus_id)
                        ?.bus_name || `Bus ${editingTrip?.bus_id}`}</div>
                    </div>
                    <div className="schedule-info-item">
                      <div className="schedule-info-label">Tuyến đường:</div>
                      <div className="schedule-info-value">{routes.find((r) => r.route_id === editingTrip?.route_id)
                        ?.route_name || ""}</div>
                    </div>
                    <div className="schedule-info-item">
                      <div className="schedule-info-label">Giờ xuất phát:</div>
                      <div className="schedule-info-value">{editingTrip ? editingTrip.departure_time : ""}</div>
                    </div>
                  </div>
                </div>
                <div className="schedule-form-col">
                  <h3>Thông tin mới</h3>
                  <div>
                    <div className="schedule-form-group">
                      <label>Ngày:</label>
                      <input
                        type="date"
                        value={formData.date}
                        onChange={(e) =>
                          setFormData({ ...formData, date: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="schedule-form-group">
                      <label>Tài xế:</label>
                      <select
                        value={formData.driverId}
                        onChange={(e) =>
                          setFormData({ ...formData, driverId: e.target.value })
                        }
                        required
                      >
                        <option value="">Chọn tài xế</option>
                        {drivers.map((driver) => (
                          <option
                            key={driver.driver_id}
                            value={driver.driver_id}
                          >
                            {driver.driver_name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="schedule-form-group">
                      <label>Xe buýt:</label>
                      <select
                        value={formData.busId}
                        onChange={(e) =>
                          setFormData({ ...formData, busId: e.target.value })
                        }
                        required
                      >
                        <option value="">Chọn xe buýt</option>
                        {buses.map((bus) => (
                          <option key={bus.bus_id} value={bus.bus_id}>
                            {bus.bus_name || `Bus ${bus.bus_id}`}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="schedule-form-group">
                      <label>Tuyến đường:</label>
                      <select
                        value={formData.routeId}
                        onChange={(e) =>
                          setFormData({ ...formData, routeId: e.target.value })
                        }
                        required
                      >
                        <option value="">Chọn tuyến đường</option>
                        {routes.map((route) => (
                          <option key={route.route_id} value={route.route_id}>
                            {route.route_name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="schedule-form-group">
                      <label>Giờ xuất phát:</label>
                      <input
                        type="time"
                        value={formData.departureTime}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            departureTime: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div className="schedule-popup-actions">
              <button onClick={handleSubmit}>
                Lưu
              </button>
              <button onClick={closePopup}>
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="schedule-table">
        <div className="schedule-grid">
          <div className="schedule-grid-header">
            <div>Tuyến đường</div>
            {days.map((day) => (
              <div key={day}>{day}</div>
            ))}
          </div>

          {routes.map((route) => (
            <div className="schedule-grid-row" key={route.route_id}>
              <div className="route-label">
                {route.route_name}
              </div>
              {days.map((day) => {
                const listDriver = getDriversForRouteAndDay(
                  route.route_id,
                  day
                );
                return (
                  <CellTable
                    key={`${route.route_id}-${day}`}
                    listDriver={listDriver}
                    id={`cell-${route.route_id}-${day}`}
                    onEditTrip={handleEditTrip}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScheduleManager;
