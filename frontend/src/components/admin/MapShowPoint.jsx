import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "./MapShowPoint.css";

mapboxgl.accessToken =
  "pk.eyJ1IjoibG9uZ25oYXQyMzkiLCJhIjoiY21pMmc0MGk1MWtndjJqb3FlYmZ4dDFucSJ9.50MnkL8QdWHEcT3inc6tqw";

const MapComponent = ({ onSavePoints, initialPoints = [], setETDT }) => {
  const mapContainer = useRef(null);
  const geocoderContainer = useRef(null);
  const map = useRef(null);

  const [markers, setMarkers] = useState([]);

  // ---------------------- CALL DIRECTIONS API ----------------------
  const fetchRoute = async (coords) => {
    const coordString = coords.map((c) => `${c[0]},${c[1]}`).join(";");

    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${coordString}?geometries=geojson&overview=full&access_token=${mapboxgl.accessToken}`;

    const res = await fetch(url);
    const data = await res.json();

    if (!data.routes || !data.routes[0]) {
      console.error("Không tìm được route hợp lệ từ API");
      return null;
    }
    setETDT({
      distance_km: data.routes[0].distance_km,
      estimated_time: data.routes[0].distance_km / 1000 / 22,
    });
    return data.routes[0].geometry.coordinates;
  };

  // ---------------------- DRAW ROUTE ----------------------
  const drawRoute = async (markerList) => {
    if (!map.current) return;

    const coords = markerList.map((m) => [m.lngLat.lng, m.lngLat.lat]);
    if (coords.length < 2) return;

    const routeCoords = await fetchRoute(coords);
    if (!routeCoords) return;

    // Xóa route cũ
    if (map.current.getSource("route-line")) {
      map.current.removeLayer("route-layer");
      map.current.removeSource("route-line");
    }

    // Vẽ route mới
    map.current.addSource("route-line", {
      type: "geojson",
      data: {
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: routeCoords,
        },
      },
    });

    map.current.addLayer({
      id: "route-layer",
      type: "line",
      source: "route-line",
      layout: {
        "line-join": "round",
        "line-cap": "round",
      },
      paint: {
        "line-color": "#ff4d4d",
        "line-width": 5,
      },
    });
  };

  // ---------------------- ADD MARKER ----------------------
  const addMarker = (markerData) => {
    const { id, lngLat, name } = markerData;

    const pointMarker = new mapboxgl.Marker({ color: "#00e0ff" })
      .setLngLat(lngLat)
      .addTo(map.current);

    // label
    const el = document.createElement("div");
    el.className = "custom-marker";
    el.style.background = "white";
    el.style.padding = "2px 5px";
    el.style.borderRadius = "5px";
    el.style.fontSize = "12px";
    el.style.fontWeight = "bold";
    el.innerText = id;
    el.dataset.id = id;

    const textMarker = new mapboxgl.Marker({ element: el, anchor: "top" })
      .setLngLat(lngLat)
      .addTo(map.current);

    el.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      const removeId = Number(e.target.dataset.id);

      pointMarker.remove();
      textMarker.remove();

      setMarkers((prev) => {
        const updated = prev
          .filter((m) => m.id !== removeId)
          .map((m, i) => {
            m.id = i + 1;
            if (m.numberEl) {
              m.numberEl.innerText = m.id;
              m.numberEl.dataset.id = m.id;
            }
            return m;
          });

        drawRoute(updated);
        return updated;
      });
    });

    return { ...markerData, pointMarker, textMarker, numberEl: el };
  };

  // ---------------------- UPDATE NAME ----------------------
  const updateName = (index, newName) => {
    setMarkers((prev) =>
      prev.map((m, i) => (i === index ? { ...m, name: newName } : m))
    );
  };

  // ---------------------- MAP INIT ----------------------
  useEffect(() => {
    if (map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [106.6822585846524, 10.759912245499992],
      zoom: 13,
    });

    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl,
      marker: false,
      placeholder: "Tìm kiếm địa điểm...",
    });

    geocoder.addTo(geocoderContainer.current);

    geocoder.on("result", (e) => {
      const pos = e.result.center;
      map.current.flyTo({
        center: pos,
        zoom: 15,
      });
    });

    map.current.on("click", (e) => {
      const lngLat = e.lngLat;

      setMarkers((prev) => {
        const newId = prev.length + 1;
        const newName = "điểm " + newId;
        const newMarker = addMarker({ id: newId, lngLat, name: newName });

        const updated = [...prev, newMarker];
        drawRoute(updated);

        return updated;
      });
    });
  }, []);

  // ---------------------- LOAD INITIAL POINTS ----------------------
  useEffect(() => {
    if (!Array.isArray(initialPoints)) {
      console.error("initialPoints phải là mảng!");
      return;
    }
    if (initialPoints.length > 0 && map.current) {
      // Xóa markers cũ
      markers.forEach((m) => {
        m.pointMarker.remove();
        m.textMarker.remove();
      });
      setMarkers([]);

      // Thêm markers từ initialPoints
      const newMarkers = initialPoints.map((point, index) => {
        const lngLat = {
          lng: parseFloat(point.longitude),
          lat: parseFloat(point.latitude),
        };
        return addMarker({ id: index + 1, lngLat, name: point.point_name });
      });
      setMarkers(newMarkers);

      // Vẽ route nếu có >=2 điểm
      if (newMarkers.length >= 2) {
        drawRoute(newMarkers);
      }
    }
  }, [initialPoints]);

  // ---------------------- MOVE UP ----------------------
  const moveUp = (index) => {
    if (index === 0) return;

    const newMarkers = [...markers];
    // SWAP
    const temp = newMarkers[index];
    newMarkers[index] = newMarkers[index - 1];
    newMarkers[index - 1] = temp;

    newMarkers.forEach((m, i) => {
      m.id = i + 1;
      if (m.numberEl) {
        m.numberEl.innerText = m.id;
        m.numberEl.dataset.id = m.id;
      }
    });

    setMarkers(newMarkers);
    drawRoute(newMarkers);
  };

  // ---------------------- SAVE LIST ----------------------
  const saveList = () => {
    const list = markers.map((m) => ({
      point_name: m.name,
      longitude: m.lngLat.lng.toFixed(8),
      latitude: m.lngLat.lat.toFixed(8),
    }));
    if (onSavePoints) {
      onSavePoints(list); // Truyền dữ liệu về component cha
    }
  };

  // ---------------------- RENDER ----------------------
  return (
    <div className="MSP-map-container">
      <div className="MSP-sidebar">
        <div ref={geocoderContainer} className="MSP-geocoder-container" />

        <div className="MSP-sidebar-middle">
          <h3>Danh sách điểm</h3>

          <ul>
            {markers.map((m, index) => (
              <li key={m.id} className="MSP-marker-item">
                <div className="MSP-marker-content">
                  <div>
                    <strong>{index + 1}.</strong>
                    <input
                      type="text"
                      value={m.name}
                      onChange={(e) => updateName(index, e.target.value)}
                      className="MSP-marker-name-input"
                    />
                  </div>

                  <span>
                    Lng: {m.lngLat.lng.toFixed(8)}, Lat:{" "}
                    {m.lngLat.lat.toFixed(8)}
                  </span>
                  <button
                    onClick={() => {
                      moveUp(index);
                    }}
                  >
                    MoveUp
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <button onClick={saveList} className="MSP-save-button">
            Lưu
          </button>
        </div>
      </div>

      <div ref={mapContainer} className="MSP-map" />
    </div>
  );
};

export default MapComponent;
