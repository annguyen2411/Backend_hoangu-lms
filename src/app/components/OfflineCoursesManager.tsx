import { useState, useEffect } from 'react';
import { Download, Trash2, HardDrive, Wifi, WifiOff } from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { cacheManager } from '../utils/cacheManager';
import { courses } from '../data/mockData';

export function OfflineCoursesManager() {
  const [offlineCourses, setOfflineCourses] = useState<string[]>([]);
  const [downloadingCourses, setDownloadingCourses] = useState<Set<string>>(new Set());
  const [cacheSize, setCacheSize] = useState(0);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    loadOfflineCourses();
    loadCacheSize();

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const loadOfflineCourses = async () => {
    const courses = await cacheManager.getOfflineCourses();
    setOfflineCourses(courses);
  };

  const loadCacheSize = async () => {
    const size = await cacheManager.getTotalCacheSize();
    setCacheSize(size);
  };

  const handleDownloadCourse = async (courseId: string) => {
    if (!isOnline) {
      toast.error('Cần kết nối internet để tải khóa học');
      return;
    }

    setDownloadingCourses(prev => new Set(prev).add(courseId));
    toast.info('Đang tải khóa học...');

    try {
      // Simulate downloading lessons
      const lessons = [
        `/course/${courseId}/lesson-1`,
        `/course/${courseId}/lesson-2`,
        `/course/${courseId}/lesson-3`,
      ];

      await cacheManager.downloadCourseOffline(courseId, lessons);
      
      await loadOfflineCourses();
      await loadCacheSize();
      
      toast.success('Tải khóa học thành công!');
    } catch (error) {
      toast.error('Lỗi khi tải khóa học');
      console.error(error);
    } finally {
      setDownloadingCourses(prev => {
        const newSet = new Set(prev);
        newSet.delete(courseId);
        return newSet;
      });
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    try {
      await cacheManager.deleteOfflineCourse(courseId);
      await loadOfflineCourses();
      await loadCacheSize();
      toast.success('Đã xóa khóa học offline');
    } catch (error) {
      toast.error('Lỗi khi xóa khóa học');
      console.error(error);
    }
  };

  const handleClearAllCaches = async () => {
    if (!confirm('Bạn có chắc muốn xóa toàn bộ dữ liệu offline?')) return;

    try {
      await cacheManager.clearAllCaches();
      await loadOfflineCourses();
      await loadCacheSize();
      toast.success('Đã xóa toàn bộ cache');
    } catch (error) {
      toast.error('Lỗi khi xóa cache');
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Status Card */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-foreground">Quản lý Offline</h3>
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${
            isOnline
              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
              : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300'
          }`}>
            {isOnline ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
            {isOnline ? 'Online' : 'Offline'}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-accent rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <HardDrive className="h-5 w-5 text-[var(--theme-primary)]" />
              <span className="text-sm font-semibold text-muted-foreground">Dung lượng cache</span>
            </div>
            <p className="text-2xl font-bold text-foreground">
              {cacheManager.formatBytes(cacheSize)}
            </p>
          </div>

          <div className="p-4 bg-accent rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Download className="h-5 w-5 text-[var(--theme-primary)]" />
              <span className="text-sm font-semibold text-muted-foreground">Khóa học offline</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{offlineCourses.length}</p>
          </div>

          <div className="p-4 bg-accent rounded-lg flex items-center">
            <Button
              onClick={handleClearAllCaches}
              variant="outline"
              className="w-full"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Xóa toàn bộ cache
            </Button>
          </div>
        </div>
      </Card>

      {/* Courses List */}
      <Card className="p-6">
        <h3 className="text-xl font-bold text-foreground mb-4">Khóa học</h3>
        <div className="space-y-3">
          {courses.slice(0, 6).map((course) => {
            const isOffline = offlineCourses.includes(course.id);
            const isDownloading = downloadingCourses.has(course.id);

            return (
              <div
                key={course.id}
                className="flex items-center gap-4 p-4 border border-border rounded-lg"
              >
                <img
                  src={course.thumbnail}
                  alt={course.titleVi}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground">{course.titleVi}</h4>
                  <p className="text-sm text-muted-foreground">
                    {course.lessons} bài học • {course.duration}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {isOffline ? (
                    <>
                      <span className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400 font-semibold">
                        <Download className="h-4 w-4" />
                        Đã tải
                      </span>
                      <Button
                        onClick={() => handleDeleteCourse(course.id)}
                        variant="outline"
                        size="sm"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <Button
                      onClick={() => handleDownloadCourse(course.id)}
                      disabled={isDownloading || !isOnline}
                      className="bg-gradient-to-r from-[var(--theme-gradient-from)] to-[var(--theme-gradient-to)] text-white"
                      size="sm"
                    >
                      {isDownloading ? (
                        <>
                          <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Đang tải...
                        </>
                      ) : (
                        <>
                          <Download className="h-4 w-4 mr-2" />
                          Tải về
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Info */}
      <Card className="p-6 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <h4 className="font-bold text-foreground mb-2">💡 Lưu ý</h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• Khóa học offline cho phép bạn học mọi lúc, mọi nơi</li>
          <li>• Tính năng yêu cầu kết nối internet để tải xuống lần đầu</li>
          <li>• Dữ liệu sẽ tự động đồng bộ khi có kết nối</li>
          <li>• Xóa cache để giải phóng dung lượng khi cần</li>
        </ul>
      </Card>
    </div>
  );
}