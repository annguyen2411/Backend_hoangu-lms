import { useState } from 'react';
import { Plus, Search, Edit, Trash2, Eye, X, Upload, Trash } from 'lucide-react';
import { courses, teachers, Teacher, Lesson } from '../../data/mockData';

interface CourseFormData {
  titleVi: string;
  title: string;
  description: string;
  thumbnail: string;
  videoUrl: string;
  teacherId: string;
  level: string;
  hskLevel: string;
  duration: string;
  totalLessons: number;
  price: string;
  salePrice: string;
  tags: string;
  goals: string;
  curriculum: Lesson[];
}

export function AdminCourses() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [currentTab, setCurrentTab] = useState<'basic' | 'details' | 'curriculum'>('basic');
  const [formData, setFormData] = useState<CourseFormData>({
    titleVi: '',
    title: '',
    description: '',
    thumbnail: '',
    videoUrl: '',
    teacherId: '',
    level: 'Cơ bản',
    hskLevel: '',
    duration: '',
    totalLessons: 0,
    price: '',
    salePrice: '',
    tags: '',
    goals: '',
    curriculum: []
  });
  const [newLesson, setNewLesson] = useState({
    titleVi: '',
    title: '',
    duration: '',
    type: 'video' as 'video' | 'quiz' | 'practice' | 'flashcard'
  });

  const filteredCourses = courses.filter((course) =>
    course.titleVi.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openCreateModal = () => {
    setModalMode('create');
    setCurrentTab('basic');
    setFormData({
      titleVi: '',
      title: '',
      description: '',
      thumbnail: '',
      videoUrl: '',
      teacherId: '',
      level: 'Cơ bản',
      hskLevel: '',
      duration: '',
      totalLessons: 0,
      price: '',
      salePrice: '',
      tags: '',
      goals: '',
      curriculum: []
    });
    setShowModal(true);
  };

  const handleInputChange = (field: keyof CourseFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addLesson = () => {
    if (!newLesson.titleVi || !newLesson.duration) {
      alert('Vui lòng nhập tên bài học và thời lượng');
      return;
    }

    const lesson: Lesson = {
      id: `lesson-${Date.now()}`,
      title: newLesson.title || newLesson.titleVi,
      titleVi: newLesson.titleVi,
      duration: newLesson.duration,
      isLocked: false,
      type: newLesson.type
    };

    setFormData(prev => ({
      ...prev,
      curriculum: [...prev.curriculum, lesson],
      totalLessons: prev.curriculum.length + 1
    }));

    setNewLesson({
      titleVi: '',
      title: '',
      duration: '',
      type: 'video'
    });
  };

  const removeLesson = (lessonId: string) => {
    setFormData(prev => ({
      ...prev,
      curriculum: prev.curriculum.filter(l => l.id !== lessonId),
      totalLessons: prev.curriculum.length - 1
    }));
  };

  const handleSubmit = () => {
    // Validation
    if (!formData.titleVi || !formData.description || !formData.teacherId || !formData.price) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    // Create new course object
    const selectedTeacher = teachers.find(t => t.id === formData.teacherId);
    if (!selectedTeacher) {
      alert('Vui lòng chọn giảng viên');
      return;
    }

    const newCourse = {
      id: `course-${Date.now()}`,
      slug: formData.titleVi.toLowerCase().replace(/\s+/g, '-'),
      title: formData.title || formData.titleVi,
      titleVi: formData.titleVi,
      description: formData.description,
      thumbnail: formData.thumbnail || 'https://images.unsplash.com/photo-1765188989413-b0f07270cd63?w=800',
      videoUrl: formData.videoUrl,
      teacher: selectedTeacher,
      level: formData.level,
      hskLevel: formData.hskLevel ? parseInt(formData.hskLevel) : undefined,
      duration: formData.duration,
      totalLessons: formData.totalLessons,
      price: parseFloat(formData.price),
      salePrice: formData.salePrice ? parseFloat(formData.salePrice) : undefined,
      rating: 5.0,
      totalReviews: 0,
      tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
      goals: formData.goals.split('\n').map(g => g.trim()).filter(g => g),
      curriculum: formData.curriculum,
      isFeatured: false
    };

    console.log('Khóa học mới được tạo:', newCourse);
    alert(`Khóa học "${newCourse.titleVi}" đã được tạo thành công!`);
    setShowModal(false);
  };

  return (
    <div>
      <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý khóa học</h1>
          <p className="text-gray-600 mt-1">Tổng cộng {courses.length} khóa học</p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-yellow-500 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
        >
          <Plus className="h-5 w-5" />
          Thêm khóa học
        </button>
      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm khóa học..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent">
            <option value="">Tất cả cấp độ</option>
            <option value="basic">Cơ bản</option>
            <option value="intermediate">Trung cấp</option>
            <option value="advanced">Nâng cao</option>
          </select>
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent">
            <option value="">Tất cả HSK</option>
            <option value="1">HSK 1</option>
            <option value="2">HSK 2</option>
            <option value="3">HSK 3</option>
            <option value="4">HSK 4</option>
            <option value="5">HSK 5</option>
            <option value="6">HSK 6</option>
          </select>
        </div>
      </div>

      {/* Courses Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Khóa học
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Giảng viên
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Cấp độ
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Giá
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Đánh giá
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Học viên
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredCourses.map((course) => (
                <tr key={course.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={course.thumbnail}
                        alt={course.titleVi}
                        className="w-16 h-12 rounded-lg object-cover"
                      />
                      <div>
                        <div className="font-semibold text-gray-900 line-clamp-1">
                          {course.titleVi}
                        </div>
                        <div className="text-sm text-gray-500">
                          {course.totalLessons} bài học
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <img
                        src={course.teacher.avatar}
                        alt={course.teacher.nameVi}
                        className="w-8 h-8 rounded-full"
                      />
                      <span className="text-gray-900">{course.teacher.nameVi}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col gap-1">
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-semibold inline-block">
                        {course.level}
                      </span>
                      {course.hskLevel && (
                        <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-semibold inline-block">
                          HSK {course.hskLevel}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      {course.salePrice ? (
                        <>
                          <div className="font-semibold text-red-600">
                            {course.salePrice.toLocaleString()}đ
                          </div>
                          <div className="text-sm text-gray-400 line-through">
                            {course.price.toLocaleString()}đ
                          </div>
                        </>
                      ) : (
                        <div className="font-semibold text-gray-900">
                          {course.price.toLocaleString()}đ
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-500">★</span>
                      <span className="font-semibold text-gray-900">{course.rating}</span>
                      <span className="text-gray-500 text-sm">
                        ({course.totalReviews})
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-semibold text-gray-900">
                      {(course.totalReviews * 3).toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <button
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Xem chi tiết"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                        title="Chỉnh sửa"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Xóa"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create/Edit Modal (simplified) */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {modalMode === 'create' ? 'Thêm khóa học mới' : 'Chỉnh sửa khóa học'}
            </h2>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <button
                  className={`px-4 py-2 ${currentTab === 'basic' ? 'bg-gray-100' : 'bg-white'} rounded-lg border border-gray-300`}
                  onClick={() => setCurrentTab('basic')}
                >
                  Cơ bản
                </button>
                <button
                  className={`px-4 py-2 ${currentTab === 'details' ? 'bg-gray-100' : 'bg-white'} rounded-lg border border-gray-300`}
                  onClick={() => setCurrentTab('details')}
                >
                  Chi tiết
                </button>
                <button
                  className={`px-4 py-2 ${currentTab === 'curriculum' ? 'bg-gray-100' : 'bg-white'} rounded-lg border border-gray-300`}
                  onClick={() => setCurrentTab('curriculum')}
                >
                  Nội dung khóa học
                </button>
              </div>
              {currentTab === 'basic' && (
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-gray-600">Tên khóa học (Tiếng Việt)</label>
                    <input
                      type="text"
                      value={formData.titleVi}
                      onChange={(e) => handleInputChange('titleVi', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-gray-600">Tên khóa học (Tiếng Anh)</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-gray-600">Mô tả</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      rows={4}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-gray-600">Ảnh đại diện</label>
                    <div className="flex items-center gap-4">
                      <img
                        src={formData.thumbnail || 'https://via.placeholder.com/150'}
                        alt="Thumbnail"
                        className="w-16 h-12 rounded-lg object-cover"
                      />
                      <button
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-yellow-500 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
                      >
                        <Upload className="h-5 w-5" />
                        Tải ảnh
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-gray-600">Giảng viên</label>
                    <select
                      value={formData.teacherId}
                      onChange={(e) => handleInputChange('teacherId', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    >
                      <option value="">Chọn giảng viên</option>
                      {teachers.map((teacher: Teacher) => (
                        <option key={teacher.id} value={teacher.id}>
                          {teacher.nameVi}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-gray-600">Cấp độ</label>
                    <select
                      value={formData.level}
                      onChange={(e) => handleInputChange('level', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    >
                      <option value="basic">Cơ bản</option>
                      <option value="intermediate">Trung cấp</option>
                      <option value="advanced">Nâng cao</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-gray-600">HSK Level</label>
                    <select
                      value={formData.hskLevel}
                      onChange={(e) => handleInputChange('hskLevel', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    >
                      <option value="">Chọn HSK Level</option>
                      <option value="1">HSK 1</option>
                      <option value="2">HSK 2</option>
                      <option value="3">HSK 3</option>
                      <option value="4">HSK 4</option>
                      <option value="5">HSK 5</option>
                      <option value="6">HSK 6</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-gray-600">Thời lượng khóa học</label>
                    <input
                      type="text"
                      value={formData.duration}
                      onChange={(e) => handleInputChange('duration', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-gray-600">Số bài học</label>
                    <input
                      type="number"
                      value={formData.totalLessons}
                      onChange={(e) => handleInputChange('totalLessons', parseInt(e.target.value))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-gray-600">Giá khóa học</label>
                    <input
                      type="text"
                      value={formData.price}
                      onChange={(e) => handleInputChange('price', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-gray-600">Giá khuyến mãi</label>
                    <input
                      type="text"
                      value={formData.salePrice}
                      onChange={(e) => handleInputChange('salePrice', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                </div>
              )}
              {currentTab === 'details' && (
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-gray-600">Tags</label>
                    <input
                      type="text"
                      value={formData.tags}
                      onChange={(e) => handleInputChange('tags', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-gray-600">Mục tiêu khóa học</label>
                    <textarea
                      value={formData.goals}
                      onChange={(e) => handleInputChange('goals', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      rows={4}
                    />
                  </div>
                </div>
              )}
              {currentTab === 'curriculum' && (
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-gray-600">Video URL</label>
                    <input
                      type="text"
                      value={formData.videoUrl}
                      onChange={(e) => handleInputChange('videoUrl', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-gray-600">Thêm bài học</label>
                    <div className="flex items-center gap-4">
                      <input
                        type="text"
                        value={newLesson.titleVi}
                        onChange={(e) => setNewLesson(prev => ({ ...prev, titleVi: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder="Tên bài học (Tiếng Việt)"
                      />
                      <input
                        type="text"
                        value={newLesson.duration}
                        onChange={(e) => setNewLesson(prev => ({ ...prev, duration: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder="Thời lượng"
                      />
                      <select
                        value={newLesson.type}
                        onChange={(e) => setNewLesson(prev => ({ ...prev, type: e.target.value as 'video' | 'quiz' | 'practice' | 'flashcard' }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      >
                        <option value="video">Video</option>
                        <option value="quiz">Quiz</option>
                        <option value="practice">Practice</option>
                        <option value="flashcard">Flashcard</option>
                      </select>
                      <button
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-yellow-500 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
                        onClick={addLesson}
                      >
                        <Plus className="h-5 w-5" />
                        Thêm
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-gray-600">Danh sách bài học</label>
                    <div className="flex flex-col gap-2">
                      {formData.curriculum.map((lesson: Lesson) => (
                        <div key={lesson.id} className="flex items-center gap-4">
                          <span className="text-gray-900">{lesson.titleVi}</span>
                          <span className="text-gray-500">{lesson.duration}</span>
                          <button
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Xóa"
                            onClick={() => removeLesson(lesson.id)}
                          >
                            <Trash className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                className="px-4 py-2 bg-gradient-to-r from-red-600 to-yellow-500 text-white rounded-lg hover:opacity-90"
                onClick={handleSubmit}
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}