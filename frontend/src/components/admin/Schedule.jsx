import React, { useState } from "react";
import "./Schedule.css";

const routes = [
  "Tuyến A",
  "Tuyến B",
  "Tuyến C",
  "Tuyến D",
  "Tuyến E",
  "Tuyến F",
  "Tuyến G",
  "Tuyến H",
  "Tuyến I",
  "Tuyến J",
];
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
  "thứ 2 - 17/11",
  "thứ 3 - 18/11",
  "thứ 4 - 19/11",
  "thứ 5 - 20/11",
  "thứ 6 - 21/11",
  "thứ 7 - 22/11",
  "chủ nhật - 23/11",
];

const ScheduleManager = () => {
  // State giữ lựa chọn combobox
  const [selectedDateRange, setSelectedDateRange] = useState(
    dateRangeOptions[0]
  );
  const [selectedDriver, setSelectedDriver] = useState(drivers[0]);

  // Giả lập dữ liệu lịch trình dạng: { route, dayIndex (0-5), driverAssigned/null }
  const [schedule, setSchedule] = useState(() => {
    let initial = {};
    routes.forEach((r) => {
      for (let i = 0; i < weekdays.length; i++) {
        // random assign driver null hoặc driver
        initial[`${r}-${i}`] = null;
      }
    });
    return initial;
  });

  const CellTable = ({ id, name }) => {
    return (
      <div>
        <div className="schedule-table-cell">
          <div>{id}</div>
          <div>{name}</div>
        </div>
      </div>
    );
  };

  return (
    <div className="schedule-content">
      {/* Header */}
      <div className="schedule-content-header">
        <select className="schedule-input"></select>
        <select className="schedule-input"></select>
        <select className="schedule-input"></select>
        <button className="schedule-btn schedule-edit-btn">Chỉnh sửa</button>
        <button className="schedule-btn schedule-create-btn">
          + Tạo lịch trình
        </button>
        <button className="schedule-btn schedule-create-btn">
          + Thêm tuần mới
        </button>
        <button className="schedule-btn schedule-create-btn">
          + Thêm năm học
        </button>
      </div>

      {/* Content - Table */}
      <div className="schedule-table">
        <div className="schedule-table-header">
          {weekdays.map((day) => (
            <div key={day}>{day}</div>
          ))}
        </div>
        <div className="schedule-table-body">
          {routes.map((route) => (
            <div className="schedule-row">
              <div>{route}</div>
              <CellTable id="1141" name="nguyen nhat long" />
              <CellTable />
              <CellTable />
              <CellTable />
              <CellTable />
              <CellTable />
              <CellTable />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScheduleManager;
