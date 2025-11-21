import React, { useState } from "react";
import "./zexam.css";

const routes = ["Tuyến A", "Tuyến B", "Tuyến C", "Tuyến D", "Tuyến E"];
const dateRangeOptions = [
  "20/10/2025 - 26/10/2025",
  "27/10/2025 - 02/11/2025",
  "03/11/2025 - 09/11/2025",
];

const drivers = [
  "Nguyễn Văn Tài",
  "Trần Thị Hoa",
  "Lê Văn Minh",
  "Phạm Thị Hồng",
];

const weekdays = [
  "thứ 2 - 17/11/2025",
  "thứ 3 - 18/11/2025",
  "thứ 4 - 19/11/2025",
  "thứ 5 - 20/11/2025",
  "thứ 6 - 21/11/2025",
  "thứ 7 - 22/11/2025",
];

const ScheduleManager = () => {
  const [selectedDateRange, setSelectedDateRange] = useState(
    dateRangeOptions[0]
  );
  const [selectedDriver, setSelectedDriver] = useState(drivers[0]);

  const [schedule, setSchedule] = useState(() => {
    const initial = {};
    routes.forEach((r) => {
      weekdays.forEach((_, i) => {
        initial[`${r}-${i}`] = null;
      });
    });
    return initial;
  });

  const toggleAssignDriver = (route, dayIdx) => {
    setSchedule((prev) => {
      const key = `${route}-${dayIdx}`;
      return {
        ...prev,
        [key]: prev[key] === null ? selectedDriver : null,
      };
    });
  };

  return (
    <div className="schedule-manager">
      {/* Header */}
      <header className="header">
        <div className="header-left">
          <h1>SSB 1.0</h1>
        </div>
        <div className="header-center">
          <h2>Quản lý lịch trình</h2>
        </div>
        <div className="header-right">
          <select
            value={selectedDateRange}
            onChange={(e) => setSelectedDateRange(e.target.value)}
          >
            {dateRangeOptions.map((opt, idx) => (
              <option key={`${opt}-${idx}`} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          <select
            value={selectedDriver}
            onChange={(e) => setSelectedDriver(e.target.value)}
          >
            {drivers.map((drv, idx) => (
              <option key={`${drv}-${idx}`} value={drv}>
                {drv}
              </option>
            ))}
          </select>
          <button className="btn edit-btn">Chỉnh sửa</button>
          <button className="btn create-btn">+ Tạo lịch trình</button>
        </div>
      </header>

      {/* Table */}
      <main className="table-container">
        <table>
          <thead>
            <tr>
              <th></th> {/* ô trống đầu */}
              {weekdays.map((day, idx) => (
                <th key={`${day}-${idx}`}>{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {routes.map((route, rIdx) => (
              <tr key={`${route}-${rIdx}`}>
                <td className="route-cell">{route}</td>
                {weekdays.map((_, dayIdx) => {
                  const key = `${route}-${dayIdx}`;
                  const assignedDriver = schedule[key];
                  return (
                    <td key={key}>
                      <div
                        className={`schedule-cell ${
                          assignedDriver ? "assigned" : "unassigned"
                        }`}
                        onClick={() => toggleAssignDriver(route, dayIdx)}
                        title={
                          assignedDriver
                            ? `Tài xế: ${assignedDriver} (Click để bỏ chọn)`
                            : `Chưa có tài xế (Click để gán tài xế ${selectedDriver})`
                        }
                      >
                        {assignedDriver || "-"}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
};

export default ScheduleManager;
