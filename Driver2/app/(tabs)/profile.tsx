import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useAuth } from '../../src/context/AuthContext';
import api from '../../src/services/api';

interface DriverProfile {
  id: string;
  name: string;
  phone?: string;
  plate?: string;
  vehicleType?: string;
  license?: string;
  busStatus?: string;
  shiftStart?: string;
  shiftEnd?: string;
  status?: 'active' | 'inactive';
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { backgroundColor: '#1e88e5', padding: 20, alignItems: 'center', paddingBottom: 30 },
  avatarContainer: {
    width: 100, height: 100, borderRadius: 50, backgroundColor: '#fff',
    justifyContent: 'center', alignItems: 'center', marginBottom: 15, elevation: 5
  },
  avatar: { width: 90, height: 90, borderRadius: 45 },
  name: { fontSize: 22, fontWeight: 'bold', color: '#fff', marginBottom: 5 },
  phone: { fontSize: 16, color: '#e0e0e0' },
  section: {
    backgroundColor: '#fff', margin: 10, borderRadius: 10,
    padding: 15, elevation: 2
  },
  sectionTitle: {
    fontSize: 18, fontWeight: 'bold', marginBottom: 15, color: '#333',
    borderBottomWidth: 1, borderBottomColor: '#eee', paddingBottom: 8
  },
  infoItem: {
    flexDirection: 'row', justifyContent: 'space-between',
    marginBottom: 12, alignItems: 'center'
  },
  infoLabel: { fontSize: 16, color: '#666', flex: 1 },
  infoValue: { fontSize: 16, fontWeight: '500', color: '#333', flex: 1, textAlign: 'right' },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12, justifyContent: 'center' },
  statusActive: { backgroundColor: '#e8f5e9' },
  statusInactive: { backgroundColor: '#ffebee' },
  statusText: { fontWeight: '500', fontSize: 14, color: '#333' },
  logoutButton: {
    backgroundColor: '#e53935', margin: 20, padding: 15,
    borderRadius: 8, alignItems: 'center', justifyContent: 'center', elevation: 2
  },
  logoutButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});

export default function ProfileScreen() {
  const { user, signOut, isLoading: isAuthLoading } = useAuth();
  const [profile, setProfile] = useState<DriverProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch additional profile data
  useEffect(() => {
    let isMounted = true;
    
    const fetchProfile = async () => {
      if (!user) return;
      
      try {
        const response = await api.get('/driver/profile',{
          params: { id: user.id } 
        });
        if (isMounted) {
          setProfile(response.data);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        // Don't show error to user, we still have basic user data from auth
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    if (!isAuthLoading) {
      fetchProfile();
    } else {
      setIsLoading(true);
    }

    return () => { isMounted = false };
  }, [user, isAuthLoading]);

  const handleLogout = async () => {
    try { 
      await signOut();
      // Navigation is handled by the root navigator based on auth state
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert('Lỗi', 'Đăng xuất không thành công');
    }
  };

  // Show loading state only for initial auth check
  if (isAuthLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Đang tải...</Text>
      </View>
    );
  }

  // If no user is authenticated, show login prompt
  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Vui lòng đăng nhập để xem thông tin</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Image
            source={{ uri: 'https://api.dicebear.com/7.x/initials/png?seed=' + encodeURIComponent(user?.name || 'TX') }}
            style={styles.avatar}
          />
        </View>

        <Text style={styles.name}>{user.name || 'Tài xế'}</Text>
        <Text style={styles.phone}>{user.phone || 'Chưa cập nhật'}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Thông tin cá nhân</Text>

        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Mã tài xế:</Text>
          <Text style={styles.infoValue}>{user?.id || 'N/A'}</Text>
        </View>

        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Biển số xe:</Text>
          <Text style={styles.infoValue}>{user?.plate || 'Chưa cập nhật'}</Text>
        </View>

        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Giấy phép:</Text>
          <Text style={styles.infoValue}>{user?.license || 'Chưa cập nhật'}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ca làm việc</Text>

        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Bắt đầu:</Text>
          <Text style={styles.infoValue}>{user?.shiftStart || 'Chưa cập nhật'}</Text>
        </View>

        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Kết thúc:</Text>
          <Text style={styles.infoValue}>{user?.shiftEnd || 'Chưa cập nhật'}</Text>
        </View>

        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Trạng thái:</Text>
          <View style={[
            styles.statusBadge,
            user?.status === 'inactive' ? styles.statusInactive : styles.statusActive
          ]}>
            <Text style={styles.statusText}>
              {user?.status === 'inactive' ? 'Không hoạt động' : 'Đang hoạt động'}
            </Text>
          </View>
        </View>

        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Tình trạng xe buýt:</Text>
          <Text style={styles.infoValue}>{user?.busStatus === 'dangchay' ? 'Đang chạy' : 
              user?.busStatus === 'dung' ? 'Đã dừng' : 
              'Chưa cập nhật'}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Đăng xuất</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
