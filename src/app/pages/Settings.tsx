import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Settings as SettingsIcon, User, Bell, Lock, Globe, Moon, Zap, Download } from 'lucide-react';
import { authUtils } from '../utils/auth';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';
import { Separator } from '../components/ui/separator';
import { OfflineCoursesManager } from '../components/OfflineCoursesManager';

export function Settings() {
  const navigate = useNavigate();
  const user = authUtils.getCurrentUser();
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'offline'>('profile');
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    lessons: true,
    achievements: true,
    promotions: false,
  });

  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-gradient-to-br from-[var(--theme-gradient-from)] to-[var(--theme-gradient-to)] p-3 rounded-xl">
              <SettingsIcon className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-foreground">Cài đặt</h1>
              <p className="text-muted-foreground mt-1">
                Tùy chỉnh trải nghiệm học tập của bạn
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Tabs */}
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className={`${
                activeTab === 'profile' ? 'bg-accent text-white' : ''
              }`}
              onClick={() => setActiveTab('profile')}
            >
              Hồ sơ
            </Button>
            <Button
              variant="outline"
              className={`${
                activeTab === 'notifications' ? 'bg-accent text-white' : ''
              }`}
              onClick={() => setActiveTab('notifications')}
            >
              Thông báo
            </Button>
            <Button
              variant="outline"
              className={`${
                activeTab === 'offline' ? 'bg-accent text-white' : ''
              }`}
              onClick={() => setActiveTab('offline')}
            >
              Khóa học ngoại tuyến
            </Button>
          </div>

          {/* Profile Settings */}
          {activeTab === 'profile' && (
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <User className="h-5 w-5 text-[var(--theme-primary)]" />
                <h2 className="text-xl font-bold text-foreground">Tài khoản</h2>
              </div>

              <div className="space-y-3">
                <button className="w-full flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors text-left">
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="font-semibold text-foreground">Thông tin cá nhân</div>
                      <div className="text-sm text-muted-foreground">Cập nhật tên, ảnh đại diện</div>
                    </div>
                  </div>
                  <Zap className="h-5 w-5 text-muted-foreground" />
                </button>

                <button className="w-full flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors text-left">
                  <div className="flex items-center gap-3">
                    <Lock className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="font-semibold text-foreground">Bảo mật</div>
                      <div className="text-sm text-muted-foreground">Đổi mật khẩu, xác thực 2 yếu tố</div>
                    </div>
                  </div>
                  <Zap className="h-5 w-5 text-muted-foreground" />
                </button>

                <button className="w-full flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors text-left">
                  <div className="flex items-center gap-3">
                    <Globe className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="font-semibold text-foreground">Ngôn ngữ</div>
                      <div className="text-sm text-muted-foreground">Tiếng Việt</div>
                    </div>
                  </div>
                  <Zap className="h-5 w-5 text-muted-foreground" />
                </button>
              </div>
            </Card>
          )}

          {/* Notification Settings */}
          {activeTab === 'notifications' && (
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <Bell className="h-5 w-5 text-[var(--theme-primary)]" />
                <h2 className="text-xl font-bold text-foreground">Thông báo</h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors">
                  <div>
                    <Label className="text-base font-semibold text-foreground">Email</Label>
                    <p className="text-sm text-muted-foreground">Nhận thông báo qua email</p>
                  </div>
                  <Switch
                    checked={notifications.email}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, email: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors">
                  <div>
                    <Label className="text-base font-semibold text-foreground">Push Notification</Label>
                    <p className="text-sm text-muted-foreground">Nhận thông báo trên trình duyệt</p>
                  </div>
                  <Switch
                    checked={notifications.push}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, push: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors">
                  <div>
                    <Label className="text-base font-semibold text-foreground">SMS</Label>
                    <p className="text-sm text-muted-foreground">Nhận thông báo qua tin nhắn</p>
                  </div>
                  <Switch
                    checked={notifications.sms}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, sms: checked })
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors">
                  <div>
                    <Label className="text-base font-semibold text-foreground">Nhắc nhở học tập</Label>
                    <p className="text-sm text-muted-foreground">Nhận nhắc học theo lịch</p>
                  </div>
                  <Switch
                    checked={notifications.lessons}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, lessons: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors">
                  <div>
                    <Label className="text-base font-semibold text-foreground">Thành tích</Label>
                    <p className="text-sm text-muted-foreground">Thông báo về huy hiệu và giải thưởng</p>
                  </div>
                  <Switch
                    checked={notifications.achievements}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, achievements: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors">
                  <div>
                    <Label className="text-base font-semibold text-foreground">Khuyến mãi</Label>
                    <p className="text-sm text-muted-foreground">Thông báo về ưu đãi đặc biệt</p>
                  </div>
                  <Switch
                    checked={notifications.promotions}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, promotions: checked })
                    }
                  />
                </div>
              </div>
            </Card>
          )}

          {/* Offline Courses Settings */}
          {activeTab === 'offline' && (
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <Download className="h-5 w-5 text-[var(--theme-primary)]" />
                <h2 className="text-xl font-bold text-foreground">Khóa học ngoại tuyến</h2>
              </div>

              <OfflineCoursesManager />
            </Card>
          )}

          {/* Save Button */}
          <div className="flex justify-end gap-3">
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-3 border border-border rounded-lg font-semibold text-foreground hover:bg-accent transition-colors"
            >
              Hủy
            </button>
            <button className="px-6 py-3 bg-gradient-to-r from-[var(--theme-gradient-from)] to-[var(--theme-gradient-to)] text-white rounded-lg font-semibold hover:opacity-90 transition-opacity">
              Lưu thay đổi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}