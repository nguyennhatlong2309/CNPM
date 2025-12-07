// src/components/DriverInfoCard.jsx
import React from 'react';
import styles from './Driver.module.css';
import { FaPhone, FaShareAlt, FaBell } from 'react-icons/fa';

const DriverInfoCard = ({ trip, onClose }) => {
    // Dữ liệu giả lập chi tiết tài xế
    const mockDriverInfo = {
        name: 'Nguyễn Văn A',
        carPlate: '59A-12345',
        etaTime: '09:02',
        etaMins: 8,
        status: 'Đang di chuyển',
    };

    return (
        <div className={styles.cardContainer}>
            {/* Thanh kéo/Close Card (có thể dùng để kéo xuống) */}
            <div className={styles.dragHandle} onClick={onClose}></div> 

            {/* Thông tin Cơ bản Tài xế */}
            <div className={styles.driverSection}>
                <img 
                    src="/images/placeholder_avatar.png" // Cần thêm ảnh này vào thư mục public/images
                    alt="Driver Avatar" 
                    className={styles.avatar}
                />
                <div className={styles.driverDetails}>
                    <h2 className={styles.driverName}>{mockDriverInfo.name}</h2>
                    <p className={styles.carPlate}>{mockDriverInfo.carPlate}</p>
                </div>
            </div>

            {/* Thông tin Dự kiến Đến */}
            <div className={styles.etaSection}>
                <p className={styles.etaTime}>Dự kiến đến: **{mockDriverInfo.etaTime}** (≈ {mockDriverInfo.etaMins} phút)</p>
                <p className={styles.etaStatus}>{mockDriverInfo.status}</p>
            </div>

            {/* Các Nút Hành động */}
            <div className={styles.actionButtons}>
                {/* Nút Gọi */}
                <div className={styles.actionItem}>
                    <FaPhone className={styles.callIcon} />
                    <p className={styles.actionLabel}>Gọi</p>
                </div>
                
                {/* Nút Chia sẻ ETA */}
                <div className={styles.actionItem}>
                    <FaShareAlt className={styles.shareIcon} />
                    <p className={styles.actionLabel}>Chia sẻ ETA</p>
                </div>

                {/* Nút Báo trễ */}
                <div className={styles.actionItem}>
                    <FaBell className={styles.lateIcon} />
                    <p className={styles.actionLabel}>Báo trễ</p>
                </div>
            </div>
        </div>
    );
};

export default DriverInfoCard;