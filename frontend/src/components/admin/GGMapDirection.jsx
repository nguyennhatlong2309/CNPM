import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken =
  "pk.eyJ1IjoibG9uZ25oYXQyMzkiLCJhIjoiY21pMmc0MGk1MWtndjJqb3FlYmZ4dDFucSJ9.50MnkL8QdWHEcT3inc6tqw";

async function getRoute({ map, places }) {
  const coordinates = places
    .map((p) => `${p.longitude},${p.latitude}`)
    .join(";");

  const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${coordinates}?geometries=geojson&access_token=${mapboxgl.accessToken}`;

  const res = await fetch(url);
  const json = await res.json();

  if (!json.routes?.[0]) {
    console.error("No route found");
    return;
  }

  const route = json.routes[0].geometry.coordinates;

  // XÓA LAYER CŨ
  if (map.getLayer("route-line")) map.removeLayer("route-line");
  if (map.getSource("route-line")) map.removeSource("route-line");

  map.addLayer({
    id: "route-line",
    type: "line",
    source: {
      type: "geojson",
      data: {
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: route,
        },
      },
    },
    paint: {
      "line-color": "rgba(0, 70, 240, 0.9)",
      "line-width": 5,
    },
  });
}

export default function MapboxDirection({
  list_points,
  selectedPoint,
  selectedRouteID,
}) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);

  // Lưu marker để dễ xóa
  const markersRef = useRef([]);

  const lngLatCenter = [
    selectedPoint?.longitude ?? 106.6708,
    selectedPoint?.latitude ?? 10.7676,
  ];

  useEffect(() => {
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: lngLatCenter,
      zoom: 13,
    });

    return () => mapRef.current?.remove();
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Xóa tất cả marker cũ
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    // Xóa route cũ
    if (map.getLayer("route-line")) map.removeLayer("route-line");
    if (map.getSource("route-line")) map.removeSource("route-line");

    // Thêm marker mới
    list_points.forEach((p) => {
      const isSelected = selectedPoint && p.point_id === selectedPoint.point_id;

      // Marker màu
      const markerColor = new mapboxgl.Marker({
        color: isSelected ? "red" : "#9AFFFC",
      })
        .setLngLat([p.longitude, p.latitude])
        .addTo(map);
      markersRef.current.push(markerColor);

      // Marker số thứ tự
      const el = document.createElement("div");
      el.className = "custom-marker";
      el.style.background = "white";
      el.style.padding = "2px 5px";
      el.style.borderRadius = "5px";
      el.style.fontSize = "12px";
      el.style.fontWeight = "bold";
      el.style.boxShadow = "0 0 3px rgba(0,0,0,0.3)";
      el.innerText = p.order_in_route;

      const markerNumber = new mapboxgl.Marker({ element: el, anchor: "top" })
        .setLngLat([p.longitude, p.latitude])
        .addTo(map);
      markersRef.current.push(markerNumber);
    });

    // Route
    if (list_points.length > 1) {
      getRoute({ map, places: list_points });
    }

    // Fly tới điểm được chọn
    if (selectedPoint) {
      map.flyTo({
        center: [selectedPoint.longitude, selectedPoint.latitude],
        zoom: 14,
        speed: 1.5,
      });
    }
  }, [list_points, selectedPoint, selectedRouteID]);

  return (
    <div
      ref={mapContainerRef}
      style={{
        width: "100%",
        height: "100%",
        marginLeft: "5px",
        marginTop: "10px",
        marginRight: "5px",
      }}
    />
  );
}
