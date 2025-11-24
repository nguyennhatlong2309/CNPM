import { MAPBOX_TOKEN } from '../config';
import type { Coords } from '../hooks/useCurrentLocation';

export type LineString = { type: 'LineString'; coordinates: number[][] };
export type Feature = { type: 'Feature'; geometry: LineString; properties?: any };

export async function directionsFromCoords(points: Coords[], token: string = MAPBOX_TOKEN): Promise<Feature | null> {
  if (!points || points.length < 2) return null;
  const path = points.map(p => `${p.lng},${p.lat}`).join(';');
  const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${path}?geometries=geojson&overview=full&access_token=${token}`;
  const res = await fetch(url);
  if (!res.ok) return null;
  const json = await res.json();
  const geom = json?.routes?.[0]?.geometry;
  if (!geom) return null;
  return { type: 'Feature', geometry: geom } as Feature;
}
