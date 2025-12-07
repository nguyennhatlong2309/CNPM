// ...existing code...
import React, { useState } from 'react';
import styles from './Homepage.module.css';
import { useNavigate, useLocation } from 'react-router-dom'; // <-- thêm useLocation
import { FaBus, FaCog, FaHome, FaBell, FaComment, FaPhone, FaShareAlt } from 'react-icons/fa';

const TripList = ({ trips, onTripSelect }) => (
  <div className={styles.tripList}>
    {trips.map(t => (
      <div
        key={t.id}
        onClick={() => onTripSelect(t)}
        className={styles.tripItem}
      >
        <div style={{ fontWeight: 700 }}>{t.name}</div>
        <div style={{ fontSize: 12, color: '#666' }}>{t.time} — {t.status}</div>
      </div>
    ))}
  </div>
);

const DriverInfoCard = ({ trip, onClose }) => {
  if (!trip) return null;
  // Hiển thị trực tiếp từ trip, nếu thiếu thì show dấu gạch ngang thay vì luôn default cùng 1 tên
  const name = trip.driverName ?? '—';
  const plate = trip.plate ?? '—';
  const eta = trip.eta ?? '—';
  const status = trip.status ?? '—';

  return (
    <div className={styles.driverCard}>
      <div className={styles.cardHeader}>
        <div className={styles.avatar}></div>
        <div className={styles.driverMeta}>
          <div className={styles.driverName}>{name}</div>
          <div className={styles.plate}>{plate}</div>
        </div>
      </div>

      <div className={styles.etaRow}>
        <div className={styles.etaTime}>
          <div className={styles.etaLabel}>Dự kiến đến:</div>
          <div className={styles.etaValue}>{eta}</div>
          <div className={styles.etaSub}>(≈ {trip.etaMinutes ?? '—'} phút)</div>
        </div>
        <div className={styles.etaStatus}>{status}</div>
      </div>

      <div className={styles.cardActions}>
        <button className={styles.actionBtn} onClick={() => alert(`Gọi ${name}`)}>
          <FaPhone className={styles.actionIcon} />
          <div className={styles.actionText}>Gọi</div>
        </button>

        <button className={styles.actionBtn} onClick={() => alert(`Chia sẻ ETA ${eta}`)}>
          <FaShareAlt className={styles.actionIcon} />
          <div className={styles.actionText}>Chia sẻ ETA</div>
        </button>

        <button className={styles.actionBtn} onClick={() => alert('Báo trễ')}>
          <FaBell className={styles.actionIcon} />
          <div className={styles.actionText}>Báo trễ</div>
        </button>
      </div>
    </div>
  );
};
const mockActiveTrips = [
  { id: 1, name: 'Chuyến A101 - Sân bay', status: 'Đang di chuyển', time: '07:30 - 08:30', driverName: 'Nguyễn Văn A', plate: '59A-12345', eta: '09:02', etaMinutes: 8 },
  { id: 2, name: 'Chuyến B202 - Quận 1', status: 'Đang chờ', time: '08:45 - 09:45', driverName: 'Trần Văn B', plate: '60A-43254', eta: '09:00', etaMinutes: 5 },
  { id: 3, name: 'Chuyến C303 - Thủ Đức', status: 'Đang di chuyển', time: '09:00 - 10:00', driverName: 'Lê Thị C', plate: '39A-62552', eta: '09:52', etaMinutes: 10 },
  { id: 4, name: 'Chuyến D404 - Quận 2', status: 'Đang đón', time: '10:00 - 11:00', driverName: 'Phạm D', plate: '70D-11111', eta: '10:05', etaMinutes: 3 },
  { id: 5, name: 'Chuyến E505 - Quận 3', status: 'Đang chờ', time: '11:00 - 12:00', driverName: 'Hoàng E', plate: '81E-22222', eta: '11:10', etaMinutes: 7 },
  { id: 1, name: 'Chuyến A101 - Sân bay', status: 'Đang di chuyển', time: '07:30 - 08:30', driverName: 'Nguyễn Văn A', plate: '59A-12345', eta: '09:02', etaMinutes: 8 },
  { id: 2, name: 'Chuyến B202 - Quận 1', status: 'Đang chờ', time: '08:45 - 09:45', driverName: 'Trần Văn B', plate: '60A-43254', eta: '09:00', etaMinutes: 5 },
  { id: 3, name: 'Chuyến C303 - Thủ Đức', status: 'Đang di chuyển', time: '09:00 - 10:00', driverName: 'Lê Thị C', plate: '39A-62552', eta: '09:52', etaMinutes: 10 },
  { id: 4, name: 'Chuyến D404 - Quận 2', status: 'Đang đón', time: '10:00 - 11:00', driverName: 'Phạm D', plate: '70D-11111', eta: '10:05', etaMinutes: 3 },
  { id: 5, name: 'Chuyến E505 - Quận 3', status: 'Đang chờ', time: '11:00 - 12:00', driverName: 'Hoàng E', plate: '81E-22222', eta: '11:10', etaMinutes: 7 }
];

const HomePage = () => {
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false); // <-- thêm state drawer
  const navigate = useNavigate(); // <-- đảm bảo có dòng này
  const location = useLocation();

  return (
    <div className={styles.mobileFrame}>


      <main className={styles.mainContent}>
        <div className={styles.mapArea}>
          <p className={styles.mapPlaceholder}>[Vị trí Bản đồ sẽ hiển thị ở đây]</p>
        </div>

        <TripList trips={mockActiveTrips} onTripSelect={setSelectedTrip} />

        {/* Thẻ thông tin tài xế — luôn render nhưng toggle class để animate */}
        <div className={`${styles.driverCardWrap} ${selectedTrip ? styles.show : ''}`}>
          <DriverInfoCard trip={selectedTrip} onClose={() => setSelectedTrip(null)} />
          {/* nút đóng */}
          {selectedTrip && (
            <button
              onClick={() => setSelectedTrip(null)}
              style={{
                position: 'absolute',
                top: 8,
                right: 8,
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                fontSize: 18
              }}
              aria-label="Đóng"
            >
              ✕
            </button>
          )}
        </div>
      </main>

    </div>
  );
};

export default HomePage;
// ...existing code...