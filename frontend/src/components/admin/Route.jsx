import React, { useEffect, useState } from "react";
import "./Route.css";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import axios from "axios";
import MAPP from "./GGMapDirection";
import AddEditMap from "./MapShowPoint"; // Giả sử AddEditMap là MapShowPoint

const API = "http://localhost:5000/api/";

async function getDataRoutes() {
  try {
    const [routes, points] = await Promise.all([
      axios.get(`${API}route`),
      axios.get(`${API}point`),
    ]);

    return { routes: routes.data, points: points.data };
  } catch (error) {
    console.error("Lỗi:", error);
    return null;
  }
}

async function updateRoute(route_id, route) {
  try {
    const res = await axios.put(`${API}route/${route_id}`, route);
    return res.data;
  } catch (error) {
    console.error("Lỗi:", error);
  }
}

async function createRoute(route) {
  try {
    const res = await axios.post(`${API}route`, route);
    return res.data;
  } catch (error) {
    console.error("Lỗi:", error);
  }
}

async function createMultiPoint(points) {
  try {
    const res = await axios.post(`${API}point/multiple`, points);
    return res;
  } catch (error) {
    console.error("Lỗi:", error);
  }
}

async function updateMultiPoint(points) {
  try {
    const res = await axios.put(`${API}point/multiple`, points);
    return res;
  } catch (error) {
    console.error("Lỗi:", error);
  }
}

async function setDeletePoints(points) {
  try {
    const res = await axios.put(`${API}point/delete/multiple`, points);
    return res;
  } catch (error) {
    console.error("Lỗi:", error);
  }
}

function convertNumberTimeToDBString(estimatedTime) {
  if (typeof estimatedTime !== "number" || estimatedTime < 0) {
    throw new Error("estimatedTime phải là số >= 0");
  }

  const totalSeconds = Math.round(estimatedTime * 3600); // chuyển giờ -> giây
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const pad = (n) => n.toString().padStart(2, "0");

  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

function RouteManagement() {
  const [routes, setRoutes] = useState([]);
  const [points, setPoints] = useState([]);
  const [selectedRouteId, setSelectedRouteId] = useState(null);
  const [selectedRoutePoints, setSelectedRoutePoints] = useState([]);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [dt_et, setdtet] = useState({
    distance_km: 0,
    estimated_time: 0,
  });
  const [errors, setErrors] = useState({});
  // State cho modal thêm/chỉnh sửa tuyến
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // Phân biệt thêm/chỉnh sửa

  const [currentRoute, setCurrentRoute] = useState({
    route_name: "",
    status: "",
    distance_km: 0,
    estimated_time: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentRoute({ ...currentRoute, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" }); // Xóa lỗi khi user nhập
    }
  };

  // Hàm mở modal cho thêm mới
  const handleAdd = () => {
    setCurrentRoute({
      route_name: "",
      status: "Hoạt động",
      distance_km: "",
      estimated_time: "",
    });
    setSelectedRoutePoints([]);
    setIsModalOpen(true);
    setIsEditing(false);
    setErrors({});
  };

  const handleEdit = (route) => {
    // Mở modal ở chế độ chỉnh sửa
    setCurrentRoute({
      route_id: route.route_id,
      route_name: route.route_name,
      status: route.status,
      distance_km: route.distance_km,
      estimated_time: route.estimated_time,
    });
    setSelectedRoutePoints(points.filter((p) => p.route_id == route.route_id));
    setIsEditing(true);
    setIsModalOpen(true);
    setErrors({});
  };

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc muốn xoá tuyến này không?")) {
      setRoutes(routes.filter((r) => r.route_id !== id));
      if (selectedRouteId === id) setSelectedRouteId(null);
    }
  };

  // Hàm đóng modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Callback từ AddEditMap để lấy điểm
  const handleSavePointsFromMap = (points) => {
    setCurrentRoute({
      ...currentRoute,
      distance_km: dt_et.distance_km,
      estimated_time: convertNumberTimeToDBString(dt_et.estimated_time),
    });

    points.forEach((element, index) => {
      element.order_in_route = index + 1;
    });

    handleSave(points);
  };

  // Hàm load dữ liệu (tách ra để có thể gọi lại)
  const loadData = async () => {
    const data = await getDataRoutes();
    if (data && data.routes && data.routes.length > 0) {
      data.routes.map(
        (r) => (r.status = r.status == "1" ? "Hoạt động" : "Tạm ngưng")
      );
      setSelectedRouteId(data.routes[0].route_id);
      const points = data.points.filter(
        (p) => p.route_id == data.routes[0].route_id
      );
      setSelectedRoutePoints(points);
      setSelectedPoint(points[0] || null);
    }
    setRoutes(data.routes || []);
    setPoints(data.points || []);
  };

  // Hàm lưu tuyến mới hoặc cập nhật
  const handleSave = async (nowPoints) => {
    // Validation
    const newErrors = {};
    if (!currentRoute.route_name.trim()) {
      newErrors.route_name = "Tên tuyến không được trống.";
    }
    if (nowPoints.length < 3) {
      // Giả sử "trên 2" là >= 3; nếu muốn >= 2, đổi thành 2
      newErrors.nowPoints = "Phải có ít nhất 3 điểm.";
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const routeDTO = {
      route_name: currentRoute.route_name,
      status: currentRoute.status == "Hoạt động" ? "1" : "0",
      distance_km: dt_et.distance_km ? Number(dt_et.distance_km.toFixed(3)) : 0,
      estimated_time: convertNumberTimeToDBString(dt_et.estimated_time),
    };

    if (isEditing) {
      // await updateRoute(currentRoute.route_id, routeDTO);

      const oldPoints = points.filter(
        (p) => p.route_id == currentRoute.route_id
      );

      const newPoints = nowPoints
        .filter(
          (np) =>
            !oldPoints.some(
              (op) =>
                np.longitude === op.longitude && np.latitude === op.latitude
            )
        )
        .map((p) => ({ ...p, route_id: currentRoute.route_id }));

      const updatePoints = nowPoints
        .filter((np) =>
          oldPoints.some(
            (op) =>
              Number(np.longitude) === Number(op.longitude) &&
              Number(np.latitude) === Number(op.latitude)
          )
        )
        .map((np) => {
          // Ép kiểu longitude và latitude thành số
          const longitude = Number(np.longitude);
          const latitude = Number(np.latitude);

          // Tìm op tương ứng để lấy point_id
          const matchingPoint = oldPoints.find(
            (op) =>
              longitude === Number(op.longitude) &&
              latitude === Number(op.latitude)
          );

          return {
            ...np,
            longitude, // Gán lại longitude đã ép kiểu
            latitude, // Gán lại latitude đã ép kiểu
            route_id: currentRoute.route_id,
            point_id: matchingPoint ? matchingPoint.point_id : null, // Gán point_id hoặc null nếu không tìm thấy
          };
        });

      const deletedPoints = oldPoints
        .filter(
          (op) =>
            !nowPoints.some(
              (np) =>
                np.longitude === op.longitude && np.latitude === op.latitude
            )
        )
        .map((op) => ({
          ...op,
          is_delete: "1",
        }));
      console.log(updatePoints);
      Promise.all([
        await updateRoute(currentRoute.route_id, currentRoute),
        await createMultiPoint(newPoints),
        await updateMultiPoint(updatePoints),
        await setDeletePoints(deletedPoints),
      ]);

      setRoutes(
        routes.map((r) =>
          r.route_id === currentRoute.route_id ? { ...r, ...currentRoute } : r
        )
      );
    } else {
      const newRoute = await createRoute(routeDTO);
      nowPoints.map((p) => (p.route_id = newRoute.route_id)); // newRoute trả về route_id
      await createMultiPoint(nowPoints);
      setRoutes([...routes, { ...currentRoute, route_id: newRoute.route_id }]);
    }

    await loadData();
    closeModal();
  };

  useEffect(() => {
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
        <button className="route-btn-add" onClick={handleAdd}>
          + Thêm tuyến
        </button>
      </div>

      <div className="route-main">
        <div className="route-map-area">
          <MAPP
            list_points={selectedRoutePoints}
            selectedPoint={selectedPoint}
            selectedRouteID={selectedRouteId}
          />
        </div>

        <div className="route-list-panel">
          {selectedRoutePoints?.map((element) => (
            <div
              key={element.point_id}
              className={`route-item ${selectedPoint?.point_id === element.point_id ? 'selected' : ''}`}
              onClick={() => setSelectedPoint(element)}
            >
              <div className="route-item-name">{element.point_name}</div>
            </div>
          ))}
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
                key={route.route_id}
                className={
                  selectedRouteId === route.route_id
                    ? "selected route-row"
                    : "route-row"
                }
                onClick={() => {
                  setSelectedRouteId(route.route_id);
                  setSelectedRoutePoints(
                    points.filter((p) => p.route_id == route.route_id)
                  );
                }}
              >
                <div>{index + 1}</div>
                <div>{route.route_name}</div>
                <div>{route.status}</div>
                <div className="route-actions">
                  <button
                    aria-label={`Chỉnh sửa tuyến ${route.route_name}`}
                    className="route-btn-icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(route);
                    }}
                  >
                    ✏️
                  </button>
                  <button
                    aria-label={`Xóa tuyến ${route.route_name}`}
                    className="route-btn-icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(route.route_id);
                    }}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      {/* Modal thêm/chỉnh sửa tuyến (bằng CSS thuần) */}
      {isModalOpen && (
        <div className="route-popup-overlay" onClick={closeModal}>
          <div
            className="route-popup-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <h2>{isEditing ? "Chỉnh sửa tuyến" : "Thêm tuyến mới"}</h2>
            </div>
            <div className="route-popup-body">
              <div className="route-popup-form">
                <label>
                  Tên tuyến:
                  <input
                    type="text"
                    name="route_name"
                    value={currentRoute.route_name}
                    onChange={handleInputChange}
                    placeholder="Nhập tên tuyến"
                  />
                  {errors.route_name && (
                    <span className="error-text">{errors.route_name}</span>
                  )}
                </label>
                <label>
                  Trạng thái:
                  <select
                    name="status"
                    value={currentRoute.status || "Hoạt động"}
                    onChange={handleInputChange}
                  >
                    <option value="Hoạt động">Hoạt động</option>
                    <option value="Tạm ngưng">Tạm ngưng</option>
                  </select>
                </label>
              </div>
              {errors.points && (
                <span className="error-text">{errors.points}</span>
              )}
              <div className="route-popup-map">
                <AddEditMap
                  onSavePoints={handleSavePointsFromMap}
                  initialPoints={selectedRoutePoints}
                  setETDT={setdtet}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RouteManagement;
