import { useEffect, useState } from 'react';
import * as Location from 'expo-location';

export interface Coords { lng: number; lat: number }

export function useCurrentLocation() {
  const [coords, setCoords] = useState<Coords | null>(null);
  const [granted, setGranted] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let subscription: Location.LocationSubscription | null = null;
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') { setGranted(false); setError('Permission denied'); return; }
        setGranted(true);
        const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
        setCoords({ lng: pos.coords.longitude, lat: pos.coords.latitude });
        subscription = await Location.watchPositionAsync(
          { accuracy: Location.Accuracy.Balanced, distanceInterval: 10 },
          (p) => setCoords({ lng: p.coords.longitude, lat: p.coords.latitude })
        );
      } catch (e: any) {
        setError(e?.message || 'Location error');
      }
    })();
    return () => { subscription?.remove(); };
  }, []);

  return { coords, granted, error };
}
