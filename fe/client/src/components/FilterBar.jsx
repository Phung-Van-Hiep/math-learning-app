import { useState } from 'react';
import './FilterBar.css';

const FilterBar = ({ onFilterChange, onSearchChange, onSortChange }) => {
  const [activeGrade, setActiveGrade] = useState('all');
  const [activeStatus, setActiveStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  const grades = [
    { id: 'all', label: 'Tất cả' },
    { id: '6', label: 'Lớp 6' },
    { id: '7', label: 'Lớp 7' },
    { id: '8', label: 'Lớp 8' },
    { id: '9', label: 'Lớp 9' }
  ];

  const statuses = [
    { id: 'all', label: 'Tất cả' },
    { id: 'in-progress', label: 'Đang học' },
    { id: 'completed', label: 'Đã hoàn thành' },
    { id: 'not-started', label: 'Chưa học' }
  ];

  const sortOptions = [
    { id: 'newest', label: 'Mới nhất' },
    { id: 'popular', label: 'Phổ biến nhất' },
    { id: 'highest-rated', label: 'Đánh giá cao nhất' },
    { id: 'a-z', label: 'A-Z' },
    { id: 'progress', label: 'Tiến độ' }
  ];

  const handleGradeClick = (gradeId) => {
    setActiveGrade(gradeId);
    if (onFilterChange) {
      onFilterChange({ grade: gradeId, status: activeStatus });
    }
  };

  const handleStatusClick = (statusId) => {
    setActiveStatus(statusId);
    if (onFilterChange) {
      onFilterChange({ grade: activeGrade, status: statusId });
    }
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (onSearchChange) {
      onSearchChange(query);
    }
  };

  const handleSortChange = (e) => {
    const sort = e.target.value;
    setSortBy(sort);
    if (onSortChange) {
      onSortChange(sort);
    }
  };

  return (
    <section className="filter-bar">
      <div className="filter-container">
        {/* Row 1: Grade Filters and Search */}
        <div className="filter-row">
          <div className="grade-filters">
            {grades.map((grade) => (
              <button
                key={grade.id}
                className={`filter-chip ${activeGrade === grade.id ? 'active' : ''}`}
                onClick={() => handleGradeClick(grade.id)}
              >
                {grade.label}
                {grade.id === 'all' && ' ▼'}
              </button>
            ))}
          </div>

          <div className="search-box">
            <input
              type="text"
              className="search-input"
              placeholder="🔍 Tìm kiếm..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
        </div>

        {/* Row 2: Status Filters and Sort */}
        <div className="filter-row">
          <div className="status-filters">
            {statuses.map((status) => (
              <button
                key={status.id}
                className={`filter-chip ${activeStatus === status.id ? 'active' : ''}`}
                onClick={() => handleStatusClick(status.id)}
              >
                {status.label}
              </button>
            ))}
          </div>

          <div className="sort-box">
            <label htmlFor="sort-select">Sắp xếp:</label>
            <select
              id="sort-select"
              className="sort-select"
              value={sortBy}
              onChange={handleSortChange}
            >
              {sortOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FilterBar;
