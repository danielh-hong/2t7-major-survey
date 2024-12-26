import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  PieChart as PieChartIcon, 
  Table2, 
  TrendingUp, 
  Users, 
  HelpCircle 
} from 'lucide-react';
import FilteredChoices from './FilteredChoices';
import Loading from '../Loading'; // Add this import
import styles from './Results.module.css';

// Import chart components (assuming they exist)
import CombinedBarChart from './CombinedBarChart';
import IndividualBarCharts from './IndividualBarCharts';
import PieCharts from './PieCharts';

const MAJORS = [
  'Aerospace',
  'Biomedical Systems',
  'Electrical & Computer',
  'Energy Systems',
  'Machine Intelligence',
  'Mathematics, Statistics & Finance',
  'Engineering Physics',
  'Robotics'
];

const Results = () => {
  const [activeViewTab, setActiveViewTab] = useState('charts');
  const [activeChartTab, setActiveChartTab] = useState('individual');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const BASE_URL = import.meta.env.VITE_BACKEND_API_URL; // Dynamically set backend URL

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/survey/stats`);
      if (!response.ok) throw new Error('Failed to fetch data');
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Loading />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className={styles.errorState}>
        <div className={styles.errorText}>Error: {error}</div>
      </div>
    );
  }

  const formatChartData = () => {
    return MAJORS.map(major => ({
      name: major,
      first: data?.firstChoiceStats?.find(s => s._id === major)?.count || 0,
      second: data?.secondChoiceStats?.find(s => s._id === major)?.count || 0,
      third: data?.thirdChoiceStats?.find(s => s._id === major)?.count || 0
    }));
  };

  // Helper Components
  const Tab = ({ active, onClick, icon: Icon, children }) => (
    <button
      onClick={onClick}
      className={`${styles.tab} ${active ? styles.tabActive : ''}`}
    >
      <Icon size={20} />
      <span>{children}</span>
    </button>
  );

  const StatsCard = ({ label, value, icon: Icon, variant }) => (
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
      <div className={styles.content}>
        {/* Header */}
        <header className={styles.header}>
          <h1 className={styles.title}>EngSci Major Selection Results</h1>
          <p className={styles.subtitle}>Class of 2T7 Major Preferences Dashboard</p>
        </header>

        {/* Main Navigation Tabs */}
        <div className={styles.tabsContainer}>
          <Tab 
            active={activeViewTab === 'charts'} 
            onClick={() => setActiveViewTab('charts')}
            icon={BarChart3}
          >
            Charts
          </Tab>
          <Tab 
            active={activeViewTab === 'individual'} 
            onClick={() => setActiveViewTab('individual')}
            icon={Table2}
          >
            Individual Choices
          </Tab>
        </div>

        {/* Stats Grid - Only show in charts view */}
        {activeViewTab === 'charts' && (
          <div className={styles.statsGrid}>
            <StatsCard 
              label="Total Responses" 
              value={data.totalResponses}
              icon={Users}
              variant="Primary"
            />
            <StatsCard 
              label="Decided" 
              value={data.decidedCount}
              icon={TrendingUp}
              variant="Success"
            />
            <StatsCard 
              label="Undecided" 
              value={data.undecidedCount}
              icon={HelpCircle}
              variant="Warning"
            />
          </div>
        )}

        {/* Charts View */}
        {activeViewTab === 'charts' && (
          <div className={styles.chartSection}>
            <div className={styles.tabsContainer}>
              <Tab 
                active={activeChartTab === 'individual'} 
                onClick={() => setActiveChartTab('individual')}
                icon={BarChart3}
              >
                Individual Charts
              </Tab>

              <Tab 
                active={activeChartTab === 'combined'} 
                onClick={() => setActiveChartTab('combined')}
                icon={BarChart3}
              >
                Combined Chart
              </Tab>

              <Tab 
                active={activeChartTab === 'pie'} 
                onClick={() => setActiveChartTab('pie')}
                icon={PieChartIcon}
              >
                Pie Charts
              </Tab>
            </div>

            {activeChartTab === 'combined' && <CombinedBarChart data={formatChartData()} />}
            {activeChartTab === 'individual' && <IndividualBarCharts data={formatChartData()} />}
            {activeChartTab === 'pie' && <PieCharts data={formatChartData()} />}
          </div>
        )}

        {/* Individual Choices View */}
        {activeViewTab === 'individual' && (
          <FilteredChoices data={data} />
        )}
      </div>
    </div>
  );
};

export default Results;
