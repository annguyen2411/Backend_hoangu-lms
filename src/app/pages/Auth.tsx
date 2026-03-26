import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Mail, Lock, User, Facebook, Chrome, Phone } from 'lucide-react';
import { authUtils } from '../utils/auth';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isLogin) {
      if (!formData.email || !formData.password) {
        setError('Vui lòng điền đầy đủ thông tin');
        return;
      }
      authUtils.login(formData.email, formData.password);
      window.dispatchEvent(new Event('auth-change'));
      navigate('/dashboard');
    } else {
      if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
        setError('Vui lòng điền đầy đủ thông tin');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Mật khẩu xác nhận không khớp');
        return;
      }
      authUtils.register(formData.name, formData.email, formData.password);
      window.dispatchEvent(new Event('auth-change'));
      navigate('/dashboard');
    }
  };

  const handleSocialLogin = (provider: string) => {
    authUtils.login(`user@${provider}.com`, 'password');
    window.dispatchEvent(new Event('auth-change'));
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Tabs - Modern Flat Design */}
          <div className="flex border-b border-border">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-4 text-center font-semibold transition-all ${
                isLogin
                  ? 'text-[var(--primary)] bg-[var(--primary-light)] border-b-2 border-[var(--primary)]'
                  : 'text-muted-foreground hover:text-foreground hover:bg-[var(--muted)]'
              }`}
            >
              Đăng nhập
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-4 text-center font-semibold transition-all ${
                !isLogin
                  ? 'text-[var(--primary)] bg-[var(--primary-light)] border-b-2 border-[var(--primary)]'
                  : 'text-muted-foreground hover:text-foreground hover:bg-[var(--muted)]'
              }`}
            >
              Đăng ký
            </button>
          </div>

          <div className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-2">
                {isLogin ? 'Chào mừng trở lại!' : 'Tạo tài khoản mới'}
              </h2>
              <p className="text-muted-foreground">
                {isLogin
                  ? 'Đăng nhập để tiếp tục học tập'
                  : 'Bắt đầu hành trình chinh phục tiếng Hoa'}
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-[var(--error-light)] border border-[var(--error)] rounded-lg text-[var(--error)] text-sm font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {!isLogin && (
                <Input
                  label="Họ và tên"
                  type="text"
                  placeholder="Nhập họ và tên"
                  leftIcon={<User className="h-4 w-4" />}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  fullWidth
                />
              )}

              <Input
                label="Email"
                type="email"
                placeholder="example@email.com"
                leftIcon={<Mail className="h-4 w-4" />}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                fullWidth
              />

              <Input
                label="Mật khẩu"
                type="password"
                placeholder="••••••••"
                leftIcon={<Lock className="h-4 w-4" />}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                fullWidth
                helperText={!isLogin ? "Tối thiểu 8 ký tự" : undefined}
              />

              {!isLogin && (
                <Input
                  label="Xác nhận mật khẩu"
                  type="password"
                  placeholder="••••••••"
                  leftIcon={<Lock className="h-4 w-4" />}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  required
                  fullWidth
                />
              )}

              {isLogin && (
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded border-border" />
                    <span className="text-muted-foreground">Ghi nhớ đăng nhập</span>
                  </label>
                  <a href="#" className="text-[var(--primary)] hover:underline font-medium">
                    Quên mật khẩu?
                  </a>
                </div>
              )}

              <Button type="submit" size="lg" fullWidth>
                {isLogin ? 'Đăng nhập' : 'Đăng ký'}
              </Button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-muted-foreground">Hoặc tiếp tục với</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-3">
                <Button
                  variant="outline"
                  onClick={() => handleSocialLogin('google')}
                  className="flex items-center justify-center"
                >
                  <Chrome className="h-5 w-5" />
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleSocialLogin('facebook')}
                  className="flex items-center justify-center"
                >
                  <Facebook className="h-5 w-5" />
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleSocialLogin('phone')}
                  className="flex items-center justify-center"
                >
                  <Phone className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {!isLogin && (
              <p className="mt-6 text-center text-xs text-muted-foreground">
                Bằng việc đăng ký, bạn đồng ý với{' '}
                <a href="#" className="text-[var(--primary)] hover:underline">
                  Điều khoản dịch vụ
                </a>{' '}
                và{' '}
                <a href="#" className="text-[var(--primary)] hover:underline">
                  Chính sách bảo mật
                </a>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Auth;