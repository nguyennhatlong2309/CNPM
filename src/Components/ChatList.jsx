import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ChatList.module.css';
import { FaCircle } from 'react-icons/fa';

const chats = [
  { id: '1', name: 'Nguyễn Văn A', last: 'Xin chào,bạn có rảnh...', time: 'Bây giờ', avatar: 'https://i.pravatar.cc/80?img=32', unread: 0 },
  { id: '2', name: 'Nguyễn Văn B', last: 'Xin chào,bạn có rảnh...', time: '3 phút trước', avatar: 'https://i.pravatar.cc/80?img=12', unread: 1 },
  { id: '3', name: 'Nguyễn Văn C', last: 'Xin chào,bạn có rảnh...', time: '1 giờ trước', avatar: 'https://i.pravatar.cc/80?img=15', unread: 0 },
  { id: '4', name: 'Nguyễn Văn D', last: 'Xin chào,bạn có rảnh...', time: '2 ngày trước', avatar: 'https://i.pravatar.cc/80?img=18', unread: 0 },
];

export default function ChatList() {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Danh Sách Tin Nhắn</h1>
        <p className={styles.sub}>Bạn có {chats.reduce((s,c)=>s + (c.unread?1:0),0)} tin nhắn mới</p>
      </header>

      <div className={styles.list}>
        {chats.map(chat => (
          <div key={chat.id} className={styles.item} onClick={() => navigate(`/chat/${chat.id}`)}>
            <img className={styles.avatar} src={chat.avatar} alt={chat.name} />
            <div className={styles.content}>
              <div className={styles.row}>
                <strong className={styles.name}>{chat.name}</strong>
                <span className={styles.time}>{chat.time}</span>
              </div>
              <div className={styles.row}>
                <p className={styles.last}>{chat.last}</p>
                {chat.unread ? <FaCircle className={styles.unreadDot} /> : null}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}