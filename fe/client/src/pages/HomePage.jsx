import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import lessonService from '../services/lessonService';
import { getThumbnailURL } from '../utils/urlHelper';
import Header from '../components/Header';
import HeroBanner from '../components/HeroBanner';
import QuickStats from '../components/QuickStats';
import FilterBar from '../components/FilterBar';
import LessonsGrid from '../components/LessonsGrid';
import Footer from '../components/Footer';

const HomePage = () => {
  const { user } = useAuth();
  const [lessons, setLessons] = useState([]);
  const [filteredLessons, setFilteredLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter state
  const [filters, setFilters] = useState({
    grade: null,
    status: 'all',
    searchQuery: '',
    sortBy: 'newest',
  });

  // Fetch lessons on mount
  useEffect(() => {
    fetchLessons();
  }, []);

  // Apply filters whenever lessons or filters change
  useEffect(() => {
    applyFilters();
  }, [lessons, filters]);

  const fetchLessons = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch lessons with progress for students
      const data = user?.role === 'student'
        ? await lessonService.getMyLessons()
        : await lessonService.getPublishedLessons();

      // Transform data to match frontend format
      const transformedLessons = data.map((lesson) => ({
        id: lesson.id,
        title: lesson.title,
        slug: lesson.slug,
        thumbnail: lesson.thumbnail, // Don't transform here, let LessonCard handle it
        grade: lesson.grade,
        duration: lesson.duration,
        rating: lesson.rating,
        reviewCount: lesson.review_count,
        difficulty: lesson.difficulty,
        progress: lesson.progress || 0,
        is_completed: lesson.is_completed || false,
      }));

      setLessons(transformedLessons);
    } catch (err) {
      console.error('Error fetching lessons:', err);
      setError('Không thể tải danh sách bài học');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let result = [...lessons];

    // Filter by grade
    if (filters.grade) {
      result = result.filter((lesson) => lesson.grade === filters.grade);
    }

    // Filter by status
    if (filters.status !== 'all') {
      switch (filters.status) {
        case 'in-progress':
          result = result.filter((lesson) => lesson.progress > 0 && lesson.progress < 100);
          break;
        case 'completed':
          result = result.filter((lesson) => lesson.progress === 100);
          break;
        case 'not-started':
          result = result.filter((lesson) => lesson.progress === 0);
          break;
        default:
          break;
      }
    }

    // Search filter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      result = result.filter((lesson) =>
        lesson.title.toLowerCase().includes(query)
      );
    }

    // Sort
    switch (filters.sortBy) {
      case 'newest':
        // Assuming newer lessons have higher IDs
        result.sort((a, b) => b.id - a.id);
        break;
      case 'popular':
        result.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      case 'highest-rated':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'a-z':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'progress':
        result.sort((a, b) => b.progress - a.progress);
        break;
      default:
        break;
    }

    setFilteredLessons(result);
  };

  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({
      ...prev,
      grade: newFilters.grade === 'all' ? null : parseInt(newFilters.grade),
      status: newFilters.status,
    }));
  };

  const handleSearchChange = (query) => {
    setFilters((prev) => ({
      ...prev,
      searchQuery: query,
    }));
  };

  const handleSortChange = (sortBy) => {
    setFilters((prev) => ({
      ...prev,
      sortBy,
    }));
  };

  // Calculate quick stats
  const stats = {
    totalLessons: lessons.length,
    completedLessons: lessons.filter((l) => l.progress === 100).length,
    averageScore: lessons.length > 0
      ? (lessons.reduce((acc, l) => acc + l.progress, 0) / lessons.length / 10).toFixed(1)
      : 0,
  };

  if (error) {
    return (
      <div className="app">
        <Header />
        <main>
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            <p style={{ color: 'var(--error-color)' }}>{error}</p>
            <button
              onClick={fetchLessons}
              style={{
                marginTop: '1rem',
                padding: '0.5rem 2rem',
                backgroundColor: 'var(--primary-color)',
                color: 'white',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
              }}
            >
              Thử lại
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="app">
      <Header />
      <main>
        <HeroBanner />
        <QuickStats stats={stats} />
        <FilterBar
          onFilterChange={handleFilterChange}
          onSearchChange={handleSearchChange}
          onSortChange={handleSortChange}
        />
        <LessonsGrid lessons={filteredLessons} loading={loading} />
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
