import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Incident.css";

function getSeverityClass(severity) {
  if (!severity) return "severity-low";
  const s = severity.toLowerCase();
  if (s === "high" || s === "cao") return "severity-high";
  if (s === "medium" || s === "trung bình") return "severity-medium";
  if (s === "resolved" || s === "đã xử lý") return "severity-resolved";
  return "severity-low";
}

export default function IncidentManagement() {
  const [incidentsData, setIncidentsData] = useState([]);
  const [selectedIncident, setSelectedIncident] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/incidents")
      .then((response) => {
        const data = response.data.map((item) => ({
          id: item.incident_id,
          title: item.description,
          status: item.severity,
          date: item.incident_time ? new Date(item.incident_time).toLocaleDateString() : "N/A",
          route: "Trip " + item.trip_id,
          driver: "N/A",
        }));
        setIncidentsData(data);
        if (data.length > 0) setSelectedIncident(data[0]);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="incident-content">
      {/* Table */}
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
                selectedIncident?.id === incident.id
                  ? "incident-row selected"
                  : "incident-row"
              }
              onClick={() => setSelectedIncident(incident)}
            >
              <div>{index + 1}</div>
              <div className="incident-title">
                <span
                  className={`incident-dot`}
                  style={{
                    background:
                      getSeverityClass(incident.status) === "severity-high"
                        ? "var(--accent-danger)"
                        : getSeverityClass(incident.status) === "severity-medium"
                        ? "var(--accent-warning)"
                        : "var(--accent-info)",
                  }}
                />
                {incident.title}
              </div>
              <div>
                <span className={`incident-severity ${getSeverityClass(incident.status)}`}>
                  {incident.status}
                </span>
              </div>
              <div>{incident.date}</div>
              <div className="incident-actions">
                <button
                  className="incident-btn-icon"
                  title="Chỉnh sửa"
                  onClick={(e) => e.stopPropagation()}
                >
                  ✏️
                </button>
                <button
                  className="incident-btn-icon"
                  title="Xóa"
                  onClick={(e) => e.stopPropagation()}
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detail Panel */}
      {selectedIncident && (
        <div className="incident-detail">
          <div className="incident-detail-header">
            <h3>{selectedIncident.title}</h3>
            <span className={`incident-severity ${getSeverityClass(selectedIncident.status)}`}>
              {selectedIncident.status}
            </span>
          </div>
          <div className="incident-detail-grid">
            <div className="incident-detail-item">
              <div className="incident-detail-label">Tuyến đường</div>
              <div className="incident-detail-value">{selectedIncident.route}</div>
            </div>
            <div className="incident-detail-item">
              <div className="incident-detail-label">Tài xế</div>
              <div className="incident-detail-value">{selectedIncident.driver}</div>
            </div>
            <div className="incident-detail-item">
              <div className="incident-detail-label">Ngày báo cáo</div>
              <div className="incident-detail-value">{selectedIncident.date}</div>
            </div>
            <div className="incident-detail-item">
              <div className="incident-detail-label">Trạng thái</div>
              <div className="incident-detail-value">{selectedIncident.status}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
