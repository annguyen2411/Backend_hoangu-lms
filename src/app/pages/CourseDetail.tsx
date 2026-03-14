import { useParams, Link, useNavigate } from 'react-router';
import { useState } from 'react';
import { Star, Clock, BookOpen, Users, Award, Play, Lock, CheckCircle, ChevronDown, ChevronUp, ShoppingCart } from 'lucide-react';
import { courses, reviews } from '../data/mockData';
import { authUtils } from '../utils/auth';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

export function CourseDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const course = courses.find((c) => c.slug === slug);
  const [activeTab, setActiveTab] = useState<'intro' | 'curriculum' | 'reviews' | 'teacher'>('intro');
  const [expandedLessons, setExpandedLessons] = useState<Set<string>>(new Set(['1-1']));
  const user = authUtils.getCurrentUser();

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Không tìm thấy khóa học</h1>
          <Link to="/courses">
            <Button variant="primary">Quay lại danh sách khóa học</Button>
          </Link>
        </div>
      </div>
    );
  }

  const toggleLesson = (lessonId: string) => {
    const newExpanded = new Set(expandedLessons);
    if (newExpanded.has(lessonId)) {
      newExpanded.delete(lessonId);
    } else {
      newExpanded.add(lessonId);
    }
    setExpandedLessons(newExpanded);
  };

  const handleEnroll = () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    authUtils.enrollCourse(course.id);
    navigate('/dashboard');
  };

  const isEnrolled = user?.enrolledCourses.includes(course.id);

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Hero Section - High Contrast */}
      <div className="bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                {course.hskLevel && (
                  <Badge variant="secondary" className="bg-white text-[var(--primary)] font-bold">
                    HSK {course.hskLevel}
                  </Badge>
                )}
                <Badge variant="secondary" className="bg-gray-900/80 text-white backdrop-blur-sm border border-white/30">
                  {course.level}
                </Badge>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold mb-4">{course.titleVi}</h1>
              <p className="text-xl text-white mb-6">{course.description}</p>

              <div className="flex flex-wrap items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <img
                    src={course.teacher.avatar}
                    alt={course.teacher.nameVi}
                    className="w-10 h-10 rounded-full border-2 border-white"
                  />
                  <div>
                    <div className="font-semibold">{course.teacher.nameVi}</div>
                    <div className="text-white/80 text-xs">{course.teacher.specialization}</div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{course.rating}</span>
                  <span className="text-gray-400">({course.totalReviews} đánh giá)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  <span>{course.totalReviews * 3} học viên</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-xl overflow-hidden sticky top-24">
                <div className="relative">
                  <img
                    src={course.thumbnail}
                    alt={course.titleVi}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <Play className="h-16 w-16 text-white" />
                  </div>
                </div>

                <div className="p-6">
                  <div className="mb-4">
                    {course.salePrice ? (
                      <>
                        <div className="text-3xl font-bold text-red-600">
                          {course.salePrice.toLocaleString()}đ
                        </div>
                        <div className="text-lg text-gray-400 line-through">
                          {course.price.toLocaleString()}đ
                        </div>
                        <div className="text-sm text-green-600 font-semibold mt-1">
                          Tiết kiệm {((course.price - course.salePrice) / 1000).toLocaleString()}k
                        </div>
                      </>
                    ) : (
                      <div className="text-3xl font-bold text-gray-900">
                        {course.price.toLocaleString()}đ
                      </div>
                    )}
                  </div>

                  {isEnrolled ? (
                    <Link
                      to="/dashboard"
                      className="block w-full py-4 bg-green-600 text-white text-center rounded-lg font-bold text-lg hover:bg-green-700 transition-colors mb-3"
                    >
                      Tiếp tục học
                    </Link>
                  ) : (
                    <button
                      onClick={handleEnroll}
                      className="w-full py-4 bg-gradient-to-r from-red-600 to-yellow-500 text-white rounded-lg font-bold text-lg hover:opacity-90 transition-opacity mb-3"
                    >
                      Đăng ký ngay
                    </button>
                  )}

                  <div className="space-y-3 text-sm text-gray-600">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Thời lượng
                      </span>
                      <span className="font-semibold text-gray-900">{course.duration}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4" />
                        Số bài học
                      </span>
                      <span className="font-semibold text-gray-900">{course.totalLessons} bài</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Award className="h-4 w-4" />
                        Chứng chỉ
                      </span>
                      <span className="font-semibold text-gray-900">Có</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          <div className="lg:col-span-2">
            {/* Tab Navigation */}
            <div className="border-b border-gray-200 mb-8">
              <div className="flex gap-8">
                {[
                  { id: 'intro', label: 'Giới thiệu' },
                  { id: 'curriculum', label: 'Chương trình học' },
                  { id: 'reviews', label: 'Đánh giá' },
                  { id: 'teacher', label: 'Giảng viên' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`pb-4 px-1 font-semibold transition-colors ${
                      activeTab === tab.id
                        ? 'text-red-600 border-b-2 border-red-600'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="bg-white rounded-xl shadow-md p-8">
              {activeTab === 'intro' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Mục tiêu khóa học</h2>
                  <div className="space-y-3">
                    {course.goals.map((goal, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{goal}</span>
                      </div>
                    ))}
                  </div>

                  <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">
                    Khóa học này dành cho ai?
                  </h2>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0" />
                      <span>Người mới bắt đầu học tiếng Hoa</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0" />
                      <span>Người muốn thi chứng chỉ HSK</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0" />
                      <span>Người có nhu cầu giao tiếp trong công việc</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0" />
                      <span>Người yêu thích văn hóa Trung Quốc</span>
                    </li>
                  </ul>
                </div>
              )}

              {activeTab === 'curriculum' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Chương trình học</h2>
                  <p className="text-gray-600 mb-6">
                    {course.totalLessons} bài học • {course.duration}
                  </p>

                  <div className="space-y-3">
                    {course.curriculum.length > 0 ? (
                      course.curriculum.map((lesson) => (
                        <div
                          key={lesson.id}
                          className="border border-gray-200 rounded-lg overflow-hidden"
                        >
                          <button
                            onClick={() => toggleLesson(lesson.id)}
                            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              {lesson.isLocked ? (
                                <Lock className="h-5 w-5 text-gray-400" />
                              ) : (
                                <Play className="h-5 w-5 text-red-600" />
                              )}
                              <span className="font-semibold text-gray-900">{lesson.titleVi}</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-sm text-gray-500">{lesson.duration}</span>
                              {expandedLessons.has(lesson.id) ? (
                                <ChevronUp className="h-5 w-5 text-gray-400" />
                              ) : (
                                <ChevronDown className="h-5 w-5 text-gray-400" />
                              )}
                            </div>
                          </button>

                          {expandedLessons.has(lesson.id) && (
                            <div className="px-4 pb-4 bg-gray-50">
                              <p className="text-sm text-gray-600">
                                Loại: {lesson.type === 'video' ? 'Video bài giảng' : 
                                      lesson.type === 'quiz' ? 'Bài kiểm tra' :
                                      lesson.type === 'practice' ? 'Luyện tập' : 'Flashcard'}
                              </p>
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-center py-8">
                        Chương trình học sẽ được cập nhật sớm
                      </p>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Đánh giá từ học viên
                  </h2>

                  <div className="flex items-center gap-8 mb-8 p-6 bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <div className="text-5xl font-bold text-gray-900 mb-2">
                        {course.rating}
                      </div>
                      <div className="flex items-center gap-1 justify-center mb-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-5 w-5 ${
                              star <= course.rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <div className="text-sm text-gray-600">
                        {course.totalReviews} đánh giá
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {reviews.map((review) => (
                      <div key={review.id} className="border-b border-gray-200 pb-6 last:border-0">
                        <div className="flex items-start gap-4">
                          <img
                            src={review.avatar}
                            alt={review.userName}
                            className="w-12 h-12 rounded-full"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="font-semibold text-gray-900">
                                {review.userName}
                              </span>
                              <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    className={`h-4 w-4 ${
                                      star <= review.rating
                                        ? 'fill-yellow-400 text-yellow-400'
                                        : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="text-gray-700 mb-2">{review.comment}</p>
                            <span className="text-sm text-gray-500">{review.date}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'teacher' && (
                <div>
                  <div className="flex items-start gap-6 mb-8">
                    <img
                      src={course.teacher.avatar}
                      alt={course.teacher.nameVi}
                      className="w-32 h-32 rounded-full"
                    />
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        {course.teacher.nameVi}
                      </h2>
                      <p className="text-lg text-gray-600 mb-4">
                        {course.teacher.specialization}
                      </p>
                      {course.teacher.isNative && (
                        <span className="inline-block px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-semibold">
                          Giáo viên bản xứ
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="prose max-w-none">
                    <p className="text-gray-700">{course.teacher.bio}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}