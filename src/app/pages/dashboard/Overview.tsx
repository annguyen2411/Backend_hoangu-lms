import { useState } from 'react';
import { Link } from 'react-router';
import { BookOpen, TrendingUp, Award, Calendar, Clock, Play, Target, Flame, Zap, Download, X } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { authUtils } from '../../utils/auth';
import { courses } from '../../data/mockData';
import { RecommendationsPanel } from '../../components/RecommendationsPanel';
import { AdvancedSearch } from '../../components/AdvancedSearch';
import { dataExport } from '../../utils/dataExport';
import { searchEngine, SearchFilters } from '../../utils/searchEngine';
import { toast } from 'sonner';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';

export function Overview() {
  const user = authUtils.getCurrentUser();
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const handleExportData = () => {
    dataExport.downloadReport();
    toast.success('Đã xuất báo cáo học tập!');
  };

  const handleSearch = (query: string, filters: SearchFilters) => {
    // Search trong courses
    const results = searchEngine.search(
      courses,
      query,
      ['titleVi', 'titleZh', 'description', 'instructor'],
      filters
    );
    
    setSearchResults(results);
    setSearchQuery(query);
    
    const totalResults = results.length;
    if (totalResults > 0) {
      toast.success(`Tìm thấy ${totalResults} kết quả`);
    } else {
      toast.info('Không tìm thấy kết quả nào');
    }
  };

  if (!user) return null;

  const enrolledCourses = courses.filter(c => user.enrolledCourses.includes(c.id));
  const totalProgress = Object.values(user.progress).reduce((a, b) => a + b, 0) / user.enrolledCourses.length || 0;

  // Mock data for chart
  const weeklyData = [
    { id: 'mon', day: 'T2', hours: 1.5 },
    { id: 'tue', day: 'T3', hours: 2.0 },
    { id: 'wed', day: 'T4', hours: 1.0 },
    { id: 'thu', day: 'T5', hours: 2.5 },
    { id: 'fri', day: 'T6', hours: 1.5 },
    { id: 'sat', day: 'T7', hours: 3.0 },
    { id: 'sun', day: 'CN', hours: 2.0 },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-[var(--theme-gradient-from)] to-[var(--theme-gradient-to)] rounded-2xl p-6 sm:p-8 text-white">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Xin chào, {user.name}! 👋</h1>
            <p className="text-white/90">Hôm nay là ngày tuyệt vời để học tiếng Hoa</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={() => setShowSearch(true)}
              variant="outline"
              className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
            >
              <Zap className="h-4 w-4 mr-2" />
              Tìm kiếm nâng cao
            </Button>
            <Button
              onClick={handleExportData}
              variant="outline"
              className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
            >
              <Download className="h-4 w-4 mr-2" />
              Xuất báo cáo
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Khóa học</p>
                <p className="text-3xl font-bold text-foreground">{enrolledCourses.length}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-xl">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Tiến độ</p>
                <p className="text-3xl font-bold text-foreground">{Math.round(totalProgress)}%</p>
              </div>
              <div className="bg-green-100 p-3 rounded-xl">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Streak</p>
                <p className="text-3xl font-bold text-foreground">7 ngày</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-xl">
                <Flame className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Giờ học</p>
                <p className="text-3xl font-bold text-foreground">24h</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-xl">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Learning Activity Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-[var(--theme-primary)]" />
              Hoạt động học tập tuần này
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={weeklyData}>
                <defs>
                  <linearGradient id="overview-color-gradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="day" stroke="var(--muted-foreground)" />
                <YAxis stroke="var(--muted-foreground)" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--card)', 
                    border: '1px solid var(--border)',
                    borderRadius: '8px'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="hours"
                  stroke="url(#overview-color-gradient)"
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-[var(--theme-primary)]" />
              Hành động nhanh
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Link to="/dashboard/my-courses">
                <button className="w-full flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-accent transition-colors text-left">
                  <BookOpen className="h-5 w-5 text-[var(--theme-primary)]" />
                  <div>
                    <div className="font-semibold text-foreground">Khóa học</div>
                    <div className="text-sm text-muted-foreground">{enrolledCourses.length} đang học</div>
                  </div>
                </button>
              </Link>

              <Link to="/schedule">
                <button className="w-full flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-accent transition-colors text-left">
                  <Calendar className="h-5 w-5 text-[var(--theme-primary)]" />
                  <div>
                    <div className="font-semibold text-foreground">Lịch học</div>
                    <div className="text-sm text-muted-foreground">Xem lịch trình</div>
                  </div>
                </button>
              </Link>

              <Link to="/quests">
                <button className="w-full flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-accent transition-colors text-left">
                  <Zap className="h-5 w-5 text-[var(--theme-primary)]" />
                  <div>
                    <div className="font-semibold text-foreground">Nhiệm vụ</div>
                    <div className="text-sm text-muted-foreground">3 nhiệm vụ mới</div>
                  </div>
                </button>
              </Link>

              <Link to="/certificates">
                <button className="w-full flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-accent transition-colors text-left">
                  <Award className="h-5 w-5 text-[var(--theme-primary)]" />
                  <div>
                    <div className="font-semibold text-foreground">Chứng chỉ</div>
                    <div className="text-sm text-muted-foreground">5 chứng chỉ</div>
                  </div>
                </button>
              </Link>

              <button 
                onClick={() => setShowRecommendations(true)}
                className="w-full flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-accent transition-colors text-left"
              >
                <Zap className="h-5 w-5 text-[var(--theme-primary)]" />
                <div>
                  <div className="font-semibold text-foreground">Gợi ý AI</div>
                  <div className="text-sm text-muted-foreground">Khóa học phù hợp</div>
                </div>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Continue Learning */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="h-5 w-5 text-[var(--theme-primary)]" />
            Tiếp tục học tập
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {enrolledCourses.slice(0, 3).map((course) => {
              const progress = user.progress[course.id] || 0;
              
              return (
                <Link key={course.id} to={`/courses/${course.slug}`}>
                  <div className="group relative overflow-hidden rounded-xl border border-border hover:shadow-lg transition-all">
                    <img
                      src={course.thumbnail}
                      alt={course.titleVi}
                      className="w-full h-40 object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h4 className="font-bold text-white mb-2 line-clamp-1">
                        {course.titleVi}
                      </h4>
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="bg-white/20 text-white">
                          {progress}% hoàn thành
                        </Badge>
                        <Play className="h-5 w-5 text-white" />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      {showRecommendations && (
        <RecommendationsPanel onClose={() => setShowRecommendations(false)} />
      )}

      {showSearch && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-4xl mt-20">
            <div className="bg-card rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-foreground">Tìm kiếm nâng cao</h2>
                <button
                  onClick={() => setShowSearch(false)}
                  className="p-2 hover:bg-accent rounded-lg transition-colors"
                >
                  <X className="h-6 w-6 text-muted-foreground" />
                </button>
              </div>
              <AdvancedSearch
                onSearch={handleSearch}
                filterOptions={{
                  categories: ['HSK 1', 'HSK 2', 'HSK 3', 'Giao tiếp', 'Du lịch', 'Thương mại'],
                  levels: ['Cơ bản', 'Trung cấp', 'Nâng cao'],
                  tags: ['HSK 1', 'HSK 2', 'HSK 3', 'Giao tiếp', 'Du lịch', 'Thương mại', 'Phát âm', 'Kinh doanh', 'Cơ bản', 'Trung cấp', 'Nâng cao']
                }}
              />

              {/* Search Results */}
              {searchResults.length > 0 && (
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-foreground">
                      Kết quả tìm kiếm {searchQuery && `cho "${searchQuery}"`}
                    </h3>
                    <Badge>{searchResults.length} kết quả</Badge>
                  </div>
                  
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {searchResults.map((result, idx) => {
                      const course = result.item;
                      return (
                        <Link 
                          key={idx} 
                          to={`/courses/${course.slug}`}
                          onClick={() => setShowSearch(false)}
                        >
                          <Card className="hover:shadow-lg transition-all cursor-pointer">
                            <CardContent className="p-4">
                              <div className="flex gap-4">
                                <img
                                  src={course.thumbnail}
                                  alt={course.titleVi}
                                  className="w-24 h-24 object-cover rounded-lg"
                                />
                                <div className="flex-1">
                                  <h4 className="font-bold text-foreground mb-1">
                                    {course.titleVi}
                                  </h4>
                                  <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                                    {course.description}
                                  </p>
                                  <div className="flex items-center gap-3 flex-wrap">
                                    <Badge variant="secondary">{course.level}</Badge>
                                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                                      <Clock className="h-3 w-3" />
                                      {course.duration}
                                    </span>
                                    {course.rating && (
                                      <span className="text-sm text-muted-foreground">
                                        ⭐ {course.rating}
                                      </span>
                                    )}
                                    {result.score > 0 && (
                                      <Badge className="bg-green-100 text-green-700">
                                        {Math.round(result.score * 10)}% match
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}