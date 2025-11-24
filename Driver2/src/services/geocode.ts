import { MAPBOX_TOKEN } from '../config';

export interface Coords { lng: number; lat: number }

export async function geocodeAddress(address: string, token = MAPBOX_TOKEN): Promise<Coords> {
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?limit=1&language=vi&access_token=${token}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Geocoding failed');
  const json = await res.json();
  const center = json?.features?.[0]?.center as [number, number] | undefined;
  if (!center) throw new Error('No result');
  return { lng: center[0], lat: center[1] };
}

export async function geocodeMany(addresses: string[], token = MAPBOX_TOKEN) {
  const results = await Promise.all(addresses.map(async (a) => {
    try { return await geocodeAddress(a, token); } catch { return null; }
  }));
  return results.filter(Boolean) as Coords[];
}
