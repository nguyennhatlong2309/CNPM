# Task Tracker - SSB Frontend UI Upgrade

## Phase 1: Stitch Setup
- [x] Tạo Stitch project "SSB-Admin-Dashboard"
- [x] Tạo Design System (Dark Glassmorphism, Indigo accent)
- [x] Update Design System

## Phase 2: Screen Generation
- [x] Screen 1 - Tổng quan (Dashboard)
- [x] Screen 2 - Xe Buýt
- [x] Screen 3 - Tài xế
- [x] Screen 4 - Học sinh
- [x] Screen 5 - Tuyến đường
- [x] Screen 6 - Lịch trình
- [x] Screen 7 - Sự cố
- [x] Screen 8 - Nhắn tin

## Phase 3: CSS Implementation
- [x] index.css - Global design tokens + Google Fonts
- [x] display.css - Sidebar + Header
- [x] Tongquan.css - Stats cards + Dashboard layout
- [x] Bus.css - Table + modal
- [x] Driver.css - Table + detail panel
- [x] Student.css - Table + form
- [x] Route.css - Split layout + map
- [x] Schedule.css - Calendar grid
- [x] Incident.css - Table + detail
- [x] Message.css - Chat UI (đổi .main → .chat-main tránh conflict layout)
- [x] display.jsx - Thêm SVG icons cho sidebar nav items
- [x] Incident.jsx - Fix class names (incident-detail, incident-severity, incident-actions)
- [x] Message.jsx - Fix class conflict (.main → .chat-main)

## Phase 4: Verification
- [x] Build check (npm run build - OK, 0 errors)
- [x] Dev server chạy tại http://localhost:5173/
- [x] Visual review 8 screens & fixing class names (Student, Route, Schedule)
- [ ] API integration spot-check (cần backend)

