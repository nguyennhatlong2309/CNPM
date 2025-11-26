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
];

const defaultProps = {
  center: {
    lat: 10.760033031593235,
    lng: 106.68217246472125,
  },
  zoom: 15,
};

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
    <div className="route-content">
      <div className="route-content-header">
        <input
          type="search"
          placeholder="Tìm kiếm"
          className="route-search-input"
        />
        <button className="route-btn-add">+ Thêm tuyến</button>
      </div>

      <div className="route-table">
        <div className="route-table-header">
          <div>STT</div>
          <div>Tên tuyến</div>
          <div>Điểm bắt đầu</div>
          <div>Tình trạng</div>
          <div>Thao tác</div>
        </div>

        <div className="route-table-body">
          {routes.map((route, index) => (
            <div
              key={route.id}
              className={
                selectedRouteId === route.id
                  ? "selected route-table-body-row"
                  : "route-table-body-row"
              }
              onClick={() => setSelectedRouteId(route.id)}
            >
              <div>{index + 1}</div>
              <div>{route.tenTuyen}</div>
              <div>{route.diemBatDau}</div>
              <div>{route.tinhTrang}</div>
              <div>
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
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="route-detail-section">
        <div className="route-map-container">
          <MAPP />
        </div>

        <aside className="route-info">
          <h3>Tuyến {selectedRoute.tenTuyen}:</h3>
          <p>
            {selectedRoute.diemBatDau} - {selectedRoute.diemKetThuc}
          </p>
        </aside>
      </div>
    </div>
  );
}
export default RouteManagement;
