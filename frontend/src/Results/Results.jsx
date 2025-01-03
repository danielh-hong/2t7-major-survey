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
import Loading from '../Loading';
import styles from './Results.module.css';
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

  const BASE_URL = import.meta.env.VITE_DEPLOYED_BACKEND_API_URL;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/survey/stats`);
      if (!response.ok) throw new Error('Failed to fetch data');
      const result = await response.json();
      console.log('Raw API response:', result); // Debug log
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatChartData = () => {
    const formattedData = MAJORS.map(major => {
      const firstCount = data?.firstChoiceStats?.find(s => s._id === major)?.count || 0;
      const secondCount = data?.secondChoiceStats?.find(s => s._id === major)?.count || 0;
      const thirdCount = data?.thirdChoiceStats?.find(s => s._id === major)?.count || 0;

      return {
        name: major,
        first: firstCount,
        second: secondCount,
        third: thirdCount
      };
    });

    console.log('Formatted chart data:', formattedData); // Debug log
    return formattedData;
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

  const chartData = formatChartData();

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
        <header className={styles.header}>
          <h1 className={styles.title}>EngSci Major Selection Results</h1>
          <p className={styles.subtitle}>Class of 2T7 Major Preferences Dashboard</p>
        </header>

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

        {activeViewTab === 'charts' && (
          <>
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

              {activeChartTab === 'combined' && <CombinedBarChart data={chartData} />}
              {activeChartTab === 'individual' && <IndividualBarCharts data={chartData} />}
              {activeChartTab === 'pie' && <PieCharts data={chartData} />}
            </div>
          </>
        )}

        {activeViewTab === 'individual' && (
          <FilteredChoices data={data} />
        )}
      </div>
    </div>
  );
};

export default Results;