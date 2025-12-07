// src/components/TripList.jsx
import React from 'react';
import styles from './Triplist.module.css';

const TripList = ({ trips, onTripSelect }) => {
    return (
        <div className={styles.tripListContainer}>
            <h2 className={styles.listTitle}>Các Chuyến Xe Hoạt Động:</h2>
            {trips.map((trip) => (
                <div 
                    key={trip.id} 
                    className={styles.tripItem}
                    // Khi click, gọi hàm onTripSelect để HomePage hiển thị chi tiết tài xế
                    onClick={() => onTripSelect(trip)} 
                >
                    <div className={styles.tripDetails}>
                        <p className={styles.tripName}>{trip.name}</p>
                        <p className={styles.tripStatus}>{trip.status} | {trip.time}</p>
                    </div>
                    <span className={styles.viewButton}>Xem &gt;</span>
                </div>
            ))}
        </div>
    );
};

export default TripList;