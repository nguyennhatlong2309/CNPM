import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken =
  "pk.eyJ1IjoibG9uZ25oYXQyMzkiLCJhIjoiY21pMmc0MGk1MWtndjJqb3FlYmZ4dDFucSJ9.50MnkL8QdWHEcT3inc6tqw";

// ⚠️ Sửa lại TẤT CẢ toạ độ thành [lng, lat]
const list_place = [
  {
    start: [106.682, 10.7626],
    end: [106.6597, 10.7725],
  },
  {
    start: [106.70361551579074, 10.797543545480988],
    end: [106.70088406870119, 10.79103550113593],
  },
  {
    start: [106.7170083323355, 10.804989765729758],
    end: [106.7062740491795, 10.792830298172355],
  },
  {
    start: [106.66666391691976, 10.796944379543751],
    end: [106.67791019571969, 10.773743470119438],
  },
];

async function getRoute({ map, start, end, index }) {
  const layerID = `route-${index}`;

  const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]},${start[1]};${end[0]},${end[1]}?geometries=geojson&access_token=${mapboxgl.accessToken}`;

  const res = await fetch(url);
  const json = await res.json();

  if (!json.routes || !json.routes[0]) {
    console.error("No route found for:", start, end);
    return;
  }

  const route = json.routes[0].geometry.coordinates;

  map.addLayer({
    id: layerID,
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
    layout: {
      "line-cap": "round",
      "line-join": "round",
    },
    paint: {
      "line-color": "#000fe7",
      "line-width": 5,
      "line-opacity": 0.75,
    },
  });
}

export default function MapboxDirection() {
  const mapContainerRef = useRef(null);

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [106.6708, 10.7676],
      zoom: 13,
    });

    map.on("load", () => {
      list_place.forEach((p, i) =>
        getRoute({ map, start: p.start, end: p.end, index: i })
      );
    });

    return () => map.remove();
  }, []);

  return (
    <div ref={mapContainerRef} style={{ width: "100%", height: "100%" }} />
  );
}
