# HoaNgữ LMS - Cấu trúc dự án

## Tổng quan

Dự án HoaNgữ LMS là hệ thống quản lý học tập tiếng Hoa với các tính năng:
- Quản lý khóa học và bài học
- Hệ thống gamification (quests, achievements, leaderboard)
- Flashcard với Spaced Repetition
- Thanh toán và đăng ký khóa học
- Trang quản trị (Admin Dashboard)

---

## Cấu trúc thư mục

```
hoangu.techhave.com/
├── src/
│   ├── app/                    # Frontend React application
│   │   ├── components/         # Reusable UI components
│   │   ├── contexts/           # React Context providers
│   │   ├── hooks/             # Custom React hooks
│   │   ├── pages/             # Page components
│   │   ├── utils/             # Utility functions
│   │   ├── types/             # TypeScript type definitions
│   │   ├── constants/         # App constants
│   │   ├── data/              # Static data
│   │   └── routes.tsx         # App routing configuration
│   │
│   ├── lib/                   # Library configurations
│   │   ├── api.ts            # API client with endpoints
│   │   └── database.types.ts # Database type definitions
│   │
│   ├── server/               # Backend Node.js/Express API
│   │   ├── routes/           # API route handlers
│   │   ├── db/              # Database connection & schema
│   │   ├── middleware/      # Express middleware
│   │   ├── config/          # Server configuration
│   │   ├── types/            # Backend type definitions
│   │   ├── utils/           # Server utilities
│   │   └── index.ts         # Server entry point
│   │
│   └── styles/              # Global styles
│
├── public/                   # Static assets
│   ├── manifest.json        # PWA manifest
│   ├── sw.js                # Service worker
│   └── offline.html         # Offline page
│
├── docs/                     # Project documentation
├── guidelines/              # AI development guidelines
├── package.json            # Frontend dependencies
├── vite.config.ts          # Vite build configuration
├── docker-compose.yml      # Docker services
└── PROJECT_STRUCTURE.md    # This file
```

---

## Chi tiết các file và thư mục

### 📁 src/app/

Thư mục chính của ứng dụng React frontend.

#### 📁 src/app/components/

Các component UI có thể tái sử dụng.

| File/Directory | Mô tả |
|----------------|--------|
| `ui/` | Thư viện component cơ bản (Button, Input, Card, v.v.) |
| `Header.tsx` | Thanh điều hướng chính |
| `Footer.tsx` | Chân trang |
| `Layout.tsx` | Layout chính |
| `DashboardLayout.tsx` | Layout cho trang dashboard (có sidebar) |
| `EmptyState.tsx` | Component hiển thị khi không có dữ liệu |
| `ErrorBoundary.tsx` | Xử lý lỗi React |
| `PageLoader.tsx` | Loading spinner |
| `ProtectedRoute.tsx` | Bảo vệ route yêu cầu đăng nhập |
| `AuthModal.tsx` | Modal đăng nhập/đăng ký |
| `LoginPrompt.tsx` | Yêu cầu đăng nhập |
| `Breadcrumbs.tsx` | Điều hướng breadcrumbs |
| `CourseCarousel.tsx` | Carousel khóa học |
| `FlashcardReview.tsx` | Review flashcard |
| `SmartSearchBar.tsx` | Thanh tìm kiếm thông minh |
| `AdvancedSearch.tsx` | Tìm kiếm nâng cao |
| `AdvancedFilters.tsx` | Bộ lọc nâng cao |
| `FilterChips.tsx` | Chips cho bộ lọc |
| `CommandPalette.tsx` | Command palette (Ctrl+K) |
| `NotificationCenter.tsx` | Trung tâm thông báo |
| `RecommendationsPanel.tsx` | Panel gợi ý |
| `StudyCalendar.tsx` | Lịch học tập |
| `StudyGroupCard.tsx` | Card nhóm học tập |
| `ProgressLineChart.tsx` | Biểu đồ tiến độ |
| `StudyTimeChart.tsx` | Biểu đồ thời gian học |
| `SkillRadarChart.tsx` | Biểu đồ kỹ năng |
| `OfflineIndicator.tsx` | Indicator khi offline |
| `SyncStatusIndicator.tsx` | Indicator đồng bộ |
| `PWAInstallPrompt.tsx` | Prompt cài đặt PWA |
| `OnboardingTour.tsx` | Hướng dẫn sử dụng cho người mới |
| `GoalSettingModal.tsx` | Modal thiết lập mục tiêu |
| `ActivityFeed.tsx` | Feed hoạt động |
| `SocialFeed.tsx` | Feed mạng xã hội |
| `StudyReminderSettings.tsx` | Cài đặt nhắc nhở học tập |
| `admin/` | Components cho admin |
| `quests/` | Components liên quan đến quest/achievement |
| `shop/` | Components cho cửa hàng |

#### 📁 src/app/components/ui/

Thư viện component cơ bản (shadcn/ui style).

| File | Mô tả |
|------|--------|
| `Button.tsx` | Nút bấm |
| `Input.tsx` | Input field |
| `Card.tsx` | Card container |
| `Badge.tsx` | Badge/Tag |
| `Label.tsx` | Label |
| `Progress.tsx` | Thanh tiến độ |
| `Checkbox.tsx` | Checkbox |
| `dialog.tsx` | Modal dialog |
| `dropdown-menu.tsx` | Dropdown menu |
| `form.tsx` | Form components |
| `calendar.tsx` | Calendar |
| `chart.tsx` | Charts |
| `carousel.tsx` | Carousel |
| `pagination.tsx` | Phân trang |
| `alert.tsx` | Alert/Toast |
| `avatar.tsx` | Avatar |
| ... | Các component khác |

#### 📁 src/app/contexts/

React Context providers.

| File | Mô tả |
|------|--------|
| `AuthContext.tsx` | Quản lý authentication & user state |
| `ThemeContext.tsx` | Quản lý theme (light/dark) |

#### 📁 src/app/hooks/

Custom React hooks.

| File | Mô tả |
|------|--------|
| `useData.ts` | Hook data fetching chung |
| `useAdmin.ts` | Hook kiểm tra quyền admin |
| `useOnlineStatus.ts` | Hook kiểm tra trạng thái online/offline |
| `usePWA.ts` | Hook PWA functionality |
| `useKeyboardShortcuts.ts` | Hook keyboard shortcuts |
| `useGameProgress.ts` | Hook tiến trình game |
| `useDailyReset.ts` | Hook reset daily |

#### 📁 src/app/pages/

Các trang chính của ứng dụng.

| File | Mô tả | Đường dẫn |
|------|-------|------------|
| `Home.tsx` | Trang chủ | `/` |
| `Auth.tsx` | Đăng nhập/Đăng ký | `/auth`, `/login`, `/register` |
| `ForgotPassword.tsx` | Quên mật khẩu | `/forgot-password` |
| `ResetPassword.tsx` | Đặt lại mật khẩu | `/reset-password` |
| `Courses.tsx` | Danh sách khóa học | `/courses` |
| `CourseDetail.tsx` | Chi tiết khóa học | `/courses/:slug` |
| `Learn.tsx` | Học bài | `/learn/:lessonId` |
| `Dashboard.tsx` | Dashboard | `/dashboard` |
| `Settings.tsx` | Cài đặt | `/settings` |
| `Leaderboard.tsx` | Bảng xếp hạng | `/leaderboard` |
| `Achievements.tsx` | Thành tựu | `/achievements` |
| `Quests.tsx` | Nhiệm vụ | `/quests` |
| `Flashcards.tsx` | Flashcard | `/flashcards` |
| `Practice.tsx` | Luyện tập | `/practice` |
| `VoicePractice.tsx` | Luyện nói | `/voice-practice` |
| `LearningHistory.tsx` | Lịch sử học tập | `/history` |
| `Goals.tsx` | Mục tiêu | `/goals` |
| `Schedule.tsx` | Lịch học | `/schedule` |
| `Community.tsx` | Cộng đồng | `/community` |
| `Friends.tsx` | Bạn bè | `/friends` |
| `StudyGroups.tsx` | Nhóm học tập | `/study-groups` |
| `Shop.tsx` | Cửa hàng | `/shop` |
| `Gamification.tsx` | Gamification | `/gamification` |
| `Analytics.tsx` | Phân tích | `/analytics` |
| `Certificates.tsx` | Chứng chỉ | `/certificates` |
| `InstructorDashboard.tsx` | Dashboard giảng viên | `/instructor` |
| `Contact.tsx` | Liên hệ | `/contact` |
| `NotFound.tsx` | 404 Page | `/*` |
| `admin/` | Trang admin |
| `dashboard/` | Trang con dashboard |
| `payment/` | Trang thanh toán |

#### 📁 src/app/pages/admin/

Trang quản trị.

| File | Mô tả |
|------|--------|
| `AdminDashboard.tsx` | Dashboard admin |
| `AdminCourses.tsx` | Quản lý khóa học |
| `AdminStudents.tsx` | Quản lý học viên |
| `AdminOrders.tsx` | Quản lý đơn hàng |
| `AdminAnalytics.tsx` | Phân tích admin |
| `AdminBanners.tsx` | Quản lý banner |
| `AdminNotifications.tsx` | Quản lý thông báo |
| `AdminCoupons.tsx` | Quản lý coupon |
| `AdminCertificates.tsx` | Quản lý chứng chỉ |
| `AdminCourseApproval.tsx` | Phê duyệt khóa học |
| `AdminInstructors.tsx` | Quản lý giảng viên |
| `AdminSettings.tsx` | Cài đặt admin |
| `AdminLogin.tsx` | Đăng nhập admin |

#### 📁 src/app/utils/

Hàm tiện ích.

| File | Mô tả |
|------|--------|
| `auth.ts` | Authentication utilities |
| `adminAuth.ts` | Admin authentication utilities |
| `api.ts` | (Duplicate - now in src/lib/) |
| `notificationSystem.ts` | Hệ thống thông báo |
| `notificationManager.ts` | Manager thông báo |
| `offlineStorage.ts` | Offline storage với quota management |
| `cacheManager.ts` | PWA cache management |
| `spacedRepetition.ts` | Thuật toán Spaced Repetition |
| `celebration.ts` | Animation ăn mừng (confetti) |
| `paymentService.ts` | Xử lý thanh toán |
| `dataExport.ts` | Export dữ liệu |
| `certificateGenerator.ts` | Tạo chứng chỉ |
| `progressTracker.ts` | Theo dõi tiến độ |
| `recommendationEngine.ts` | Engine gợi ý |
| `searchEngine.ts` | Search engine |
| `smartSearch.ts` | Tìm kiếm thông minh |
| `smartScheduler.ts` | Lập lịch thông minh |
| `socialSystem.ts` | Hệ thống mạng xã hội |
| `syncQueue.ts` | Queue đồng bộ |
| `performanceMonitor.ts` | Monitor hiệu suất |

#### 📁 src/app/types/

TypeScript type definitions.

| File | Mô tả |
|------|--------|
| `database.ts` | Database types |

#### 📁 src/app/constants/

Hằng số ứng dụng.

#### 📁 src/app/data/

Dữ liệu tĩnh.

---

### 📁 src/lib/

Thư viện và cấu hình.

| File | Mô tả |
|------|--------|
| `api.ts` | **API Client chính** - Tất cả API endpoints |
| `database.types.ts` | TypeScript types cho database |

---

### 📁 src/server/

Backend Node.js/Express API.

#### 📁 src/server/routes/

API route handlers.

| File | Mô tả |
|------|--------|
| `auth.ts` | Authentication (register, login, password, forgot-password, reset-password) |
| `courses.ts` | Quản lý khóa học |
| `lessons.ts` | Quản lý bài học |
| `enrollments.ts` | Quản lý đăng ký |
| `progress.ts` | Theo dõi tiến độ |
| `payments.ts` | Thanh toán |
| `settings.ts` | Cài đặt |
| `admin.ts` | Admin CRUD operations |
| `gamification.ts` | Quests, achievements |
| `leaderboard.ts` | Bảng xếp hạng |
| `achievements.ts` | Thành tựu |
| `community.ts` | Bài viết cộng đồng |
| `friends.ts` | Bạn bè |
| `studyGroups.ts` | Nhóm học tập |
| `notifications.ts` | Thông báo |
| `coupons.ts` | Coupon |
| `shop.ts` | Cửa hàng |
| `instructors.ts` | Giảng viên |
| `student.ts` | API học viên |

#### 📁 src/server/db/

Database.

| File | Mô tả |
|------|--------|
| `pool.ts` | PostgreSQL connection pool |
| `schema.sql` | Database schema |
| `seed.ts` | Seed data |

#### 📁 src/server/middleware/

Express middleware (auth, validation, etc.)

#### 📁 src/server/config/

Server configuration.

#### 📁 src/server/types/

Backend TypeScript types.

---

### 📁 public/

Static assets.

| File | Mô tả |
|------|--------|
| `manifest.json` | PWA manifest |
| `sw.js` | Service Worker cho PWA |
| `offline.html` | Trang hiển thị khi offline |

---

## Quy ước đặt tên

### Files
- `PascalCase.tsx` - React components
- `camelCase.ts` - Utility functions, hooks
- `kebab-case.css` - Styles

### Directories
- `camelCase/` - Thư mục chức năng
- `PascalCase/` - Thư mục components

---

## Dependencies chính

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Router v7
- Lucide React (icons)
- Sonner (toast)
- Recharts (charts)
- Canvas Confetti (celebrations)

### Backend
- Express.js
- PostgreSQL (pg)
- JWT (jsonwebtoken)
- Bcrypt (password hashing)
- Express Validator

---

## Scripts

```bash
# Frontend
npm run dev        # Development server
npm run build      # Production build
npm run preview    # Preview production build

# Backend
cd src/server
npm run dev        # Development server (ts-node-dev)
npm start          # Production server

# Docker
docker-compose up  # Start all services
```

---

## Cập nhật lần cuối

Ngày: 28/03/2026
