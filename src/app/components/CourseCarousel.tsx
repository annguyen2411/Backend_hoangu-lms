import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Star, Play } from 'lucide-react';
import { Link } from 'react-router';
import { Course } from '../data/mockData';

interface CourseCarouselProps {
  courses: Course[];
}

export function CourseCarousel({ courses }: CourseCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slidesToShow, setSlidesToShow] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setSlidesToShow(1);
      } else if (window.innerWidth < 1024) {
        setSlidesToShow(2);
      } else {
        setSlidesToShow(3);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto-slide
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % courses.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [courses.length]);

  const visibleCourses = [];
  for (let i = 0; i < slidesToShow; i++) {
    const index = (currentIndex + i) % courses.length;
    visibleCourses.push(courses[index]);
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + courses.length) % courses.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % courses.length);
  };

  return (
    <div className="relative">
      <div className="overflow-hidden">
        <div className="flex gap-6">
          <AnimatePresence mode="popLayout">
            {visibleCourses.map((course, idx) => (
              <motion.div
                key={`${course.id}-${currentIndex}-${idx}`}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                className={`flex-shrink-0 ${
                  slidesToShow === 1
                    ? 'w-full'
                    : slidesToShow === 2
                    ? 'w-[calc(50%-12px)]'
                    : 'w-[calc(33.333%-16px)]'
                }`}
              >
                <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow h-full">
                  <div className="relative group">
                    <img
                      src={course.thumbnail}
                      alt={course.titleVi}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Play className="h-16 w-16 text-white" />
                    </div>
                    {course.salePrice && (
                      <div className="absolute top-3 right-3 bg-error text-white px-3 py-1 rounded-full text-sm font-bold shadow-md">
                        -{Math.round(((course.price - course.salePrice) / course.price) * 100)}%
                      </div>
                    )}
                    <div className="absolute bottom-3 left-3 flex gap-2 flex-wrap">
                      {course.hskLevel && (
                        <span className="px-3 py-1 bg-primary-light text-primary rounded-full text-xs font-semibold">
                          HSK {course.hskLevel}
                        </span>
                      )}
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold">
                        {course.level}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                      {course.titleVi}
                    </h3>

                    <div className="flex items-center gap-2 mb-3">
                      <img
                        src={course.teacher.avatar}
                        alt={course.teacher.nameVi}
                        className="w-8 h-8 rounded-full"
                      />
                      <span className="text-sm text-gray-600">
                        {course.teacher.nameVi}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                      <span>{course.duration}</span>
                      <span>•</span>
                      <span>{course.totalLessons} bài</span>
                    </div>

                    <div className="flex items-center gap-1 mb-4">
                      <Star className="h-4 w-4 fill-warning text-warning" />
                      <span className="font-semibold text-gray-900">{course.rating}</span>
                      <span className="text-sm text-gray-500">
                        ({course.totalReviews} đánh giá)
                      </span>
                    </div>

                    <div className="flex items-end justify-between mb-4">
                      <div>
                        {course.salePrice ? (
                          <>
                            <span className="text-2xl font-bold text-error">
                              {course.salePrice.toLocaleString()}đ
                            </span>
                            <span className="ml-2 text-sm text-gray-400 line-through">
                              {course.price.toLocaleString()}đ
                            </span>
                          </>
                        ) : (
                          <span className="text-2xl font-bold text-gray-900">
                            {course.price.toLocaleString()}đ
                          </span>
                        )}
                      </div>
                    </div>

                    <Link
                      to={`/courses/${course.slug}`}
                      className="block w-full py-3 bg-gradient-to-r from-[var(--theme-gradient-from)] to-[var(--theme-gradient-to)] text-white text-center rounded-lg font-semibold hover:opacity-90 transition-opacity"
                    >
                      Xem chi tiết
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={goToPrevious}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 lg:-translate-x-12 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors z-10"
        aria-label="Previous"
      >
        <ChevronLeft className="h-6 w-6 text-primary" />
      </button>

      <button
        onClick={goToNext}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 lg:translate-x-12 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors z-10"
        aria-label="Next"
      >
        <ChevronRight className="h-6 w-6 text-primary" />
      </button>

      {/* Dots */}
      <div className="flex justify-center gap-2 mt-8">
        {courses.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex ? 'bg-primary w-8' : 'bg-gray-300'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}