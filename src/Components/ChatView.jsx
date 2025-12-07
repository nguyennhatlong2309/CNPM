import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './ChatView.module.css';
import { FaArrowLeft, FaPhone, FaSmile, FaPaperclip, FaImage, FaPaperPlane } from 'react-icons/fa';

const mockConversations = {
  '1': {
    name: 'Nguyễn Văn A',
    avatar: 'https://i.pravatar.cc/80?img=32',
    messages: [
      { id: 1, fromMe: false, text: 'Anh ơi, mai bé không đi học nên không cần đón nhé.' },
      { id: 2, fromMe: true, text: 'Dạ em nhận được rồi chị, cảm ơn chị đã báo sớm.' },
      { id: 3, fromMe: false, text: 'Xe mình đang gần tới chưa ạ?' },
      { id: 4, fromMe: true, text: 'Chào chị Hương, em vừa đón xong các bé ở điểm trước và đang trên đường đến nhà mình...' },
    ],
  },
  '2': {
    name: 'Nguyễn Văn B',
    avatar: 'https://i.pravatar.cc/80?img=12',
    messages: [
      { id: 1, fromMe: false, text: 'Xin chào, bạn có rảnh...' },
      { id: 2, fromMe: true, text: 'Ok được, tôi đến sau 10 phút.' },
    ],
  },
};

export default function ChatView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const conv = mockConversations[id] || mockConversations['1'];
  const [input, setInput] = React.useState('');
  const messagesRef = React.useRef(null);

  React.useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [conv]);

  const send = () => {
    if (!input.trim()) return;
    // local-only demo: append to DOM (not persisted)
    const node = document.createElement('div');
    node.textContent = input;
    // In real app push to state/store or API.
    setInput('');
    // For now just scroll
    setTimeout(()=> {
      if (messagesRef.current) messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }, 50);
  };

  return (
    <div className={styles.chatWrap}>
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate(-1)} aria-label="back">
          <FaArrowLeft />
        </button>
        <div className={styles.headerCenter}>
          <img className={styles.avatar} src={conv.avatar} alt={conv.name} />
          <div className={styles.title}>
            <div className={styles.name}>{conv.name}</div>
            <div className={styles.sub}>Bạn có 1 tin nhắn mới</div>
          </div>
        </div>
        <div className={styles.headerRight}>
          <button className={styles.iconBtn}><FaPhone /></button>
          <button className={styles.iconBtn}><FaPaperclip /></button>
        </div>
      </div>

      <div className={styles.messages} ref={messagesRef}>
        {conv.messages.map(m => (
          <div key={m.id} className={`${styles.msg} ${m.fromMe ? styles.out : styles.in}`}>
            <div className={styles.bubble}>
              <p>{m.text}</p>
            </div>
          </div>
        ))}

        {/* filler for spacing */}
        <div style={{height:24}} />
      </div>

      <div className={styles.inputBar}>
        <button className={styles.iconBtn}><FaSmile /></button>
        <input
          className={styles.input}
          placeholder="Nhập tin nhắn . . ."
          value={input}
          onChange={(e)=>setInput(e.target.value)}
          onKeyDown={(e)=>{ if(e.key === 'Enter') send(); }}
        />
        <button className={styles.iconBtn}><FaImage /></button>
        <button className={styles.sendBtn} onClick={send}><FaPaperPlane/></button>
      </div>
    </div>
  );
}