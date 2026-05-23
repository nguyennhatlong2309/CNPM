import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Tongquan.css";

const InfoCard = ({ icon, title, value }) => (
  <div className="info-card">
    <div className="icon">{icon}</div>
    <div>
      <div className="card-title">{title}</div>
      <div className="card-value">{value}</div>
    </div>
  </div>
);

const Tooltip = ({ busInfo }) => (
  <div className="tooltip">
    <strong>{busInfo.tenTuyen}</strong>
    <p>Tài xế: {busInfo.taiXe}</p>
    <p>{busInfo.hocSinh}</p>
    <p>Vị trí hiện tại: {busInfo.viTri}</p>
    <p>Trạng thái: {busInfo.trangThai}</p>
  </div>
);

const Legend = () => (
  <div className="overview-legend">
    <h4>Chú thích</h4>
    <p>
      <span className="icon">🚌</span> Xe đang hoạt động
    </p>
    <p>
      <span className="icon">📍</span> Điểm đón/ điểm trả
    </p>
    <p>
      <span className="icon">📋</span> Sự cố
    </p>
  </div>
);

const Alerts = ({ alerts }) => (
  <div className="alerts">
    <h4>Cảnh báo</h4>
    {alerts.map((alert, idx) => (
      <div key={idx} className="alert-item">
        <span>{alert.msg}</span>
        <span>{alert.time}</span>
      </div>
    ))}
  </div>
);

const Dashboard = () => {
  const [data, setData] = useState({
    soXeHoatDong: 0,
    taiXeHienTai: 0,
    hocSinhTrenXe: 0,
    suCo: 0,
    canhBao: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [busRes, driverRes, studentRes, incidentRes] = await Promise.all([
          axios.get("http://localhost:5000/api/bus"),
          axios.get("http://localhost:5000/api/drivers"),
          axios.get("http://localhost:5000/api/student"),
          axios.get("http://localhost:5000/api/incidents"),
        ]);
        
        setData({
          soXeHoatDong: busRes.data.length,
          taiXeHienTai: driverRes.data.length,
          hocSinhTrenXe: studentRes.data.length,
          suCo: incidentRes.data.length,
          canhBao: incidentRes.data.slice(0, 3).map(i => ({
            msg: i.description,
            time: i.incident_time ? new Date(i.incident_time).toLocaleTimeString() : "N/A",
          }))
        });
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="overview-content">
      <div className="overview-info-cards">
        <InfoCard icon="🚌" title="Số xe hoạt động" value={data.soXeHoatDong} />
        <InfoCard icon="👨‍✈️" title="Tài xế trực hôm nay" value={data.taiXeHienTai} />
        <InfoCard icon="🎓" title="Học sinh trên xe" value={data.hocSinhTrenXe} />
        <InfoCard icon="📋" title="Sự cố" value={data.suCo} />
      </div>

      <div className="map-and-info">
        <div className="map-container">
          {/* Ở đây bạn có thể dùng thư viện bản đồ như Leaflet hoặc Google Maps */}
          <div className="map-placeholder">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7838.735500578301!2d106.66059565386902!3d10.783120396343156!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752ecbdfe90777%3A0x437c8da456d56215!2zMzAvMSDEkC4gxJDhurduZyBM4buZLCBQaMaw4budbmcgNywgVMOibiBCw6xuaCwgVGjDoG5oIHBo4buRIEjhu5MgQ2jDrSBNaW5oLCBWaeG7h3QgTmFt!5e0!3m2!1svi!2s!4v1763140800858!5m2!1svi!2s"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
        <div className="side-info">
          <Legend />
          <Alerts alerts={data.canhBao} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
