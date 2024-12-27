import React, { useState, useMemo } from 'react';
import { Search, Filter, Users, TrendingUp, HelpCircle } from 'lucide-react';
import styles from './FilteredChoices.module.css';

const FilteredChoices = ({ data }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState(['name', 'first', 'second', 'third']);
  const [statusFilter, setStatusFilter] = useState('all');
  
  const filterOptions = [
    { id: 'name', label: 'Name' },
    { id: 'first', label: 'First Choice' },
    { id: 'second', label: 'Second Choice' },
    { id: 'third', label: 'Third Choice' }
  ];

  const statusOptions = [
    { id: 'all', label: 'All Status' },
    { id: 'decided', label: 'Decided' },
    { id: 'undecided', label: 'Undecided' }
  ];

  // Enhanced filter and search logic
  const filteredData = useMemo(() => {
    return data.responses?.filter(response => {
      // Status filter
      const statusMatch = 
        statusFilter === 'all' || 
        (statusFilter === 'decided' && response.hasDecided) ||
        (statusFilter === 'undecided' && !response.hasDecided);

      // Search filter - only search in active columns
      const searchLower = searchTerm.toLowerCase();
      const searchMatch = searchLower === '' || (
        (activeFilters.includes('name') && response.name?.toLowerCase().includes(searchLower)) ||
        (activeFilters.includes('first') && response.preferences?.firstChoice?.toLowerCase().includes(searchLower)) ||
        (activeFilters.includes('second') && response.preferences?.secondChoice?.toLowerCase().includes(searchLower)) ||
        (activeFilters.includes('third') && response.preferences?.thirdChoice?.toLowerCase().includes(searchLower))
      );

      // Column filter - check each active filter independently
      const filterMatch = activeFilters.some(filter => {
        switch(filter) {
          case 'name':
            return response.name;
          case 'first':
            return response.preferences?.firstChoice;
          case 'second':
            return response.preferences?.secondChoice;
          case 'third':
            return response.preferences?.thirdChoice;
          default:
            return false;
        }
      });

      return statusMatch && searchMatch && filterMatch;
    }) || [];
  }, [data.responses, searchTerm, activeFilters, statusFilter]);

  const stats = useMemo(() => ({
    totalResponses: filteredData.length,
    decidedCount: filteredData.filter(r => r.hasDecided).length,
    undecidedCount: filteredData.filter(r => !r.hasDecided).length
  }), [filteredData]);

  const toggleFilter = (filterId) => {
    setActiveFilters(prev => {
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

  const renderNameCell = (name) => {
    if (!name) return <td>-</td>;
    
    if (name.length > 15) {
      return (
        <td>
          <div className={styles.nameCell} title={name}>
            {name}
          </div>
        </td>
      );
    }
    
    return <td>{name}</td>;
  };

  return (
    <div className={styles.container}>
      <div className={styles.controls}>
        <div className={styles.searchWrapper}>
          <Search className={styles.searchIcon} size={20} />
          <input
            type="text"
            placeholder="Search by name or major..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.filterSection}>
          <div className={styles.filterGroup}>
            <div className={styles.filterLabel}>
              <Filter size={20} />
              <span>Columns:</span>
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

          <div className={styles.filterGroup}>
            <div className={styles.filterLabel}>
              <HelpCircle size={20} />
              <span>Status:</span>
            </div>
            <div className={styles.filterButtons}>
              {statusOptions.map(option => (
                <button
                  key={option.id}
                  onClick={() => setStatusFilter(option.id)}
                  className={`${styles.filterButton} ${
                    statusFilter === option.id ? styles.filterButtonActive : ''
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

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

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              {activeFilters.includes('name') && <th>Name</th>}
              {activeFilters.includes('first') && <th>First Choice</th>}
              {activeFilters.includes('second') && <th>Second Choice</th>}
              {activeFilters.includes('third') && <th>Third Choice</th>}
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((response, index) => (
              <tr key={index}>
                {activeFilters.includes('name') && renderNameCell(response.name)}
                {activeFilters.includes('first') && (
                  <td>{response.preferences?.firstChoice || '-'}</td>
                )}
                {activeFilters.includes('second') && (
                  <td>{response.preferences?.secondChoice || '-'}</td>
                )}
                {activeFilters.includes('third') && (
                  <td>{response.preferences?.thirdChoice || '-'}</td>
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

      {filteredData.length === 0 && (
        <div className={styles.noResults}>
          No results found for your search criteria
        </div>
      )}
    </div>
  );
};

export default FilteredChoices;