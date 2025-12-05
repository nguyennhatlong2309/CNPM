import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import "./MapShowPoint.css";

mapboxgl.accessToken =
  "pk.eyJ1IjoibG9uZ25oYXQyMzkiLCJhIjoiY21pMmc0MGk1MWtndjJqb3FlYmZ4dDFucSJ9.50MnkL8QdWHEcT3inc6tqw";

const MapComponent = () => {
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
    const { id, lngLat } = markerData;

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

    // Right click delete
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

  // ---------------------- MAP INIT ----------------------
  useEffect(() => {
    if (map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [105.8342, 21.0278],
      zoom: 10,
    });

    // geocoder
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

    // CLICK MAP -> add marker
    map.current.on("click", (e) => {
      const lngLat = e.lngLat;

      setMarkers((prev) => {
        const newMarker = addMarker({ id: prev.length + 1, lngLat });

        const updated = [...prev, newMarker];
        drawRoute(updated);

        return updated;
      });
    });
  }, []);

  // ---------------------- MOVE UP ----------------------
  const moveUp = (index) => {
    if (index === 0) return;

    const newMarkers = [...markers];
    const temp = newMarkers[index];
    newMarkers[index] = newMarkers[index - 1];
    newMarkers[index - 1] = temp;

    // cập nhật thứ tự
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

  // ---------------------- DRAG END ----------------------
  const onDragEnd = (result) => {
    if (!result.destination) return;

    const newMarkers = Array.from(markers);
    const [removed] = newMarkers.splice(result.source.index, 1);
    newMarkers.splice(result.destination.index, 0, removed);

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

  // ---------------------- RENDER ----------------------
  return (
    <div className="map-container">
      <div className="MSP-sidebar">
        <div ref={geocoderContainer} className="geocoder-container" />

        <h3>Danh sách điểm</h3>

        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="markers">
            {(provided) => (
              <ul {...provided.droppableProps} ref={provided.innerRef}>
                {markers.map((m, index) => (
                  <Draggable
                    key={m.id}
                    draggableId={m.id.toString()}
                    index={index}
                  >
                    {(prov) => (
                      <li
                        ref={prov.innerRef}
                        {...prov.draggableProps}
                        {...prov.dragHandleProps}
                        className="marker-item"
                      >
                        <strong>{index + 1}.</strong> Lng:{" "}
                        {m.lngLat.lng.toFixed(4)}, Lat:{" "}
                        {m.lngLat.lat.toFixed(4)}
                        <div>
                          <button onClick={() => moveUp(index)}>MoveUp</button>
                        </div>
                      </li>
                    )}
                  </Draggable>
                ))}

                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext>
      </div>

      <div ref={mapContainer} className="map" />
    </div>
  );
};

export default MapComponent;
