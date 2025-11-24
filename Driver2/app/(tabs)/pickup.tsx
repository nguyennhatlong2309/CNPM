import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Linking, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import api from '../../src/services/api';
import { Trip, Student, StudentStatus } from '../../src/types';
import { getWS, sendEvent } from '../../src/services/ws';
import { useAuth } from '../../src/context/AuthContext';
import MapboxWeb from '../../src/components/MapboxWeb';
import { MAPBOX_TOKEN } from '../../src/config';
import { geocodeAddress, geocodeMany } from '../../src/services/geocode';
import { useCurrentLocation } from '../../src/hooks/useCurrentLocation';
import { directionsFromCoords } from '../../src/services/directions';

 

export default function PickupScreen() {
  const router = useRouter();
  const { tripId, phase: phaseParam } = useLocalSearchParams<{ tripId?: string; phase?: string }>();
  const phase = phaseParam === 'drop' ? 'drop' : 'pickup';
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { token } = useAuth();
  const [coords, setCoords] = useState<{ lng: number; lat: number } | null>(null);
  const { coords: myLocation } = useCurrentLocation();
  const [routeCoords, setRouteCoords] = useState<number[][] | null>(null);
  const [startPoint, setStartPoint] = useState<{ lng: number; lat: number } | null>(null);
  const [endPoint, setEndPoint] = useState<{ lng: number; lat: number } | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Function to load trip data
  const loadTripData = useCallback(async () => {
    try {
      setLoading(true);
      const r = tripId
        ? await api.get(`/trips/${tripId}`)
        : await api.get('/driver/trips/today');
      
      // Ensure students is always an array
      const tripData = r.data;
      if (tripData && !Array.isArray(tripData.students)) {
        tripData.students = [];
      }
      
      return tripData;
    } catch (error) {
      console.error('Error loading trip data:', error);
      return null;
    } finally {
      setLoading(false);
    }
  }, [tripId, token]);

  // Function to reload trip data
  const reloadTripData = useCallback(async () => {
    try {
      const tripData = await loadTripData();
      if (tripData) {
        setTrip(tripData);
      }
      return tripData;
    } catch (error) {
      console.error('Error reloading trip data:', error);
      return null;
    }
  }, [loadTripData]);

  // Reload data when screen comes into focus or tripId changes
  useFocusEffect(
    useCallback(() => {
      reloadTripData();
    }, [reloadTripData])
  );

  // Initial load
  useEffect(() => {
    let isMounted = true;
    
    const load = async () => {
      const tripData = await loadTripData();
      if (isMounted && tripData) {
        setTrip(tripData);
      }
    };
    
    load();
    
    return () => {
      isMounted = false;
    };
  }, [loadTripData]);

  // Initial load
  useEffect(() => {
    let mounted = true;
    
    const load = async () => {
      try {
        const tripData = await loadTripData();
        if (!mounted || !tripData) return;
        setTrip(tripData);
      } catch (error) {
        console.error('Error loading trip:', error);
        if (!mounted) return;
        setTrip(null);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    
    load();
    
    // Set up WebSocket for real-time updates
    const ws = getWS(token);
    if (ws) {
      const onMessage = (e: any) => {
        try {
          const msg = JSON.parse(e.data);
          if (msg.event === 'trip_updated' && msg.data?.tripId === tripId) {
            load(); // Refresh trip data on update
          }
        } catch (error) {
          console.error('Error processing WebSocket message:', error);
        }
      };
      
      ws.addEventListener('message', onMessage);
      return () => {
        ws.removeEventListener('message', onMessage);
        mounted = false;
      };
    }
    
    return () => { mounted = false; };
  }, [tripId, token]);

  useEffect(() => {
    const ws = getWS(token);
    if (!ws) return;
    
    const onMessage = (e: any) => {
      try {
        const msg = JSON.parse(e.data);
        if (msg.event === 'student_status') {
          // If we have full updated trip data, use it
          if (msg.data.updatedTrip && Array.isArray(msg.data.updatedTrip.students)) {
            setTrip(prevTrip => {
              if (!prevTrip || prevTrip.id !== msg.data.tripId) return prevTrip;
              return {
                ...prevTrip,
                students: msg.data.updatedTrip.students
              };
            });
          } 
          // Otherwise do a partial update
          else if (msg.data.studentId) {
            setTrip(prevTrip => {
              if (!prevTrip || prevTrip.id !== msg.data.tripId) return prevTrip;
              
              const updatedStudents = (prevTrip.students || []).map(s => 
                s.id === msg.data.studentId 
                  ? { ...s, status: msg.data.status } 
                  : s
              );
              
              return { ...prevTrip, students: updatedStudents };
            });
          }
        }
      } catch (error) {
        console.error('Error processing WebSocket message:', error);
      }
    };
    
    ws.addEventListener('message', onMessage);
    return () => {
      ws.removeEventListener('message', onMessage);
    };
  }, [token]); // Removed trip from dependencies to avoid recreating the effect

  const students = useMemo(() => {
    if (!trip || !Array.isArray(trip.students)) return [];
    return [...trip.students].sort((a, b) => {
      const orderA = a.pickupOrder || 0;
      const orderB = b.pickupOrder || 0;
      return orderA - orderB;
    });
  }, [trip?.students]); // Only recompute when students array changes
  
  // Check if all students are picked up or dropped off
  const allCompleted = useMemo(() => {
    if (!Array.isArray(students)) return false;
    if (phase === 'pickup') {
      return students.length > 0 && students.every(s => s.status !== 'pending');
    } else {
      return students.length > 0 && students.every(s => s.status === 'pending' || s.status === 'dropped');
    }
  }, [students, phase]);
  
  // Find next student based on current phase
  const next = useMemo(() => {
    if (allCompleted || !Array.isArray(students)) return null;
    if (phase === 'pickup') {
      return students.find(s => s.status === 'pending');
    } else {
      return students.find(s => s.status === 'picked');
    }
  }, [students, phase, allCompleted]);

  // Geocode next location based on phase
  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!next) { 
        if (mounted) setCoords(null); 
        return; 
      }
      
      try {
        const address = phase === 'pickup' ? next.pickupAddress : next.dropAddress;
        if (!address) return;
        
        const c = await geocodeAddress(address);
        if (mounted) setCoords(c);
      } catch (error) {
        console.error('Geocoding error:', error);
        if (mounted) setCoords(null);
      }
    })();
    return () => { mounted = false; };
  }, [phase, next?.id, next?.status]);

  // Compute full trip route: vehicle/start -> all pending pickups -> end
  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!trip) { if (mounted) setRouteCoords(null); return; }
      // addresses of ALL pickups in route order
      const pickupAddrs = [...students].sort((a,b)=>a.pickupOrder-b.pickupOrder).map(s => s.pickupAddress);
      try {
        const [pickupCoords, endCoord, startCoord] = await Promise.all([
          geocodeMany(pickupAddrs),
          trip.end ? geocodeAddress(trip.end).catch(() => null) : Promise.resolve(null),
          trip.start ? geocodeAddress(trip.start).catch(() => null) : Promise.resolve(null)
        ]);

        const points: { lng: number; lat: number }[] = [];
        if (startCoord) points.push(startCoord as any);
        if (pickupCoords && pickupCoords.length) points.push(...pickupCoords);
        if (endCoord) points.push(endCoord as any);

        if (points.length >= 2) {
          const feat = await directionsFromCoords(points);
          if (mounted) {
            setRouteCoords(feat?.geometry.coordinates ?? null);
            setStartPoint(startCoord as any);
            setEndPoint(endCoord as any);
          }
        } else if (mounted) {
          setRouteCoords(null);
          setStartPoint(startCoord as any);
          setEndPoint(endCoord as any);
        }
      } catch {
        if (mounted) setRouteCoords(null);
      }
    })();
    return () => { mounted = false; };
  }, [trip?.id, JSON.stringify(students.map(s => ({ id: s.id, status: s.status }))), myLocation?.lng, myLocation?.lat]);

  // In drop phase, center map to end point when available
  useEffect(() => {
    if (phase !== 'drop') return;
    if (endPoint) setCoords(endPoint);
  }, [phase, endPoint?.lng, endPoint?.lat]);

  const updateStatus = async (studentId: string, status: StudentStatus) => {
    if (!trip) return;
    
    // Save current state in case we need to revert
    const currentTrip = { ...trip };
    const currentStudents = [...(currentTrip.students || [])];
    
    try {
      // Optimistic UI update
      setTrip(prevTrip => {
        if (!prevTrip) return prevTrip;
        const updatedStudents = (prevTrip.students || []).map(s => 
          s.id === studentId ? { ...s, status } : s
        );
        return { ...prevTrip, students: updatedStudents };
      });
      
      // Update status on server - using the correct endpoint
      const response = await api.post(`/trips/${trip.id}/students/${studentId}/status`, { status });

      
      // Verify the response has the expected data
      if (response.data && response.data.students) {
        // Refresh trip data from server to ensure consistency
        const updatedTrip = await api.get(`/driver/trips/today`);
        if (updatedTrip.data) {
          setTrip(updatedTrip.data);
        }
      } else {
        // If update failed, revert to previous state
        setTrip(currentTrip);
        throw new Error('Cập nhật trạng thái thất bại: Không có dòng nào được cập nhật');
      }
      
      // Notify other clients
      if (sendEvent) {
        sendEvent('trip_updated', { 
          tripId: trip.id,
          studentId, 
          status,
          updatedTrip: trip // Include full trip data in the event
        });
      }
      
    } catch (error: any) {
      console.error('Failed to update status:', error);
      // Revert to previous state on error
      setTrip({
        ...currentTrip,
        students: currentStudents
      });
      
      // Show error to user
      const errorMessage = error?.response?.data?.error || error?.message || 'Có lỗi xảy ra khi cập nhật trạng thái. Vui lòng thử lại.';
      alert(errorMessage);
    }
  };
  
  const callPhone = (phone?: string) => {
    if (!phone) return;
    Linking.openURL(`tel:${phone}`);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Đang tải dữ liệu chuyến đi...</Text>
      </View>
    );
  }

  if (!trip) {
    return (
      <View style={styles.container}>
        <Text>Không tìm thấy thông tin chuyến đi</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Mapbox view: vehicle + next stop + route */}
      <MapboxWeb token={MAPBOX_TOKEN} center={coords} vehicle={myLocation} route={routeCoords} start={startPoint} end={endPoint} height={380} />
      {next ? (
        <View style={styles.nextCard}>
          <Text style={styles.nextTitle}>
            {phase === 'pickup' ? 'Điểm đón kế tiếp' : 'Điểm trả kế tiếp'}
          </Text>
          <Text style={styles.nextName}>{next.name}</Text>
          <Text style={styles.nextAddr}>
            {phase === 'pickup' ? next.pickupAddress : next.dropAddress}
          </Text>
          <View style={styles.row}>
            <TouchableOpacity 
              style={[styles.btn, styles.btnSuccess]} 
              onPress={() => updateStatus(next.id, phase === 'pickup' ? 'picked' : 'dropped')}
            >
              <Text style={styles.btnText}>
                {phase === 'pickup' ? 'Đã đón' : 'Đã trả'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.btn, styles.btnCall]} 
              onPress={() => callPhone(next.phone)}
            >
              <Text style={styles.btnText}>Điện thoại</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : allCompleted ? (
        <View style={[styles.nextCard, { alignItems: 'center' }]}>
          <Text style={[styles.nextTitle, { textAlign: 'center' }]}>
            {phase === 'pickup' ? 'Đã đón hết học sinh' : 'Đã trả hết học sinh'}
          </Text>
          <TouchableOpacity 
            style={[styles.btn, styles.btnSuccess, { marginTop: 12 }]}
            onPress={async () => {
              if (!trip) return;
              try {
                if (phase === 'drop') {
                  // Reset all students to pending for the next trip
                  await Promise.all(
                    trip.students.map(student => 
                      api.post(`/trips/${trip.id}/students/${student.id}/status`, { 
                        status: 'pending' 
                      })
                    )
                  );
                  // Force refresh the trip data before navigating
                  await api.get(`/trips/${trip.id}`);
                }
                // Reset navigation state completely
                router.replace({
                  pathname: '/(tabs)',
                  params: { refresh: Date.now() }
                });
                
                // Force a hard reset of the home screen
                setTimeout(() => {
                  router.replace('/(tabs)');
                }, 100);
              } catch (error) {
                console.error('Failed to reset trip:', error);
                alert('Có lỗi xảy ra khi hoàn thành chuyến đi. Vui lòng thử lại.');
              }
            }}
          >
            <Text style={styles.btnText}>Hoàn thành chuyến đi</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      <Text style={styles.section}>Danh sách</Text>
      <FlatList
        data={students}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.addr}>{item.pickupAddress}</Text>
            </View>
            <View style={styles.row}>
              <TouchableOpacity style={[styles.smallBtn, item.status === 'picked' ? styles.btnActive : styles.btnNeutral]} onPress={() => updateStatus(item.id, item.status === 'picked' ? 'pending' : 'picked')}>
                <Text style={styles.smallText}>Đã đón</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.smallBtn, item.status === 'dropped' ? styles.btnActiveAlt : styles.btnNeutral]} onPress={() => updateStatus(item.id, item.status === 'dropped' ? 'pending' : 'dropped')}>
                <Text style={styles.smallText}>Đã trả</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f1f5f9', 
    padding: 16 
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  nextCard: { 
    backgroundColor: '#fff', 
    padding: 16, 
    borderRadius: 16, 
    marginBottom: 12 
  },
  nextTitle: { 
    fontWeight: '700', 
    marginBottom: 6 
  },
  nextName: { 
    fontWeight: '700', 
    fontSize: 16 
  },
  nextAddr: { 
    color: '#475569', 
    marginBottom: 10 
  },
  row: { 
    flexDirection: 'row', 
    gap: 8, 
    alignItems: 'center' 
  },
  btn: { 
    flex: 1, 
    padding: 12, 
    borderRadius: 12, 
    alignItems: 'center' 
  },
  btnSuccess: { 
    backgroundColor: '#22c55e' 
  },
  btnCall: { 
    backgroundColor: '#f59e0b' 
  },
  btnText: { 
    color: '#fff', 
    fontWeight: '700' 
  },
  section: { 
    fontWeight: '700', 
    marginVertical: 8 
  },
  item: { 
    backgroundColor: '#fff', 
    borderRadius: 12, 
    padding: 12, 
    marginBottom: 8, 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 8 
  },
  name: { 
    fontWeight: '700' 
  },
  addr: { 
    color: '#64748b', 
    maxWidth: 220 
  },
  smallBtn: { 
    paddingVertical: 8, 
    paddingHorizontal: 10, 
    borderRadius: 10, 
    backgroundColor: '#e2e8f0' 
  },
  smallText: { 
    fontSize: 12 
  },
  btnNeutral: { 
    backgroundColor: '#e2e8f0' 
  },
  btnActive: { 
    backgroundColor: '#22c55e' 
  },
  btnActiveAlt: { 
    backgroundColor: '#0ea5e9' 
  }
});
