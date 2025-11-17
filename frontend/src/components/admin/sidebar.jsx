const Sidebar = () => (
  <div className="sidebar">
    <div className="logo">
      <span>SSB 1.0</span>
    </div>
    <nav>
      <ul>
        <li className="active">
          <span role="img" aria-label="home">
            🏠
          </span>{" "}
          Tổng quan
        </li>
        <li>
          <span role="img" aria-label="bus">
            🚌
          </span>{" "}
          Xe bus
        </li>
        <li>
          <span role="img" aria-label="driver">
            🧍‍♂️
          </span>{" "}
          Tài xế
        </li>
        <li>
          <span role="img" aria-label="student">
            🎓
          </span>{" "}
          Học sinh
        </li>
        <li>
          <span role="img" aria-label="route">
            🛣️
          </span>{" "}
          Tuyến đường
        </li>
        <li>
          <span role="img" aria-label="schedule">
            📅
          </span>{" "}
          Lịch trình
        </li>
        <li>
          <span role="img" aria-label="incident">
            📋
          </span>{" "}
          Sự cố
        </li>
        <li>
          <span role="img" aria-label="message">
            💬
          </span>{" "}
          Nhắn tin
        </li>
      </ul>
    </nav>
  </div>
);

export default Sidebar;
