// Results.jsx
import React, { useState, useEffect } from 'react';
import { 
  BarChart3, PieChart as PieChartIcon, Table2, TrendingUp, Users, HelpCircle 
} from 'lucide-react';
import styles from './Results.module.css';

// Import the separate chart components
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

const COLORS = [
  '#4CAF50', '#2196F3', '#FFC107', 
  '#FF5722', '#9C27B0', '#00BCD4', 
  '#E91E63', '#FF9800'
];

const Results = () => {
  const [activeViewTab, setActiveViewTab] = useState('charts'); // 'charts' or 'individual'
  const [activeChartTab, setActiveChartTab] = useState('combined'); // 'combined', 'individual', 'pie'
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/survey/stats');
      if (!response.ok) throw new Error('Failed to fetch data');
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatCombinedChartData = () => {
    return MAJORS.map(major => ({
      name: major,
      first: data?.firstChoiceStats?.find(s => s._id === major)?.count || 0,
      second: data?.secondChoiceStats?.find(s => s._id === major)?.count || 0,
      third: data?.thirdChoiceStats?.find(s => s._id === major)?.count || 0
    }));
  };

  const formatPieChartData = (choiceType) => {
    return MAJORS.map(major => ({
      name: major,
      value: data?.[`${choiceType.toLowerCase()}ChoiceStats`]?.find(s => s._id === major)?.count || 0
    }));
  };

  const renderCombinedBarChart = () => (
    <CombinedBarChart data={formatCombinedChartData()} />
  );

  const renderIndividualBarCharts = () => (
    <IndividualBarCharts data={formatCombinedChartData()} />
  );

  const renderPieCharts = () => (
    <PieCharts data={formatCombinedChartData()} />
  );

  const renderIndividualChoicesTable = () => (
    <div className={styles.tableCard}>
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>First Choice</th>
              <th>Second Choice</th>
              <th>Third Choice</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {data.responses?.map((response, index) => (
              <tr key={index}>
                <td>{response.preferences.firstChoice}</td>
                <td>{response.preferences.secondChoice}</td>
                <td>{response.preferences.thirdChoice}</td>
                <td>
                  <span className={`${styles.status} ${
                    response.hasDecided ? styles.decidedStatus : styles.undecidedStatus
                  }`}>
                    {response.hasDecided ? 'Decided' : 'Undecided'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingText}>Loading results...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorText}>Error: {error}</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        
        {/* Header Section */}
        <div className={styles.header}>
          <h1 className={styles.title}>EngSci Major Selection Results</h1>
          <p className={styles.subtitle}>Class of 2T7 Major Preferences Dashboard</p>
        </div>

        {/* View Tabs */}
        <div className={styles.tabs}>
          <button
            onClick={() => setActiveViewTab('charts')}
            className={`${styles.tab} ${activeViewTab === 'charts' ? styles.activeTab : ''}`}
          >
            <BarChart3 />
            <span>Charts</span>
          </button>
          
          <button
            onClick={() => setActiveViewTab('individual')}
            className={`${styles.tab} ${activeViewTab === 'individual' ? styles.activeTab : ''}`}
          >
            <Table2 />
            <span>Individual Choices</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className={styles.statsGrid}>
          <div className={styles.statsCard}>
            <div className={styles.statsContent}>
              <div>
                <p className={styles.statsLabel}>Total Responses</p>
                <p className={styles.statsValue}>{data.totalResponses}</p>
              </div>
              <Users className={styles.statsIcon} />
            </div>
          </div>
          
          <div className={styles.statsCard}>
            <div className={styles.statsContent}>
              <div>
                <p className={styles.statsLabel}>Decided</p>
                <p className={`${styles.statsValue} ${styles.decidedValue}`}>
                  {data.decidedCount}
                </p>
              </div>
              <TrendingUp className={styles.statsIcon} />
            </div>
          </div>
          
          <div className={styles.statsCard}>
            <div className={styles.statsContent}>
              <div>
                <p className={styles.statsLabel}>Undecided</p>
                <p className={`${styles.statsValue} ${styles.undecidedValue}`}>
                  {data.undecidedCount}
                </p>
              </div>
              <HelpCircle className={styles.statsIcon} />
            </div>
          </div>
        </div>


        {/* Conditional Rendering Based on Active View Tab */}
        {activeViewTab === 'charts' && (
          <>
            {/* Charts Tabs */}
            <div className={styles.chartsTabs}>
              <button
                onClick={() => setActiveChartTab('combined')}
                className={`${styles.chartTab} ${activeChartTab === 'combined' ? styles.activeChartTab : ''}`}
              >
                <BarChart3 />
                <span>Combined Chart</span>
              </button>
              
              <button
                onClick={() => setActiveChartTab('individual')}
                className={`${styles.chartTab} ${activeChartTab === 'individual' ? styles.activeChartTab : ''}`}
              >
                <BarChart3 />
                <span>Individual Charts</span>
              </button>
              
              <button
                onClick={() => setActiveChartTab('pie')}
                className={`${styles.chartTab} ${activeChartTab === 'pie' ? styles.activeChartTab : ''}`}
              >
                <PieChartIcon />
                <span>Pie Charts</span>
              </button>
            </div>

            {/* Render Charts Based on Active Chart Tab */}
            <div className={styles.chartContainer}>
              {activeChartTab === 'combined' && renderCombinedBarChart()}
              {activeChartTab === 'individual' && renderIndividualBarCharts()}
              {activeChartTab === 'pie' && renderPieCharts()}
            </div>
          </>
        )}

        {/* Individual Choices Table */}
        {activeViewTab === 'individual' && renderIndividualChoicesTable()}

      </div>
    </div>
  );
};

export default Results;
