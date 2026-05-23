import React, { useState } from "react";
import "./display.css";
import Tongquan from "./Tongquan";
import Bus from "./Bus";
import Driver from "./Driver";
import Student from "./Student";
import Route from "./Route";
import Schedule from "./Schedule";
import Incident from "./Incident";
import Message from "./Message";

// ===== SVG ICONS =====
const Icons = {
  Dashboard: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
      <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
      <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
    </svg>
  ),
  Bus: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
      <path d="M8 6v6"/><path d="M15 6v6"/><path d="M2 12h19.6"/>
      <path d="M18 18h3s.5-1.7.8-4.3c.3-2.7.4-5.7.2-7.3-.1-.8-.4-1.4-.8-1.4H4c-.4 0-.7.6-.8 1.4-.2 1.6-.1 4.6.2 7.3.3 2.6.8 4.3.8 4.3H6"/>
      <circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>
    </svg>
  ),
  Driver: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
      <circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 1 0-16 0"/>
    </svg>
  ),
  Student: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
    </svg>
  ),
  Route: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
      <circle cx="6" cy="19" r="3"/><path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15"/>
      <circle cx="18" cy="5" r="3"/>
    </svg>
  ),
  Schedule: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  ),
  Incident: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
      <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  ),
  Message: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  ),
  Bell: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
      <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    </svg>
  ),
};

const NAV_ITEMS = [
  { id: 1, label: "Tổng quan",    Icon: Icons.Dashboard },
  { id: 2, label: "Xe bus",       Icon: Icons.Bus       },
  { id: 3, label: "Tài xế",       Icon: Icons.Driver    },
  { id: 4, label: "Học sinh",     Icon: Icons.Student   },
  { id: 5, label: "Tuyến đường",  Icon: Icons.Route     },
  { id: 6, label: "Lịch trình",   Icon: Icons.Schedule  },
  { id: 7, label: "Sự cố",        Icon: Icons.Incident  },
  { id: 8, label: "Nhắn tin",     Icon: Icons.Message   },
];

const PAGE_TITLES = {
  1: "Tổng quan",
  2: "Quản lý xe bus",
  3: "Quản lý tài xế",
  4: "Quản lý học sinh",
  5: "Quản lý tuyến đường",
  6: "Quản lý lịch trình",
  7: "Quản lý sự cố",
  8: "Nhắn tin",
};

// ===== SIDEBAR =====
const Sidebar = ({ currentPage, navigation }) => (
  <div className="sidebar">
    <div className="logo">
      <div className="logo-icon">
        <svg viewBox="0 0 24 24" fill="white" width="18" height="18">
          <path d="M8 6v6M15 6v6M2 12h19.6M18 18h3s.5-1.7.8-4.3c.3-2.7.4-5.7.2-7.3-.1-.8-.4-1.4-.8-1.4H4c-.4 0-.7.6-.8 1.4-.2 1.6-.1 4.6.2 7.3.3 2.6.8 4.3.8 4.3H6"/>
          <circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>
        </svg>
      </div>
      <span>SSB 1.0</span>
    </div>
    <nav>
      <ul>
        {NAV_ITEMS.map(({ id, label, Icon }) => (
          <li
            key={id}
            className={currentPage === id ? "active" : ""}
            onClick={() => navigation(id)}
          >
            <span className="nav-icon"><Icon /></span>
            <span className="nav-label">{label}</span>
          </li>
        ))}
      </ul>
    </nav>
  </div>
);

// ===== HEADER =====
const Header = ({ title }) => (
  <header className="Header">
    <h1>{title}</h1>
    <div className="user-info">
      <div className="icon-bell" title="Thông báo">
        <Icons.Bell />
      </div>
      <div className="avatar">A</div>
      <span className="username">Admin</span>
    </div>
  </header>
);

// ===== DISPLAY (MAIN LAYOUT) =====
const Display = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const renderPage = () => {
    switch (currentPage) {
      case 1: return <Tongquan />;
      case 2: return <Bus />;
      case 3: return <Driver />;
      case 4: return <Student />;
      case 5: return <Route />;
      case 6: return <Schedule />;
      case 7: return <Incident />;
      case 8: return <Message />;
      default: return <Tongquan />;
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar currentPage={currentPage} navigation={setCurrentPage} />
      <div className="main">
        <Header title={PAGE_TITLES[currentPage] || "Tổng quan"} />
        {renderPage()}
      </div>
    </div>
  );
};

export default Display;
