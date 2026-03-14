import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { Search, Filter, Star, Play, Clock, BookOpen, Grid, List } from 'lucide-react';
import { courses } from '../data/mockData';
import { SmartSearchBar } from '../components/SmartSearchBar';
import { AdvancedFilters } from '../components/AdvancedFilters';
import { FilterChips } from '../components/FilterChips';
import { smartSearch, SearchFilters } from '../utils/smartSearch';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

export function Courses() {
  const [filters, setFilters] = useState<Partial<SearchFilters>>({});
  const [filteredCourses, setFilteredCourses] = useState(courses);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    // Apply filters
    const results = smartSearch.search(
      courses,
      filters,
      ['titleVi', 'title', 'description', 'teacher.name', 'teacher.nameVi']
    );
    setFilteredCourses(results);

    // Save search history
    if (filters.query) {
      smartSearch.saveSearchHistory(filters.query, filters, results.length);
    }

    // Update suggestions
    if (filters.query && filters.query.length >= 2) {
      const newSuggestions = smartSearch.getSuggestions(
        filters.query,
        courses,
        ['titleVi', 'title'],
        8
      );
      setSuggestions(newSuggestions);
    } else {
      setSuggestions([]);
    }
  }, [filters]);

  const handleSearch = (query: string) => {
    setFilters({ ...filters, query });
  };

  const handleApplyFilters = (newFilters: Partial<SearchFilters>) => {
    setFilters(newFilters);
  };

  const handleRemoveFilter = (key: keyof SearchFilters, value?: any) => {
    const newFilters = { ...filters };
    
    if (key === 'levels' && value) {
      newFilters.levels = newFilters.levels?.filter(l => l !== value);
    } else if (key === 'duration' && value) {
      newFilters.duration = newFilters.duration?.filter(d => d !== value);
    } else {
      delete newFilters[key];
    }
    
    setFilters(newFilters);
  };

  const handleClearAll = () => {
    setFilters({ query: filters.query }); // Keep search query
  };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Header - Modern Flat with High Contrast */}
      <div className="bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Khóa học tiếng Hoa</h1>
          <p className="text-xl text-white mb-8">
            Khám phá {courses.length} khóa học chất lượng cao từ cơ bản đến nâng cao
          </p>
          
          {/* Smart Search Bar */}
          <div className="max-w-3xl">
            <SmartSearchBar
              placeholder="Tìm kiếm khóa học (VD: HSK 1, phát âm, giao tiếp...)"
              onSearch={handleSearch}
              suggestions={suggestions}
              onFilterClick={() => setShowFilters(true)}
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter Chips & View Toggle */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <FilterChips
            filters={filters}
            onRemoveFilter={handleRemoveFilter}
            onClearAll={handleClearAll}
          />
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {filteredCourses.length} kết quả
            </span>
            <div className="flex gap-1 border-2 border-border rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-[var(--theme-primary)] text-white'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'list'
                    ? 'bg-[var(--theme-primary)] text-white'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Courses Grid/List */}
        {filteredCourses.length > 0 ? (
          <div className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-4'
          }>
            {filteredCourses.map((course) => (
              <Link
                key={course.id}
                to={`/courses/${course.slug}`}
                className={`bg-card rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all group ${
                  viewMode === 'list' ? 'flex' : ''
                }`}
              >
                <div className={viewMode === 'list' ? 'w-64 flex-shrink-0' : 'relative pb-[56.25%]'}>
                  <img
                    src={course.thumbnail}
                    alt={course.titleVi}
                    className={`object-cover group-hover:scale-105 transition-transform duration-300 ${
                      viewMode === 'list' ? 'h-full w-full' : 'absolute inset-0 w-full h-full'
                    }`}
                  />
                  <div className="absolute top-3 left-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      course.hskLevel === 1
                        ? 'bg-green-500 text-white'
                        : course.hskLevel === 2
                        ? 'bg-blue-500 text-white'
                        : course.hskLevel === 3
                        ? 'bg-purple-500 text-white'
                        : course.hskLevel === 4
                        ? 'bg-orange-500 text-white'
                        : 'bg-red-500 text-white'
                    }`}>
                      {course.level}
                    </span>
                  </div>
                </div>

                <div className="p-6 flex-1">
                  <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-[var(--theme-primary)] transition-colors line-clamp-2">
                    {course.titleVi}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {course.title}
                  </p>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      <span className="font-semibold text-foreground">{course.rating}</span>
                      <span>({course.totalReviews})</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <BookOpen className="h-4 w-4" />
                      <span>{course.totalLessons} bài</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{course.duration}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      {course.salePrice ? (
                        <>
                          <span className="text-2xl font-bold text-[var(--theme-primary)]">
                            {course.salePrice.toLocaleString('vi-VN')}đ
                          </span>
                          <span className="text-sm text-muted-foreground line-through ml-2">
                            {course.price.toLocaleString('vi-VN')}đ
                          </span>
                        </>
                      ) : (
                        <span className="text-2xl font-bold text-[var(--theme-primary)]">
                          {course.price.toLocaleString('vi-VN')}đ
                        </span>
                      )}
                    </div>
                    <div className="w-10 h-10 bg-gradient-to-br from-[var(--theme-gradient-from)] to-[var(--theme-gradient-to)] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Play className="h-5 w-5 text-white fill-white" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-foreground mb-2">
              Không tìm thấy khóa học
            </h3>
            <p className="text-muted-foreground mb-6">
              Thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm
            </p>
            <button
              onClick={handleClearAll}
              className="px-6 py-3 bg-gradient-to-r from-[var(--theme-gradient-from)] to-[var(--theme-gradient-to)] text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              Xóa bộ lọc
            </button>
          </div>
        )}
      </div>

      {/* Advanced Filters Modal */}
      <AdvancedFilters
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        onApply={handleApplyFilters}
        initialFilters={filters}
      />
    </div>
  );
}