import React, { useState, useMemo } from 'react';
import { Search, Filter, Users, TrendingUp, HelpCircle } from 'lucide-react';
import styles from './FilteredChoices.module.css';

const FilteredChoices = ({ data }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState(['first', 'second', 'third']);
  
  const filterOptions = [
    { id: 'first', label: 'First Choice' },
    { id: 'second', label: 'Second Choice' },
    { id: 'third', label: 'Third Choice' }
  ];

  // Filter and search logic
  const filteredData = useMemo(() => {
    return data.responses?.filter(response => {
      const searchMatch = searchTerm.toLowerCase() === '' || 
        Object.values(response.preferences).some(choice => 
          choice.toLowerCase().includes(searchTerm.toLowerCase())
        );

      const filterMatch = (
        (activeFilters.includes('first') && response.preferences.firstChoice) ||
        (activeFilters.includes('second') && response.preferences.secondChoice) ||
        (activeFilters.includes('third') && response.preferences.thirdChoice)
      );

      return searchMatch && filterMatch;
    }) || [];
  }, [data.responses, searchTerm, activeFilters]);

  // Calculate stats for filtered data
  const stats = useMemo(() => ({
    totalResponses: filteredData.length,
    decidedCount: filteredData.filter(r => r.hasDecided).length,
    undecidedCount: filteredData.filter(r => !r.hasDecided).length
  }), [filteredData]);

  const toggleFilter = (filterId) => {
    setActiveFilters(prev => {
      // Prevent removing all filters
      if (prev.length === 1 && prev.includes(filterId)) {
        return prev;
      }
      return prev.includes(filterId)
        ? prev.filter(f => f !== filterId)
        : [...prev, filterId];
    });
  };

  const StatCard = ({ label, value, icon: Icon, variant }) => (
    <div className={`${styles.statsCard} ${styles[`statsCard${variant}`]}`}>
      <div className={styles.statsContent}>
        <div className={styles.statsInfo}>
          <p className={styles.statsLabel}>{label}</p>
          <p className={styles.statsValue}>{value}</p>
        </div>
        <Icon className={styles.statsIcon} />
      </div>
    </div>
  );

  return (
    <div className={styles.container}>
      {/* Search and Filter Controls */}
      <div className={styles.controls}>
        <div className={styles.searchWrapper}>
          <Search className={styles.searchIcon} size={20} />
          <input
            type="text"
            placeholder="Search by major..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.filterSection}>
          <div className={styles.filterLabel}>
            <Filter size={20} />
            <span>Filter by:</span>
          </div>
          <div className={styles.filterButtons}>
            {filterOptions.map(filter => (
              <button
                key={filter.id}
                onClick={() => toggleFilter(filter.id)}
                className={`${styles.filterButton} ${
                  activeFilters.includes(filter.id) ? styles.filterButtonActive : ''
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className={styles.statsGrid}>
        <StatCard
          label="Filtered Responses"
          value={stats.totalResponses}
          icon={Users}
          variant="Primary"
        />
        <StatCard
          label="Decided"
          value={stats.decidedCount}
          icon={TrendingUp}
          variant="Success"
        />
        <StatCard
          label="Undecided"
          value={stats.undecidedCount}
          icon={HelpCircle}
          variant="Warning"
        />
      </div>

      {/* Results Table */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              {activeFilters.includes('first') && <th>First Choice</th>}
              {activeFilters.includes('second') && <th>Second Choice</th>}
              {activeFilters.includes('third') && <th>Third Choice</th>}
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((response, index) => (
              <tr key={index}>
                {activeFilters.includes('first') && (
                  <td>{response.preferences.firstChoice}</td>
                )}
                {activeFilters.includes('second') && (
                  <td>{response.preferences.secondChoice}</td>
                )}
                {activeFilters.includes('third') && (
                  <td>{response.preferences.thirdChoice}</td>
                )}
                <td>
                  <span className={`${styles.statusBadge} ${
                    response.hasDecided ? styles.statusDecided : styles.statusUndecided
                  }`}>
                    {response.hasDecided ? 'Decided' : 'Undecided'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* No Results Message */}
      {filteredData.length === 0 && (
        <div className={styles.noResults}>
          No results found for your search criteria
        </div>
      )}
    </div>
  );
};

export default FilteredChoices;