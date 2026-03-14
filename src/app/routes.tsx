import { createBrowserRouter } from 'react-router';
import { lazy, Suspense } from 'react';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { PageLoader } from './components/PageLoader';

const Courses = lazy(() => import('./pages/Courses').then(m => ({ default: m.Courses })));
const CourseDetail = lazy(() => import('./pages/CourseDetail').then(m => ({ default: m.CourseDetail })));
const Auth = lazy(() => import('./pages/Auth').then(m => ({ default: m.Auth })));
const Contact = lazy(() => import('./pages/Contact').then(m => ({ default: m.Contact })));
const NotFound = lazy(() => import('./pages/NotFound').then(m => ({ default: m.NotFound })));

const DashboardLayout = lazy(() => import('./components/DashboardLayout').then(m => ({ default: m.DashboardLayout })));
const Overview = lazy(() => import('./pages/dashboard/Overview').then(m => ({ default: m.Overview })));
const MyCourses = lazy(() => import('./pages/dashboard/MyCourses').then(m => ({ default: m.MyCourses })));
const Settings = lazy(() => import('./pages/Settings').then(m => ({ default: m.Settings })));
const Schedule = lazy(() => import('./pages/Schedule').then(m => ({ default: m.Schedule })));
const Analytics = lazy(() => import('./pages/Analytics').then(m => ({ default: m.Analytics })));
const Community = lazy(() => import('./pages/Community').then(m => ({ default: m.Community })));
const Flashcards = lazy(() => import('./pages/Flashcards').then(m => ({ default: m.Flashcards })));
const Certificates = lazy(() => import('./pages/Certificates').then(m => ({ default: m.Certificates })));
const Gamification = lazy(() => import('./pages/Gamification').then(m => ({ default: m.Gamification })));
const Quests = lazy(() => import('./pages/Quests').then(m => ({ default: m.Quests })));
const Shop = lazy(() => import('./pages/Shop').then(m => ({ default: m.Shop })));

const AdminLogin = lazy(() => import('./pages/admin/AdminLogin').then(m => ({ default: m.AdminLogin })));
const AdminLayout = lazy(() => import('./components/admin/AdminLayout').then(m => ({ default: m.AdminLayout })));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const AdminCourses = lazy(() => import('./pages/admin/AdminCourses').then(m => ({ default: m.AdminCourses })));
const AdminStudents = lazy(() => import('./pages/admin/AdminStudents').then(m => ({ default: m.AdminStudents })));
const AdminOrders = lazy(() => import('./pages/admin/AdminOrders').then(m => ({ default: m.AdminOrders })));
const AdminCoupons = lazy(() => import('./pages/admin/AdminCoupons').then(m => ({ default: m.AdminCoupons })));
const AdminAnalytics = lazy(() => import('./pages/admin/AdminAnalytics').then(m => ({ default: m.AdminAnalytics })));
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings').then(m => ({ default: m.AdminSettings })));

const Checkout = lazy(() => import('./pages/payment/Checkout').then(m => ({ default: m.default })));

function Page({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<PageLoader />}>{children}</Suspense>;
}

export const router = createBrowserRouter([
  // Public routes with main layout
  {
    path: '/',
    Component: Layout,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: 'courses',
        element: (
          <Suspense fallback={<PageLoader />}>
            <Courses />
          </Suspense>
        ),
      },
      {
        path: 'courses/:slug',
        element: (
          <Suspense fallback={<PageLoader />}>
            <CourseDetail />
          </Suspense>
        ),
      },
      {
        path: 'contact',
        element: (
          <Suspense fallback={<PageLoader />}>
            <Contact />
          </Suspense>
        ),
      },
      {
        path: '*',
        element: (
          <Suspense fallback={<PageLoader />}>
            <NotFound />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: 'auth',
    element: (
      <Suspense fallback={<PageLoader />}>
        <Auth />
      </Suspense>
    ),
  },
  {
    path: 'checkout/:courseId',
    element: (
      <Suspense fallback={<PageLoader />}>
        <Checkout />
      </Suspense>
    ),
  },
  // Dashboard routes with sidebar
  {
    element: (
      <Suspense fallback={<PageLoader />}>
        <DashboardLayout />
      </Suspense>
    ),
    children: [
      {
        path: 'dashboard',
        element: (
          <Suspense fallback={<PageLoader />}>
            <Overview />
          </Suspense>
        ),
      },
      {
        path: 'dashboard/my-courses',
        element: (
          <Suspense fallback={<PageLoader />}>
            <MyCourses />
          </Suspense>
        ),
      },
      {
        path: 'quests',
        element: (
          <Suspense fallback={<PageLoader />}>
            <Quests />
          </Suspense>
        ),
      },
      {
        path: 'shop',
        element: (
          <Suspense fallback={<PageLoader />}>
            <Shop />
          </Suspense>
        ),
      },
      {
        path: 'settings',
        element: (
          <Suspense fallback={<PageLoader />}>
            <Settings />
          </Suspense>
        ),
      },
      {
        path: 'schedule',
        element: (
          <Suspense fallback={<PageLoader />}>
            <Schedule />
          </Suspense>
        ),
      },
      {
        path: 'analytics',
        element: (
          <Suspense fallback={<PageLoader />}>
            <Analytics />
          </Suspense>
        ),
      },
      {
        path: 'community',
        element: (
          <Suspense fallback={<PageLoader />}>
            <Community />
          </Suspense>
        ),
      },
      {
        path: 'flashcards',
        element: (
          <Suspense fallback={<PageLoader />}>
            <Flashcards />
          </Suspense>
        ),
      },
      {
        path: 'certificates',
        element: (
          <Suspense fallback={<PageLoader />}>
            <Certificates />
          </Suspense>
        ),
      },
      {
        path: 'gamification',
        element: (
          <Suspense fallback={<PageLoader />}>
            <Gamification />
          </Suspense>
        ),
      },
    ],
  },
  // Admin routes
  {
    path: 'admin',
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<PageLoader />}>
            <AdminLogin />
          </Suspense>
        ),
      },
      {
        element: (
          <Suspense fallback={<PageLoader />}>
            <AdminLayout />
          </Suspense>
        ),
        children: [
          {
            path: 'dashboard',
            element: (
              <Suspense fallback={<PageLoader />}>
                <AdminDashboard />
              </Suspense>
            ),
          },
          {
            path: 'courses',
            element: (
              <Suspense fallback={<PageLoader />}>
                <AdminCourses />
              </Suspense>
            ),
          },
          {
            path: 'students',
            element: (
              <Suspense fallback={<PageLoader />}>
                <AdminStudents />
              </Suspense>
            ),
          },
          {
            path: 'orders',
            element: (
              <Suspense fallback={<PageLoader />}>
                <AdminOrders />
              </Suspense>
            ),
          },
          {
            path: 'coupons',
            element: (
              <Suspense fallback={<PageLoader />}>
                <AdminCoupons />
              </Suspense>
            ),
          },
          {
            path: 'analytics',
            element: (
              <Suspense fallback={<PageLoader />}>
                <AdminAnalytics />
              </Suspense>
            ),
          },
          {
            path: 'settings',
            element: (
              <Suspense fallback={<PageLoader />}>
                <AdminSettings />
              </Suspense>
            ),
          },
        ],
      },
    ],
  },
]);
