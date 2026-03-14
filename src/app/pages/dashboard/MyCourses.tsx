import { Link } from 'react-router';
import { BookOpen, Clock, Play, Award, TrendingUp } from 'lucide-react';
import { authUtils } from '../../utils/auth';
import { courses } from '../../data/mockData';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Progress } from '../../components/ui/Progress';

export function MyCourses() {
  const user = authUtils.getCurrentUser();
  if (!user) return null;

  const enrolledCourses = courses.filter(c => user.enrolledCourses.includes(c.id));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Khóa học của tôi</h1>
        <p className="text-muted-foreground mt-1">
          Bạn đang học {enrolledCourses.length} khóa học
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <BookOpen className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">{enrolledCourses.length}</div>
              <div className="text-sm text-muted-foreground">Khóa học</div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">
                {Math.round(Object.values(user.progress).reduce((a, b) => a + b, 0) / user.enrolledCourses.length || 0)}%
              </div>
              <div className="text-sm text-muted-foreground">Tiến độ TB</div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Clock className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">24h</div>
              <div className="text-sm text-muted-foreground">Học tuần này</div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Award className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">5</div>
              <div className="text-sm text-muted-foreground">Chứng chỉ</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Courses Grid */}
      <div>
        <h2 className="text-xl font-bold text-foreground mb-4">Đang học</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrolledCourses.map((course) => {
            const progress = user.progress[course.id] || 0;
            
            return (
              <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <img
                    src={course.thumbnail}
                    alt={course.titleVi}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-3 right-3">
                    <div className="bg-white px-3 py-1 rounded-full text-sm font-semibold">
                      {progress}%
                    </div>
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="font-bold text-foreground text-lg mb-2 line-clamp-2">
                    {course.titleVi}
                  </h3>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                    <img
                      src={course.teacher.avatar}
                      alt={course.teacher.nameVi}
                      className="w-6 h-6 rounded-full"
                    />
                    <span>{course.teacher.nameVi}</span>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Tiến độ</span>
                      <span className="font-semibold text-foreground">{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>

                  <div className="flex items-center gap-2">
                    <Link to={`/courses/${course.slug}`} className="flex-1">
                      <Button className="w-full bg-gradient-to-r from-[var(--theme-gradient-from)] to-[var(--theme-gradient-to)] text-white">
                        <Play className="h-4 w-4 mr-2" />
                        Tiếp tục học
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {enrolledCourses.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-bold text-foreground mb-2">
              Chưa có khóa học nào
            </h3>
            <p className="text-muted-foreground mb-6">
              Khám phá và đăng ký khóa học để bắt đầu học tập
            </p>
            <Link to="/courses">
              <Button className="bg-gradient-to-r from-[var(--theme-gradient-from)] to-[var(--theme-gradient-to)] text-white">
                Khám phá khóa học
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
