import React, { useMemo, useEffect, useState, useEffectEvent } from "react";
import axios from "axios";
import "./Schedule.css";

const API = "http://localhost:8081/api/";

const dayOfWeek = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "CN"];

const weekdays = [
  "thứ 2 - 17/11/2025",
  "thứ 3 - 18/11",
  "thứ 4 - 19/11",
  "thứ 5 - 20/11",
  "thứ 6 - 21/11",
  "thứ 7 - 22/11",
  "chủ nhật - 23/11",
];
// ========================================================================================================= FETCH
async function getListYear_Routes() {
  try {
    const [years, routes] = await Promise.all([
      axios.get(`${API}school-years`),
      axios.get(`${API}routes`),
    ]);
    return {
      years: years.data,
      routes: routes.data,
    };
  } catch (error) {
    console.error("Lỗi:", error);
    return null;
  }
}

async function getTripBydate(selectedWeekId, weeks) {
  const week = weeks.find((w) => w.id == selectedWeekId);

  const start = formatDateToYYYY_MM_DD(week.start);
  const end = formatDateToYYYY_MM_DD(week.end);
  try {
    const res = await axios.get(
      `${API}trips/byDate?start=${start}&end=${end}\n`
    );
    return res.data;
  } catch (error) {
    console.error("Lỗi:", error);
    return null;
  }
}
// ======================================================================================================= FUNCTION

// Format dd/MM/yyyy
function formatDateDD_MM_YYYY(date) {
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

function formatDateToYYYY_MM_DD(date) {
  return date.toISOString().split("T")[0];
}

function formatDay_DD_MM_YYYY_TO_YYYY_MM_DD(dayString) {
  // tách phần ngày
  const parts = dayString.split(" - ")[1]; // "11/08/2025"
  if (!parts) return null;

  const [dd, mm, yyyy] = parts.split("/"); // ["11","08","2025"]
  return `${yyyy}-${mm}-${dd}`; // "2025-08-11"
}

function covertToWeeks(listYear, selectedYearID) {
  let start = "2025-11-24";
  let end = "2025-11-30";
  if (listYear.length !== 0 && selectedYearID) {
    const year = listYear.find((y) => y.yearId == selectedYearID);
    start = year.startDate;
    end = year.endDate;
  }

  const weeks = [];
  let startDate = new Date(start);
  let endDate = new Date(end);

  // đưa startDate về thứ 2 gần nhất
  while (startDate.getDay() !== 1) {
    startDate.setDate(startDate.getDate() - 1);
  }

  let i = 0;
  let current = new Date(startDate);

  while (current <= endDate) {
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

// function chuyển thành những ngày trong tuần cho header

function convertoDaysOfWeek(selectedWeekID, weeks) {
  // tìm tuần được chọn
  const week = weeks.find((w) => w.id == selectedWeekID);
  if (!week || !week.start || !week.end) return [];

  const startDate = new Date(week.start);
  const endDate = new Date(week.end);

  // kiểm tra startDate và endDate có hợp lệ không
  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) return [];

  const daysInWeek = [];
  const current = new Date(startDate);
  let i = 0;
  while (current <= endDate) {
    daysInWeek.push(`${dayOfWeek[i]} - ${formatDateDD_MM_YYYY(current)}`);
    current.setDate(current.getDate() + 1);
    i++;
  }

  return daysInWeek;
}

//================================ COMPONENT ===========================================================

const CellTable = ({ listDriver, id }) => {
  // Tạo id cho div, kiểm tra route và date trước khi dùng
  const idx = id ? id : "defaultID";

  if (listDriver && listDriver.length > 0) {
    return (
      <div className="schedule-table-cell" id={idx}>
        {listDriver.map((driver) => (
          <div key={`${driver.id}_${driver.tripId}`}>{driver.name}</div>
        ))}
      </div>
    );
  } else {
    return <div className="schedule-table-cell empty"></div>;
  }
};

const ScheduleManager = () => {
  const [listRoutes, setListRoutes] = useState([]); // danh sách tuyến đường

  const [listYear, setListYear] = useState([]); // combo box danh sach nam hoc
  const [selectedYearID, setSelectedYearID] = useState(1); // năm học được chọn

  const listWeeks = useMemo(
    () => covertToWeeks(listYear, selectedYearID),
    [selectedYearID, listYear]
  ); // danh sách tuần của năm
  const [selectedWeekID, setSelectedWeekID] = useState(1); // id của tuần được chọn

  const days = useMemo(
    () => convertoDaysOfWeek(selectedWeekID, listWeeks),
    [selectedWeekID, listWeeks]
  );

  // lấy các chuyển đi theo ngày để fill
  const [tripsByWeek, setTripsByWeek] = useState([]);

  useEffect(() => {
    async function getDataYear() {
      const data = await getListYear_Routes();
      setListYear(data.years);
      setListRoutes(data.routes);
    }
    getDataYear();
  }, []);

  const tripsMap = useMemo(() => {
    const map = {};
    if (!tripsByWeek) return map;
    tripsByWeek.forEach((trip) => {
      const key = `${trip.routeName}_${trip.tripDate}`; // key: Route A_2025-08-04
      if (!map[key]) map[key] = [];
      map[key].push({
        id: trip.busId,
        tripId: trip.tripId,
        name: trip.driver.driverName,
      }); // giả sử có driverName
    });
    console.log(map);
    return map;
  }, [tripsByWeek]);

  useEffect(() => {
    async function getTrips() {
      const data = await getTripBydate(selectedWeekID, listWeeks);
      setTripsByWeek(data);
    }

    getTrips();
  }, [selectedWeekID, listWeeks]);

  return (
    <div className="schedule-content">
      {/* Header */}
      <div className="schedule-content-header">
        {/* Combobox năm học */}
        <select
          className="schedule-input"
          value={selectedYearID}
          onChange={(e) => {
            setSelectedYearID(e.target.value);
          }}
        >
          {listYear.map((year) => (
            <option key={year.yearId} value={year.yearId}>
              {year.yearName}
            </option>
          ))}
        </select>

        <select
          className="schedule-input"
          value={selectedWeekID}
          onChange={(e) => {
            setSelectedWeekID(e.target.value);
          }}
        >
          {listWeeks.map((w) => (
            <option key={w.id} value={w.id}>
              Tuần {w.id} ({formatDateDD_MM_YYYY(w.start)} -{" "}
              {formatDateDD_MM_YYYY(w.end)})
            </option>
          ))}
        </select>

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
          {days.map((day) => (
            <div key={day}>{day}</div>
          ))}
        </div>

        <div className="schedule-table-body">
          {listRoutes.map((route) => (
            <div className="schedule-row" key={route.name}>
              <div>{route.name}</div>
              {days.map((day) => {
                const key = `${route.name}_${formatDay_DD_MM_YYYY_TO_YYYY_MM_DD(
                  day
                )}`;
                const drivers = tripsMap[key] || [];
                return <CellTable key={key} listDriver={drivers} />;
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScheduleManager;
