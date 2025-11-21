import React from "react";
import "./Tongquan.css";

const data = {
  soXeHoatDong: 35,
  taiXeHienTai: 48,
  hocSinhTrenXe: 200,
  suCo: 3,
  userName: "Nguyễn Văn A",
  busInfo: {
    tenTuyen: "Tuyến A - Bus#03",
    taiXe: "Nguyễn Văn Tài",
    hocSinh: "12/15 Học sinh",
    viTri: "Nguyễn Văn Cừ, quận 5",
    trangThai: "đón học sinh",
  },
  canhBao: [
    { msg: "Bus#02 trên tuyến C - Kẹt xe", time: "08:10" },
    { msg: "Bus#11 trên tuyến E - trễ 15 phút", time: "07:45" },
    { msg: "Bus#15 trên tuyến D - Hư xe", time: "07:10" },
  ],
};

const InfoCard = ({ icon, title, value, bgColor }) => (
  <div className="info-card" style={{ backgroundColor: bgColor }}>
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
  return (
    <div className="overview-content">
      <div className="overview-info-cards">
        <InfoCard
          icon="🚌"
          title="Số xe hoạt động"
          value={data.soXeHoatDong}
          bgColor="#729dfc"
        />
        <InfoCard
          icon="👨‍✈️"
          title="Tài xế trực hôm nay"
          value={data.taiXeHienTai}
          bgColor="#8ef24f"
        />
        <InfoCard
          icon="🎓"
          title="Học sinh trên xe"
          value={data.hocSinhTrenXe}
          bgColor="#dbab0a"
        />
        <InfoCard icon="📋" title="Sự cố" value={data.suCo} bgColor="#f76d6d" />
      </div>

      <div className="map-and-info">
        <div className="map-container" style={{ border: "2px solid red" }}>
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

            <Tooltip busInfo={data.busInfo} />
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
