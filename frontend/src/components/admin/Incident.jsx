import React, { useState } from "react";
import "./Incident.css";

const incidentsData = [
  {
    id: 1,
    title: "Xe bị hư",
    status: "Đang xử lý",
    date: "20/10/2025",
    route: "Tuyến A",
    driver: "Nguyễn Văn Tài",
  },
  {
    id: 2,
    title: "Kẹt xe",
    status: "Đã xử lý",
    date: "21/10/2025",
    route: "Tuyến B",
    driver: "Trần Văn B",
  },
  {
    id: 3,
    title: "Lốp xe bị hỏng",
    status: "Đang xử lý",
    date: "21/10/2025",
    route: "Tuyến C",
    driver: "Lê Thị C",
  },
  {
    id: 4,
    title: "Kẹt xe",
    status: "Đã xử lý",
    date: "22/10/2025",
    route: "Tuyến D",
    driver: "Phạm Văn D",
  },
  {
    id: 1,
    title: "Xe bị hư",
    status: "Đang xử lý",
    date: "20/10/2025",
    route: "Tuyến A",
    driver: "Nguyễn Văn Tài",
  },
  {
    id: 2,
    title: "Kẹt xe",
    status: "Đã xử lý",
    date: "21/10/2025",
    route: "Tuyến B",
    driver: "Trần Văn B",
  },
  {
    id: 3,
    title: "Lốp xe bị hỏng",
    status: "Đang xử lý",
    date: "21/10/2025",
    route: "Tuyến C",
    driver: "Lê Thị C",
  },
  {
    id: 4,
    title: "Kẹt xe",
    status: "Đã xử lý",
    date: "22/10/2025",
    route: "Tuyến D",
    driver: "Phạm Văn D",
  },
  {
    id: 1,
    title: "Xe bị hư",
    status: "Đang xử lý",
    date: "20/10/2025",
    route: "Tuyến A",
    driver: "Nguyễn Văn Tài",
  },
  {
    id: 2,
    title: "Kẹt xe",
    status: "Đã xử lý",
    date: "21/10/2025",
    route: "Tuyến B",
    driver: "Trần Văn B",
  },
  {
    id: 3,
    title: "Lốp xe bị hỏng",
    status: "Đang xử lý",
    date: "21/10/2025",
    route: "Tuyến C",
    driver: "Lê Thị C",
  },
  {
    id: 4,
    title: "Kẹt xe",
    status: "Đã xử lý",
    date: "22/10/2025",
    route: "Tuyến D",
    driver: "Phạm Văn D",
  },
];

export default function IncidentManagement() {
  const [selectedIncident, setSelectedIncident] = useState(incidentsData[0]);

  return (
    <div className="incident-content">
      <div className="incident-content-header">
        <div className="search-bar">
          <input placeholder="Tìm kiếm" />
        </div>
        <button className="btn create-btn">+ Tạo sự cố</button>
      </div>

      <div className="incident-table">
        <div className="incident-table-header">
          <div>STT</div>
          <div>Tiêu đề</div>
          <div>Trạng thái</div>
          <div>Ngày báo cáo</div>
          <div>Thao tác</div>
        </div>
        <div className="incident-table-body">
          {incidentsData.map((incident, index) => (
            <div
              key={incident.id}
              className={
                selectedIncident.id === incident.id
                  ? "selected incident-row"
                  : "incident-row"
              }
              onClick={() => setSelectedIncident(incident)}
            >
              <div>{index + 1}</div>
              <div>{incident.title}</div>
              <div>{incident.status}</div>
              <div>{incident.date}</div>
              <div>
                <button className="action-btn edit" title="Chỉnh sửa">
                  ✏️
                </button>
                <button className="action-btn delete" title="Xóa">
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="incident-details">
        <div>
          <div>
            <strong>Tiêu đề</strong>
          </div>
          <div>
            <strong>{selectedIncident.title}</strong>
          </div>
        </div>
        <div>
          <div>
            <strong>Tuyến đường</strong>
          </div>
          <div>
            <strong>{selectedIncident.route}</strong>
          </div>
        </div>
        <div>
          <div>
            <strong>Trạng thái</strong>
          </div>
          <div>
            <strong>{selectedIncident.status}</strong>
          </div>
        </div>
        <div>
          <div>
            <strong>Tài xế</strong>
          </div>
          <div>
            <strong>{selectedIncident.driver}</strong>
          </div>
        </div>
        <div>
          <div>
            <strong>Ngày báo cáo</strong>
          </div>
          <div>
            <strong>{selectedIncident.date}</strong>
          </div>
        </div>
        <div>
          <button className="btn edit-btn">Chỉnh sửa</button>
        </div>
      </div>
    </div>
  );
}
