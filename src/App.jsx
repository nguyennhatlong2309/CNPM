// ...existing code...
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import LoginScreen from './Components/Login.jsx';
import HomePage from './Components/Homepage.jsx';
import Notifications from './Components/Notification.jsx';
import appStyles from './Components/Homepage.module.css';
import { FaBus, FaCog, FaHome, FaBell, FaComment } from 'react-icons/fa';
import ChatList from './Components/ChatList.jsx';
import ChatView from './Components/ChatView.jsx';

function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [confirmLogoutOpen, setConfirmLogoutOpen] = React.useState(false);

  const isLogin = location.pathname === '/' || location.pathname === '/login';

  // nếu đang ở login -> render routes của login riêng, KHÔNG show header/footer
  if (isLogin) {
    return (
      <Routes>
        <Route path="/" element={<LoginScreen />} />
        <Route path="/login" element={<LoginScreen />} />
      </Routes>
    );
  }

  const title =
    location.pathname === '/notifications' ? 'Thông Báo' :
    location.pathname === '/home' ? 'Trang chủ' :
    location.pathname.startsWith('/chat') ? 'Tin nhắn' :
     'Ứng dụng';


  const LeftIcon = 
    location.pathname === '/notifications' ? FaBell :
    location.pathname.startsWith('/chat') ? FaComment :
    FaBus;
  

  return (
    
    <div className={appStyles.mobileFrame}>
      {/* header (shared) */}
      <header className={appStyles.header}>
        <div className={appStyles.headerLeft}>
          <LeftIcon className={appStyles.logoIcon} />
          <span className={appStyles.title}>{title}</span>
        </div>

        <button
          className={appStyles.settingsBtn}
          onClick={() => setDrawerOpen(true)}
          aria-label="Cài đặt"
        >
          <FaCog className={appStyles.settingsIcon} />
        </button>
      </header>

      {/* main area: routes render inside here */}
      <main style={{ flex: '1 1 auto', overflow: 'auto' }}>
        <Routes>
          <Route path="/" element={<LoginScreen />} />
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/chat" element={<ChatList />} />
          <Route path="/chat/:id" element={<ChatView />} />
        </Routes>
      </main>

      {/* global drawer (reuse styles from Homepage.module.css) */}
      <div
        className={`${appStyles.drawerOverlay} ${drawerOpen ? appStyles.show : ''}`}
        onClick={() => setDrawerOpen(false)}
        role="button"
        aria-hidden={!drawerOpen}
      />

      <aside className={`${appStyles.drawer} ${drawerOpen ? appStyles.open : ''}`} aria-hidden={!drawerOpen}>
        <div className={appStyles.drawerHeader}>
          <h3>Tài khoản</h3>
          <button className={appStyles.drawerClose} onClick={() => setDrawerOpen(false)} aria-label="Đóng">✕</button>
        </div>

        <div className={appStyles.drawerContent}>
          <div className={appStyles.parentInfo}>
            <div className={appStyles.parentAvatar} />
            <div>
              <div className={appStyles.parentName}>Phụ huynh: Trần Thị X</div>
              <div className={appStyles.parentPhone}>+84 9xx xxx xxx</div>
              <div className={appStyles.parentEmail}>parent@example.com</div>
            </div>
          </div>

          <hr />
          
          <button
            className={appStyles.logoutBtn}
            onClick={() => {
              // mở dialog xác nhận, vẫn giữ drawer mở/đóng theo modal
              setConfirmLogoutOpen(true);
            }}
          >
            Đăng xuất
          </button>
        </div>
      </aside>

            {confirmLogoutOpen && (
        <div className={appStyles.modalOverlay} onClick={() => setConfirmLogoutOpen(false)}>
          <div className={appStyles.modal} onClick={(e)=>e.stopPropagation()}>
            <p>Bạn có chắc muốn đăng xuất không?</p>
            <div style={{display:'flex', gap:8, marginTop:12}}>
              <button onClick={() => setConfirmLogoutOpen(false)}>Huỷ</button>
              <button onClick={()=>{
                setConfirmLogoutOpen(false);
                setDrawerOpen(false);
                try { localStorage.removeItem('token'); } catch(e){}
                navigate('/login');
              }}>Đăng xuất</button>
            </div>
          </div>
        </div>
      )}

      {/* single global footer (shared) */}
      <footer className={appStyles.footerNav}> 
        <button
          className={`${appStyles.navItemBtn} ${location.pathname === '/home' ? appStyles.navActive : ''}`}
          onClick={() => navigate('/home')}
          aria-label="Trang chủ"
        >
          <FaHome className={appStyles.icon} />
        </button>

        <button
          className={`${appStyles.navItemBtn} ${location.pathname === '/notifications' ? appStyles.navActive : ''}`}
          onClick={() => navigate('/notifications')}
          aria-label="Thông báo"
        >
          <FaBell className={appStyles.icon} />
        </button>

        <button
          className={`${appStyles.navItemBtn} ${location.pathname === '/chat' ? appStyles.navActive : ''}`}
          onClick={() => navigate('/chat')}
          aria-label="Tin nhắn"
        >
          <FaComment className={appStyles.icon} />
        </button>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}
// ...existing code...