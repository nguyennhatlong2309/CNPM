# Kế hoạch Nâng cấp Giao diện Frontend - Hệ thống Quản lý Xe Buýt Học sinh (SSB)

## Tổng quan dự án

Hệ thống hiện tại là một **Admin Dashboard** dạng SPA (Single Page Application) xây dựng bằng **React + Vite**, quản lý xe buýt đưa đón học sinh. Giao diện hiện tại sử dụng CSS thuần và emoji làm icon, chưa có design system nhất quán. Mục tiêu là nâng cấp toàn bộ UI thành dạng Premium Modern Dashboard trong khi **giữ nguyên 100% logic nghiệp vụ và API calls**.

---

## Phân tích Kiến trúc Frontend Hiện tại

### Cấu trúc File
```
frontend/src/
├── App.jsx                    # Root component → render Display
├── index.css / App.css        # CSS gốc (minimal)
├── firebase.js                # Firebase config (có thể cho auth sau này)
└── components/admin/
    ├── display.jsx            # Layout chính: Sidebar + Header + content switch
    ├── Tongquan.jsx           # Dashboard overview (cards + map + alerts)
    ├── Bus.jsx                # CRUD Xe buýt
    ├── Driver.jsx             # CRUD Tài xế
    ├── Student.jsx            # CRUD Học sinh
    ├── Route.jsx              # CRUD Tuyến đường + Mapbox integration
    ├── Schedule.jsx           # Lịch trình theo tuần (calendar grid)
    ├── Incident.jsx           # Quản lý sự cố
    ├── Message.jsx            # Chat với người dùng
    ├── GGMapDirection.jsx     # Google Maps component
    └── MapShowPoint.jsx       # Mapbox point picker
```

### Bản đồ API Endpoints (cần giữ nguyên)
| Màn hình | Endpoints |
|---|---|
| Tổng quan | `GET /api/bus`, `/api/drivers`, `/api/student`, `/api/incidents` |
| Xe buýt | `GET /api/bus/WDNameRName`, `POST/PUT/DELETE /api/bus/:id`, `/api/route`, `/api/drivers` |
| Tài xế | `GET /api/drivers/getAllWBusRouteUser`, `POST/PUT/DELETE /api/drivers/:id`, `/api/bus` |
| Học sinh | `GET /api/student/FL`, `POST/PUT/DELETE /api/student/:id`, `/api/route`, `/api/point`, `/api/parent` |
| Tuyến đường | `GET/POST/PUT /api/route`, `/api/point`, `/api/point/multiple`, `/api/point/delete/multiple` |
| Lịch trình | `GET /api/route`, `/api/drivers`, `/api/bus`, `/api/trip/MaxMinDate`, `/api/trip/time-range`, `POST/PUT /api/trip` |
| Sự cố | `GET /api/incidents` |
| Nhắn tin | `GET /api/user`, `GET/POST /api/message` |

### Các điểm yếu UI hiện tại
1. **Sidebar**: Chỉ có emoji + text, không có icon library, không có active state visual rõ ràng
2. **Header**: Thông tin cứng "Nguyễn Văn A", không có user avatar thật
3. **Tables**: Custom div-based tables, không có sorting/pagination
4. **Modals/Popups**: CSS popup đơn giản, thiếu animation
5. **Color System**: Màu được hard-code tùy tiện (#729dfc, #8ef24f, ...)
6. **Typography**: Browser default fonts
7. **Cards (Tổng quan)**: Màu nền mạnh, thiếu glassmorphism/modern feel
8. **No Dark Mode**
9. **No Micro-animations/Transitions**

---

## User Review Required

> [!IMPORTANT]
> **Chiến lược tích hợp code**: Sau khi Stitch generate ra HTML/CSS design, tôi sẽ trích xuất các design tokens (CSS variables) và layout patterns từ Stitch, rồi **viết lại CSS** cho các component React hiện có - KHÔNG thay thế toàn bộ component logic. Cách này đảm bảo API calls và state management được bảo toàn hoàn toàn.

> [!WARNING]
> **Mapbox & Google Maps**: Các component `Route.jsx` (dùng Mapbox GL) và `GGMapDirection.jsx`, `MapShowPoint.jsx` (dùng Google Maps) sẽ được **giữ nguyên logic map**, chỉ nâng cấp container CSS và thanh công cụ xung quanh chúng.

> [!NOTE]
> **Stitch Output**: Stitch generate ra Figma-like designs. Tôi sẽ dùng output của Stitch làm **visual reference** để tạo CSS chính xác, không phải copy code trực tiếp (vì Stitch tạo HTML tĩnh, không phải React components).

---

## Open Questions

> [!IMPORTANT]
> **Câu hỏi 1**: Bạn muốn giao diện theo phong cách nào?
> - **A) Dark Premium** (nền tối #0f1117 ~ #1a1d2e, accent màu tím/xanh indigo): Cảm giác như Vercel, Linear
> - **B) Light Clean** (nền trắng với sidebar navy): Cảm giác như Notion, Retool
> - **C) Dark Glassmorphism** (nền gradient tối, cards mờ blur): Cảm giác như Raycast, Arc Browser
>
> *(Mặc định sẽ chọn C nếu không có phản hồi)*

> [!NOTE]
> **Câu hỏi 2**: Có muốn thêm tính năng mới trong lần nâng cấp này không?
> - [ ] Trang đăng nhập (Login screen)
> - [ ] Pagination cho các bảng dữ liệu
> - [ ] Toast notifications thay cho `window.alert()`
> - [ ] Responsive mobile layout
>
> *(Mặc định: chỉ nâng cấp UI, không thêm feature mới)*

---

## Proposed Changes

### Phase 1: Stitch Project Setup & Design System

#### Bước 1.1: Tạo Stitch Project
- Dùng `create_project` MCP tool để khởi tạo project `"SSB-Admin-Dashboard"`

#### Bước 1.2: Tạo Design System
Dùng `create_design_system` với các thông số:
- **Color Mode**: DARK
- **Custom Color**: `#6366f1` (Indigo - màu chủ đạo premium)
- **Color Variant**: VIBRANT
- **Override Primary**: `#818cf8` (Indigo 400)
- **Override Secondary**: `#34d399` (Emerald - highlight xe buýt/học sinh)
- **Override Tertiary**: `#f59e0b` (Amber - cảnh báo/sự cố)
- **Headline Font**: PLUS_JAKARTA_SANS
- **Body Font**: INTER
- **Label Font**: DM_SANS
- **Roundness**: ROUND_EIGHT
- **Design MD**: Chi tiết ngôn ngữ thiết kế

**Design MD Content:**
```markdown
# SSB Admin Dashboard Design Language

## Visual Identity
Premium admin dashboard for school bus management system.
Dark mode first. Glassmorphism cards. Subtle gradients.

## Color Philosophy
- Background: Deep navy #0f1117 → #1a1d2e gradient
- Sidebar: #12151f with subtle border rgba(255,255,255,0.06)
- Cards: rgba(255,255,255,0.05) backdrop-blur glassmorphism
- Primary Accent: Indigo #6366f1 for CTAs, active states
- Success/Buses: Emerald #34d399
- Warning/Incidents: Amber #f59e0b
- Danger/Delete: Rose #f43f5e

## Typography Rules
- Dashboard titles: Plus Jakarta Sans 700, 1.5rem
- Table headers: Inter 600 uppercase tracking-wider
- Body/Labels: Inter 400, 0.875rem

## Component Patterns
- Sidebar: 260px wide, icon + label nav items with hover slide effect
- Stats cards: glassmorphism with colored top border, number in 2xl bold
- Tables: No visible row borders, subtle hover bg, action buttons appear on hover
- Modals: Centered, backdrop blur, slide-in animation
- Buttons: Rounded-lg, primary=indigo gradient, secondary=ghost

## Micro-animations
- Sidebar nav items: translate-x slide on hover (200ms ease)
- Stats cards: scale(1.02) on hover
- Table rows: bg transition 150ms
- Modal: fadeIn + translateY(-10px) → 0
- Page transitions: opacity fade 200ms
```

#### Bước 1.3: Cập nhật Design System
Dùng `update_design_system` để áp dụng.

---

### Phase 2: Stitch Screen Generation (8 màn hình)

Mỗi màn hình được generate với `generate_screen_from_text`, deviceType `DESKTOP`, model `GEMINI_3_1_PRO`.

#### [GENERATE] Screen 1 - Dashboard/Tổng quan
```
Admin dashboard overview screen for a school bus management system.
Dark glassmorphism theme with indigo accent color.
Layout: Left sidebar navigation (260px) + main content area.

Sidebar contains: Logo "SSB 1.0", nav items (Tổng quan, Xe bus, Tài xế, Học sinh, Tuyến đường, Lịch trình, Sự cố, Nhắn tin) with icons.

Main content:
- Top header bar with title "Tổng quan" and user info on right
- 4 stat cards in a row: "Số xe hoạt động" (bus icon, indigo), "Tài xế trực hôm nay" (driver icon, emerald), "Học sinh trên xe" (student icon, amber), "Sự cố" (alert icon, rose)
- Below: Map container (60% width) + Alert/Legend panel (40% width)
```

#### [GENERATE] Screen 2 - Xe Buýt (Bus Management)
```
Bus management screen for school bus admin dashboard.
Dark theme, indigo accent.
Layout: Same left sidebar + main content.

Main content:
- Header: search input + "Thêm xe bus" button (indigo)
- Data table: STT, Biển số, Số ghế, Tình trạng (badge: Hoạt động=green, Tạm dừng=yellow), Thao tác (edit/delete icon buttons appear on row hover)
- Selected bus detail panel below table: shows plate number, driver, status, route, departure time in card format
- Add/Edit modal: form with Biển số, Số ghế, Tình trạng (select), Tài xế (select), Tuyến đường (select), Thời gian khởi hành (time input)
```

#### [GENERATE] Screen 3 - Tài xế (Driver Management)
```
Driver management screen. Same dark theme.
Table: STT, Họ tên tài xế, Biển số xe, Tình trạng, Thao tác
Selected driver detail panel: large avatar, name, phone, status badge, bus plate, route, shift time
Add/Edit modal: name, phone, status, bus assignment
```

#### [GENERATE] Screen 4 - Học sinh (Student Management)  
```
Student management screen. Dark theme.
Table: STT, Họ tên học sinh, Phụ huynh, Số điện thoại, Trạng thái, Thao tác
Selected student detail: name, parent, phone, status, route, pickup/dropoff points, times
Modal form: name, parent (select), status, route (select), pickup point (select, dependent), dropoff point (select, dependent), pickup time, dropoff time
```

#### [GENERATE] Screen 5 - Tuyến đường (Route Management)
```
Route management screen. Dark theme.
Split layout: Left=map with marked points (dark Mapbox style), Right=route info list
Below: Routes table: STT, Tên tuyến, Tình trạng (badge), Thao tác
Add/Edit modal: route name, status, embedded map for placing points
```

#### [GENERATE] Screen 6 - Lịch trình (Schedule)
```
Schedule management screen. Dark theme.
Top: Week selector dropdown + Edit button + Add button with dropdown
Calendar grid: Rows = routes, Columns = Mon-Sun dates
Each cell shows driver name as a chip/badge, clickable to edit
```

#### [GENERATE] Screen 7 - Sự cố (Incident)
```
Incident management screen. Dark theme.
Table: STT, Tiêu đề, Trạng thái (severity badge), Ngày báo cáo, Thao tác
Selected incident detail card: title, route, status, driver, date, edit button
```

#### [GENERATE] Screen 8 - Nhắn tin (Messaging)
```
Chat/messaging screen. Dark theme.
Split layout: Left panel=user list with avatars, Right=chat area
Chat area: header with username, message bubbles (sent=indigo right, received=dark left), input bar with send button
```

---

### Phase 3: Design Extraction & CSS Implementation

Sau khi có Stitch screens, tôi sẽ:

#### [MODIFY] [index.css](file:///c:/Long/hk2_2025-2026/PersonalProject/CNPM/CNPM/frontend/src/index.css)
Xây dựng global CSS variables và reset:
```css
:root {
  --bg-primary: #0f1117;
  --bg-secondary: #1a1d2e;
  --bg-card: rgba(255,255,255,0.05);
  --accent-primary: #6366f1;
  --accent-secondary: #34d399;
  --accent-warning: #f59e0b;
  --accent-danger: #f43f5e;
  --text-primary: #f1f5f9;
  --text-secondary: #94a3b8;
  --border: rgba(255,255,255,0.06);
  --font-headline: 'Plus Jakarta Sans', sans-serif;
  --font-body: 'Inter', sans-serif;
  --radius: 8px;
  --shadow: 0 4px 24px rgba(0,0,0,0.4);
  /* animations */
  --transition-fast: 150ms ease;
  --transition-normal: 250ms ease;
}
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;700;800&family=Inter:wght@400;500;600&family=DM+Sans:wght@400;500&display=swap');
```

#### [MODIFY] Component CSS Files (8 files)
Thay thế toàn bộ CSS với tokens từ design system, theo patterns từ Stitch screens:

| File | Nội dung thay đổi |
|---|---|
| [display.css](file:///c:/Long/hk2_2025-2026/PersonalProject/CNPM/CNPM/frontend/src/components/admin/display.css) | Sidebar dark glass, nav items animation, header glassmorphism |
| [Tongquan.css](file:///c:/Long/hk2_2025-2026/PersonalProject/CNPM/CNPM/frontend/src/components/admin/Tongquan.css) | Stats cards glassmorphism, animated border-top accent |
| [Bus.css](file:///c:/Long/hk2_2025-2026/PersonalProject/CNPM/CNPM/frontend/src/components/admin/Bus.css) | Table styles, badges, modal animations |
| [Driver.css](file:///c:/Long/hk2_2025-2026/PersonalProject/CNPM/CNPM/frontend/src/components/admin/Driver.css) | Same table pattern, avatar styles |
| [Student.css](file:///c:/Long/hk2_2025-2026/PersonalProject/CNPM/CNPM/frontend/src/components/admin/Student.css) | Table, dependent dropdowns styling |
| [Route.css](file:///c:/Long/hk2_2025-2026/PersonalProject/CNPM/CNPM/frontend/src/components/admin/Route.css) | Split layout, map container dark theme |
| [Schedule.css](file:///c:/Long/hk2_2025-2026/PersonalProject/CNPM/CNPM/frontend/src/components/admin/Schedule.css) | Calendar grid, driver chip badges |
| [Incident.css](file:///c:/Long/hk2_2025-2026/PersonalProject/CNPM/CNPM/frontend/src/components/admin/Incident.css) | Severity badges, detail card |
| [Message.css](file:///c:/Long/hk2_2025-2026/PersonalProject/CNPM/CNPM/frontend/src/components/admin/Message.css) | Chat bubbles, user list |

#### [MODIFY] Minor JSX Tweaks
Một số component JSX cần thêm className nhỏ để hỗ trợ CSS mới (không thay đổi logic):
- `display.jsx`: Thêm SVG icons (inline) cho sidebar nav items thay cho emoji
- Status badges: Wrap `status` text trong `<span className="badge badge-active">` / `"badge-inactive"`
- Buttons: Thêm CSS class `btn-primary`, `btn-ghost`, `btn-danger`
- `window.alert()` → Thay bằng một Toast component nhỏ (optional)

---

### Phase 4: Verification

#### [MODIFY] Kiểm tra chức năng
Sau khi apply CSS:
- [ ] CRUD Xe buýt: Thêm/Sửa/Xóa
- [ ] CRUD Tài xế: Thêm/Sửa/Xóa
- [ ] CRUD Học sinh: Thêm/Sửa/Xóa
- [ ] CRUD Tuyến đường + Map points
- [ ] Lịch trình: Xem theo tuần, thêm/sửa trip
- [ ] Sự cố: Xem list
- [ ] Nhắn tin: Xem/gửi tin nhắn
- [ ] Dashboard: Stats cards load từ API

---

## Verification Plan

### Automated Checks
```bash
# Frontend dev server vẫn chạy (không thay đổi build config)
npm run dev  # trong thư mục frontend

# Build kiểm tra không có lỗi
npm run build
```

### Visual Verification
1. So sánh screenshot before/after cho mỗi trong 8 màn hình
2. Kiểm tra transition/animation hoạt động mượt
3. Kiểm tra responsive ở 1280px và 1440px
4. Kiểm tra không bị vỡ layout khi dữ liệu dài

### API Integration Check
Xác nhận tất cả API calls vẫn hoạt động bình thường sau khi refactor CSS (không thay đổi logic file).

---

## Timeline Estimate

| Giai đoạn | Thời gian ước tính |
|---|---|
| Phase 1: Stitch Setup + Design System | ~15 phút |
| Phase 2: Screen Generation (8 screens) | ~40 phút |
| Phase 3: CSS Implementation | ~60 phút |
| Phase 4: Verification & Polish | ~20 phút |
| **Tổng cộng** | **~2.5 giờ** |
