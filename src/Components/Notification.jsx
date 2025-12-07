// ...existing code...
import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { FaCog, FaHome, FaBell, FaComment, FaSave, FaTrashAlt } from 'react-icons/fa';
import appStyles from './Homepage.module.css';          // reuse app header/footer styles
import styles from './Notification.module.css';       // notifications content styles

const notificationsBySection = [
  {
    titleLeft: 'Hôm Nay',
    titleRight: '31 Tháng 10',
    items: [
      { id:1, timeLabel:'Thứ 6\n12:09\n2025', title:'Thông báo xe đưa đón', body:'Xe số 03 đang di chuyển đến điểm đón bé Minh. Dự kiến đến nơi trong 7 phút. Phụ huynh vui lòng chuẩn bị cho bé sẵn sàng.', color:'#cfe9ff' },
      { id:2, timeLabel:'Thứ 6\n08:15\n2025', title:'Thông báo sự cố giao thông', body:'Xe 02 đang bị kẹt xe tại đường Trường Chinh. Dự kiến trễ khoảng 10–15 phút.', color:'#ffd2d2' }
    ]
  },
  {
    titleLeft: '3 Ngày Trước',
    titleRight: '28 Tháng 10',
    items: [
      { id:3, timeLabel:'Thứ 3\n17:30\n2025', title:'Cập nhật vị trí học sinh', body:'Bé An đã được xe số 05 đưa đến trường lúc 7h12 sáng nay. Vị trí đã được cập nhật trên bản đồ.', color:'#d7ffd3' },
      { id:4, timeLabel:'Thứ 3\n07:55\n2025', title:'Thông báo thay đổi lịch học', body:'Thứ Sáu tuần này (31/10) các lớp sẽ nghỉ học do nhà trường tổ chức hội thảo giáo viên.', color:'#cfe9ff' }
    ]
  }
];

export default function Notifications() {
  const navigate = useNavigate();
   const [drawerOpen, setDrawerOpen] = useState(false); // <-- add drawer state

  return (
    <div className={appStyles.mobileFrame}>
      {/* main: notifications content only (scrollable) */}
      <main style={{ flex: '1 1 auto', overflow: 'auto' }}>
        <div className={styles.content}>
          {notificationsBySection.map((sec, idx) => (
            <section key={idx} className={styles.section}>
              <div className={styles.sectionHeader}>
                <h3 className={styles.left}>{sec.titleLeft}</h3>
                <div className={styles.right}>{sec.titleRight}</div>
              </div>

              <div className={styles.items}>
                {sec.items.map(item => (
                  <article key={item.id} className={styles.bubbleWrap}>
                    <div className={styles.timeCol}>
                      <div className={styles.timeText}>{item.timeLabel.split('\n')[0]}</div>
                      <div className={styles.timeSmall}>{item.timeLabel.split('\n').slice(1).join(' ')}</div>
                    </div>

                    <div className={styles.bubble} style={{ background: item.color }}>
                      <div className={styles.bubbleTitle}>{item.title}</div>
                      <div className={styles.bubbleBody}>{item.body}</div>

                      <div className={styles.bubbleActions}>
                        <button className={styles.saveBtn} title="Lưu"><FaSave /></button>
                        <button className={styles.delBtn} title="Xóa"><FaTrashAlt /></button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>


    </div>
  );
}
// ...existing code...