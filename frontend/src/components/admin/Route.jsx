import React, { useEffect, useState } from "react";
import "./Route.css";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import MAPP from "./GGMapDirection";

const routesData = [
  {
    id: 1,
    tenTuyen: "A",
    diemBatDau:
      " 273 An Dương Vương, Phường, Chợ Quán, Thành phố Hồ Chí Minh 700000, Việt Nam",
    diemKetThuc:
      "271 Nguyễn Trãi, Phường Nguyễn Cư Trinh, Quận 1, Thành phố Hồ Chí Minh 70000, Việt Nam",
    tinhTrang: "Đang hoạt động",
  },
  {
    id: 2,
    tenTuyen: "B",
    diemBatDau: "321 BCD",
    diemKetThuc: "Trường GHI",
    tinhTrang: "Tạm dừng",
  },
  {
    id: 3,
    tenTuyen: "C",
    diemBatDau: "12 DEF",
    diemKetThuc: "Trường JKL",
    tinhTrang: "Đang hoạt động",
  },
  {
    id: 4,
    tenTuyen: "D",
    diemBatDau: "156 AFG",
    diemKetThuc: "Trường MNO",
    tinhTrang: "Đang hoạt động",
  },
];

const defaultProps = {
  center: {
    lat: 10.760033031593235,
    lng: 106.68217246472125,
  },
  zoom: 15,
};
// 10.760033031593235, 106.68217246472125

function RouteManagement() {
  const [routes, setRoutes] = useState(routesData);
  const [selectedRouteId, setSelectedRouteId] = useState(null);

  // Lấy route đang chọn (để hiển thị bản đồ và chi tiết)
  const selectedRoute =
    routes.find((r) => r.id === selectedRouteId) || routes[0];

  const handleEdit = (id) => {
    alert(`Chỉnh sửa tuyến đường ID: ${id}`);
  };

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc muốn xoá tuyến này không?")) {
      setRoutes(routes.filter((r) => r.id !== id));
      if (selectedRouteId === id) setSelectedRouteId(null);
    }
  };

  return (
    <div className="route-management-container">
      <main className="main-content">
        <section className="content-section">
          <div className="section-header">
            <input
              type="search"
              placeholder="Tìm kiếm"
              className="search-input"
            />
            <button className="btn-add">+ Thêm tuyến</button>
          </div>

          <table className="route-table">
            <thead>
              <tr>
                <th>STT</th>
                <th>Tên tuyến</th>
                <th>Điểm bắt đầu</th>
                <th>Tình trạng</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {routes.map((route, index) => (
                <tr
                  key={route.id}
                  className={selectedRouteId === route.id ? "selected" : ""}
                  onClick={() => setSelectedRouteId(route.id)}
                >
                  <td>{index + 1}</td>
                  <td>{route.tenTuyen}</td>
                  <td>{route.diemBatDau}</td>
                  <td>{route.tinhTrang}</td>
                  <td>
                    <button
                      aria-label={`Chỉnh sửa tuyến ${route.tenTuyen}`}
                      className="btn-icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(route.id);
                      }}
                    >
                      ✏️
                    </button>
                    <button
                      aria-label={`Xóa tuyến ${route.tenTuyen}`}
                      className="btn-icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(route.id);
                      }}
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="map-detail-section">
            <div className="map-container">
              <MAPP />
            </div>

            <aside className="route-info">
              <button className="btn-edit">Chỉnh sửa</button>
              <h3>Tuyến {selectedRoute.tenTuyen}:</h3>
              <p>
                {selectedRoute.diemBatDau} - {selectedRoute.diemKetThuc}
              </p>
            </aside>
          </div>
        </section>
      </main>
    </div>
  );
}
export default RouteManagement;
