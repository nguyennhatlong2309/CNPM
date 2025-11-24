import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import api from '../../src/services/api';
import { Trip, Student } from '../../src/types';
import { useAuth } from '../../src/context/AuthContext';

export default function HomeScreen() {
  const [trip, setTrip] = useState<Trip | null>(null);
  const router = useRouter();
  const { user } = useAuth();

  // Calculate phase and completion status using useMemo
  const { phase, allPicked } = useMemo(() => {
    // Initialize with default values if trip or students is not available
    if (!trip || !Array.isArray(trip.students)) {
      return { phase: 'pickup' as const, allPicked: false };
    }
    
    // Add safe array checks
    const students = trip.students || [];
    const hasPending = students.some((s: any) => s?.status === 'pending');
    const hasPicked = students.some((s: any) => s?.status === 'picked');
    const allDropped = students.every((s: any) => 
      s?.status === 'dropped' || s?.status === 'pending'
    );
    
    let phase: 'pickup' | 'drop' | 'complete' = 'pickup';
    let allPicked = false;
    
    if (hasPending) {
      phase = 'pickup';
      allPicked = !hasPending && hasPicked;
    } else if (hasPicked) {
      phase = 'drop';
    } else if (allDropped) {
      // If all students are either dropped or pending, reset to pickup phase
      phase = 'pickup';
    }
    
    return { phase, allPicked };
  }, [trip]);
  
  let isMounted = true;
  const fetchTripData = async () => {
      try {
        const response = await api.get('/driver/trips/today');
        if (isMounted) {
          // Ensure students is always an array
          const tripData = response.data;
          if (tripData && !Array.isArray(tripData.students)) {
            tripData.students = [];
          }
          setTrip(tripData);
        }
      } catch (error) {
        console.error('Error fetching trip data:', error);
        if (isMounted) {
          setTrip(null);
        }
      }
    };
  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      
      const loadData = async () => {
        try {
          await fetchTripData();
        } catch (error) {
          console.error('Error refreshing trip data:', error);
        }
      };
      
      loadData();
      
      return () => {
        isActive = false;
      };
    }, [])
  );
  // First useEffect for fetching trip data
  useEffect(() => {
    
    fetchTripData();
    
    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, []);

  // Handle trip completion and phase transitions
  useEffect(() => {
    let mounted = true;
    
    const resetTrip = async () => {
      if (!trip) return;
      
      try {
        // Reset all students to pending status
        await Promise.all(
          trip.students.map(student => 
            api.post(`/trips/${trip.id}/students/${student.id}/status`, { 
              status: 'pending' 
            })
          )
        );
        
        // Refresh trip data
        const response = await api.get('/driver/trips/today');
        if (!mounted) return;
        setTrip(response.data);
        
      } catch (error) {
        console.error('Failed to reset trip:', error);
      }
    };

    // If all students are dropped, reset them to pending
    if (trip && phase === 'drop' && trip.students.every(s => s.status === 'dropped')) {
      resetTrip();
    }
    
    return () => { 
      mounted = false; 
    };
  }, [trip?.id, phase, trip?.students]);

  // Move the conditional return after all hooks
  if (!trip) return null;

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: 'https://images.unsplash.com/photo-1520975940471-7b1c2d42c2f1?q=80&w=1200&auto=format&fit=crop' }}
        style={styles.banner}
        resizeMode="cover"
      />
      <View style={styles.card}>
        <Text style={styles.greeting}>Xin chào, {user?.name || 'Tài xế'}</Text>
        <Text style={styles.title}>{trip.routeName}</Text>
        <Text style={styles.subtitle}>Xuất phát: {trip.departTime}</Text>
        <Text style={styles.subtitle}>{phase === 'pickup' ? 'Đón học sinh' : 'Trả học sinh'}</Text>
        <Text style={styles.section}>
          {phase === 'pickup' ? 'Danh sách đón' : 'Danh sách trả'}
        </Text>
        <FlatList
          data={[...trip.students]
            .sort((a,b) => a.pickupOrder - b.pickupOrder)
            .filter(student => 
              (phase === 'pickup' && (student.status === 'pending' || student.status === 'picked')) || 
              (phase === 'drop' && student.status === 'picked')
            )}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={[
              styles.studentItem,
              item.status === 'picked' && styles.pickedStudent,
              item.status === 'dropped' && styles.droppedStudent
            ]}>
              <Text style={styles.studentName}>
                {item.name}
                {item.status === 'picked' && ' ✓'}
              </Text>
              <Text style={styles.studentAddress}>
                {phase === 'pickup' ? item.pickupAddress : item.dropAddress}
              </Text>
              <View style={styles.statusContainer}>
                <View style={[
                  styles.statusBadge,
                  item.status === 'pending' && styles.statusPending,
                  item.status === 'picked' && styles.statusPicked,
                  item.status === 'dropped' && styles.statusDropped
                ]}>
                  <Text style={styles.statusText}>
                    {item.status === 'pending' ? 'Chờ đón' : 
                     item.status === 'picked' ? 'Đã đón' : 'Đã trả'}
                  </Text>
                </View>
              </View>
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              {phase === 'pickup' 
                ? 'Đã đón hết học sinh' 
                : 'Đã trả hết học sinh'}
            </Text>
          }
        />
        {allPicked && phase === 'pickup' ? (
          <TouchableOpacity 
            style={[styles.primaryBtn, { backgroundColor: '#ef4444' }]} 
            onPress={() => {
              // Mark all students as picked and switch to drop phase
              const updatedTrip = {
                ...trip,
                students: trip.students.map(s => ({
                  ...s,
                  status: s.status === 'pending' ? 'picked' : s.status
                }))
              };
              setTrip(updatedTrip);
            }}
          >
            <Text style={styles.primaryBtnText}>Hoàn thành chuyến đón</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            style={styles.primaryBtn} 
            onPress={() => router.push({ 
              pathname: '/pickup', 
              params: { 
                tripId: trip.id, 
                phase: phase === 'pickup' ? 'pickup' : 'drop' 
              } 
            })}
          >
            <Text style={styles.primaryBtnText}>
              {phase === 'pickup' ? 'Bắt đầu đón học sinh' : 'Bắt đầu trả học sinh'}
            </Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={[styles.primaryBtn, { backgroundColor: '#0ea5e9', marginTop: 8 }]} onPress={() => router.push({ pathname: './profile' })}>
          <Text style={styles.primaryBtnText}>Xem hồ sơ tài xế</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f1f5f9', padding: 16 },
  banner: { width: '100%', height: 140, borderRadius: 16, marginBottom: 12 },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 16, gap: 8, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6 },
  greeting: { fontSize: 14, color: '#64748b' },
  title: { fontSize: 18, fontWeight: '700' },
  subtitle: { color: '#475569' },
  section: { marginTop: 10, fontWeight: '600' },
  studentItem: { 
    padding: 12, 
    borderBottomColor: '#e2e8f0', 
    borderBottomWidth: 1, 
    borderRadius: 8,
    marginBottom: 4,
    backgroundColor: 'white'
  },
  studentName: { fontWeight: '600' },
  studentAddress: { 
    color: '#64748b',
    marginTop: 4
  },
  statusText: {
    marginTop: 4,
    fontSize: 12,
    color: '#4f46e5',
    fontWeight: '500'
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
    fontStyle: 'italic'
  },
  pickedStudent: {
    backgroundColor: '#f0fdf4',
    borderLeftWidth: 4,
    borderLeftColor: '#10b981',
  },
  droppedStudent: {
    opacity: 0.7,
    backgroundColor: '#f8fafc',
  },
  statusContainer: {
    marginTop: 4,
    alignSelf: 'flex-start',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  statusPending: {
    backgroundColor: '#e0f2fe',
  },
  statusPicked: {
    backgroundColor: '#dcfce7',
  },
  statusDropped: {
    backgroundColor: '#f1f5f9',
  },
  primaryBtn: { marginTop: 12, backgroundColor: '#22c55e', padding: 12, borderRadius: 12, alignItems: 'center' },
  primaryBtnText: { color: '#fff', fontWeight: '700' }
});
