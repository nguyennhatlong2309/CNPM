import React, { useEffect, useState } from "react";
import "./Route.css";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import axios from "axios";
import MAPP from "./GGMapDirection";

const list_point = [
  { longitude: 106.682, latitude: 10.7626 },
  { longitude: 106.6597, latitude: 10.7725 },
  { longitude: 106.65471625170719, latitude: 10.783974085760939 },
  { longitude: 106.66192602939662, latitude: 10.782329941018501 },
];

const API = "http://localhost:8081/api/";

async function getDataRoutes() {
  try {
    const res = await axios.get(`${API}routes`);
    return res.data;
  } catch (err) {
    console.error("Lỗi:", err);
    return null;
  }
}

const routesData = [
  {
    routeId: 1,
    name: "A",
    tinhTrang: "Đang hoạt động",
    pickupDropoffPoints: [
      {
        name: "Điểm 1A",
        pointId: 1,
        latitude: 10.75994871,
        longitude: 106.68226902,
      },
      {
        name: "Điểm 2A",
        pointId: 2,
        latitude: 10.75994871,
        longitude: 106.68226902,
      },
      {
        name: "Điểm 3A",
        pointId: 3,
        latitude: 10.75994871,
        longitude: 106.68226902,
      },
    ],
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
  const [selectedRouteId, setSelectedRouteId] = useState(routesData[0].routeId);
  const [selectedRoutePoints, setSelectedRoutePoints] = useState(
    routesData[0].pickupDropoffPoints
  );
  const [selectedPoint, setSelectedPoint] = useState(selectedRoutePoints[0]);

  const selectedRoute =
    routes.find((r) => r.routeId === selectedRouteId) || routes[0];

  const handleEdit = (id) => {
    alert(`Chỉnh sửa tuyến đường ID: ${id}`);
  };

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc muốn xoá tuyến này không?")) {
      setRoutes(routes.filter((r) => r.routeId !== routeId));
      if (selectedRouteId === id) setSelectedRouteId(null);
    }
  };
  useEffect(() => {
    async function loadData() {
      const data = await getDataRoutes();
      if (data) {
        setRoutes(data);
        setSelectedRouteId(data[0]);
        setSelectedRoutePoints(data[0].pickupDropoffPoints);
        setSelectedPoint(data[0].pickupDropoffPoints[0]);
      }
    }
    loadData();
  }, []);

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

      <div className="route-content-middle">
        <div className="route-detail-section">
          <div className="route-map-container">
            <MAPP
              list_points={selectedRoutePoints}
              selectedPoint={selectedPoint}
            />
          </div>

          <div className="route-info">
            {selectedRoutePoints.map((element) => {
              return (
                <div
                  key={element.pointId}
                  onClick={() => {
                    setSelectedPoint(element);
                  }}
                >
                  {element.name}
                </div>
              );
            })}
          </div>
        </div>

        <div className="route-table">
          <div className="route-table-header">
            <div>STT</div>
            <div>Tên tuyến</div>
            <div>Tình trạng</div>
            <div>Thao tác</div>
          </div>

          <div className="route-table-body">
            {routes.map((route, index) => (
              <div
                key={route.routeId}
                className={
                  selectedRouteId === route.routeId
                    ? "selected route-table-body-row"
                    : "route-table-body-row"
                }
                onClick={() => {
                  setSelectedRouteId(route.routeId);
                  setSelectedRoutePoints(route.pickupDropoffPoints);
                }}
              >
                <div>{index + 1}</div>
                <div>{route.name}</div>
                <div>{route.tinhTrang}</div>
                <div>
                  <button
                    aria-label={`Chỉnh sửa tuyến ${route.name}`}
                    className="btn-icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(route.routeId);
                    }}
                  >
                    ✏️
                  </button>
                  <button
                    aria-label={`Xóa tuyến ${route.name}`}
                    className="btn-icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(route.routeId);
                    }}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
export default RouteManagement;
