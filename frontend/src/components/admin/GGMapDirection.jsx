import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken =
  "pk.eyJ1IjoibG9uZ25oYXQyMzkiLCJhIjoiY21pMmc0MGk1MWtndjJqb3FlYmZ4dDFucSJ9.50MnkL8QdWHEcT3inc6tqw";

export default function MapboxDirection() {
  const mapContainerRef = useRef(null);

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current, // Thẻ DOM được tham chiếu
      style: "mapbox://styles/mapbox/streets-v12",
      center: [106.6708, 10.7676], // Trung tâm giữa hai điểm
      zoom: 13,
    });

    const start = [106.682, 10.7626]; // Đại học Sài Gòn
    const end = [106.6597, 10.7725]; // Đại học Bách Khoa

    async function getRoute() {
      const query = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]},${start[1]};${end[0]},${end[1]}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`
      );
      const json = await query.json();
      const data = json.routes[0];
      const route = data.geometry.coordinates;

      // Thêm tuyến đường (line)
      map.addLayer({
        id: "route",
        type: "line",
        source: {
          type: "geojson",
          data: {
            type: "Feature",
            properties: {},
            geometry: {
              type: "LineString",
              coordinates: route,
            },
          },
        },
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "#0616FF",
          "line-width": 5,
          "line-opacity": 0.75,
        },
      });

      // Thêm điểm bắt đầu (circle)
      map.addLayer({
        id: "start",
        type: "circle",
        source: {
          type: "geojson",
          data: {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: start,
            },
          },
        },
        paint: {
          "circle-radius": 10,
          "circle-color": "#f30",
        },
      });

      // Thêm điểm kết thúc
      map.addLayer({
        id: "end",
        type: "circle",
        source: {
          type: "geojson",
          data: {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: end,
            },
          },
        },
        paint: {
          "circle-radius": 10,
          "circle-color": "#0f0",
        },
      });
    }

    map.on("load", getRoute);

    return () => map.remove(); // Cleanup khi unmount
  }, []);

  return (
    <div ref={mapContainerRef} style={{ width: "100%", height: "100%" }} />
  );
}
