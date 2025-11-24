import React, { useMemo } from 'react';
import { MAPBOX_STYLE } from '../config';

interface Props {
  token: string;
  center?: { lng: number; lat: number } | null; // next stop
  vehicle?: { lng: number; lat: number } | null; // current vehicle location
  route?: number[][] | null; // [[lng,lat], ...]
  start?: { lng: number; lat: number } | null; // route start
  end?: { lng: number; lat: number } | null; // route end
  height?: number;
  zoom?: number;
}

export default function MapboxWeb({ token, center, vehicle, route, start, end, height = 360, zoom = 14 }: Props) {
  const html = useMemo(() => {
    const lng = (start?.lng ?? center?.lng ?? vehicle?.lng) ?? 106.7009;
    const lat = (start?.lat ?? center?.lat ?? vehicle?.lat) ?? 10.7769; // HCM fallback
    const routeStr = route && route.length > 1 ? JSON.stringify(route) : 'null';
    const nextMarker = center ? `new mapboxgl.Marker({color:'#2563eb'}).setLngLat([${center.lng}, ${center.lat}]).addTo(map);` : '';
    const vehicleMarker = vehicle ? `(() => { const el = document.createElement('div'); el.style.width='28px'; el.style.height='28px'; el.style.backgroundImage='url(https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f68c.svg)'; el.style.backgroundSize='contain'; el.style.backgroundRepeat='no-repeat'; el.style.transform='translate(-14px, -14px)'; new mapboxgl.Marker({ element: el }).setLngLat([${vehicle.lng}, ${vehicle.lat}]).addTo(map); })();` : '';
    const startMarker = start ? `new mapboxgl.Marker({color:'#7c3aed'}).setLngLat([${start.lng}, ${start.lat}]).addTo(map);` : '';
    const endMarker = end ? `new mapboxgl.Marker({color:'#ef4444'}).setLngLat([${end.lng}, ${end.lat}]).addTo(map);` : '';
    return `<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="initial-scale=1,maximum-scale=1,user-scalable=no" />
<link href="https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.css" rel="stylesheet" />
<style> html, body, #map { height: 100%; margin: 0; padding: 0; } .mapboxgl-ctrl-logo{display:none;} </style>
</head>
<body>
<div id="map"></div>
<script src="https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.js"></script>
<script>
  mapboxgl.accessToken = '${token}';
  const map = new mapboxgl.Map({
    container: 'map',
    style: '${MAPBOX_STYLE}',
    center: [${lng}, ${lat}],
    zoom: ${zoom}
  });
  ${nextMarker}
  ${vehicleMarker}
  ${startMarker}
  ${endMarker}
  const route = ${routeStr};
  if (route) {
    map.on('load', () => {
      map.addSource('route', { type: 'geojson', data: { type: 'Feature', geometry: { type: 'LineString', coordinates: route } } });
      map.addLayer({ id: 'route', type: 'line', source: 'route', layout: { 'line-cap': 'round', 'line-join': 'round' }, paint: { 'line-color': '#2563eb', 'line-width': 5 } });
      try {
        const bounds = new mapboxgl.LngLatBounds();
        route.forEach(c => bounds.extend(c));
        ${center ? `bounds.extend([${center.lng}, ${center.lat}]);` : ''}
        ${vehicle ? `bounds.extend([${vehicle.lng}, ${vehicle.lat}]);` : ''}
        ${start ? `bounds.extend([${start.lng}, ${start.lat}]);` : ''}
        ${end ? `bounds.extend([${end.lng}, ${end.lat}]);` : ''}
        map.fitBounds(bounds, { padding: 40, duration: 0 });
      } catch (e) {}
    });
  }
</script>
</body>
</html>`;
  }, [token, center?.lng, center?.lat, vehicle?.lng, vehicle?.lat, start?.lng, start?.lat, end?.lng, end?.lat, zoom, route]);

  return (
    // eslint-disable-next-line react/no-danger
    <div style={{ height, borderRadius: 16, overflow: 'hidden', background: '#e2e8f0' }}>
      {/* @ts-ignore - iframe is available on web */}
      <iframe
        title="mapbox"
        srcDoc={html}
        style={{ border: '0', width: '100%', height: '100%' }}
        sandbox="allow-scripts allow-same-origin"
      />
    </div>
  );
}
