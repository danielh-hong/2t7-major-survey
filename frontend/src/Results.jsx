// Results.jsx
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { BarChart3, Table2, TrendingUp, Users, HelpCircle } from 'lucide-react';
import styles from './Results.module.css';

const MAJORS = [
  'Aerospace',
  'Biomedical Systems',
  'Electrical & Computer',
  'Energy Systems',
  'Machine Intelligence',
  'Mathematics, Statistics & Finance',
  'Physics',
  'Robotics'
];

const Results = () => {
  const [activeTab, setActiveTab] = useState('aggregate');
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

  const formatChartData = (stats) => {
    return MAJORS.map(major => ({
      name: major,
      count: stats?.find(s => s._id === major)?.count || 0
    }));
  };

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

        {/* Tabs */}
        <div className={styles.tabs}>
          <button
            onClick={() => setActiveTab('aggregate')}
            className={`${styles.tab} ${activeTab === 'aggregate' ? styles.activeTab : ''}`}
          >
            <BarChart3 />
            <span>Charts</span>
          </button>
          
          <button
            onClick={() => setActiveTab('individual')}
            className={`${styles.tab} ${activeTab === 'individual' ? styles.activeTab : ''}`}
          >
            <Table2 />
            <span>Individual Choices</span>
          </button>
        </div>

        {/* Content */}
        {activeTab === 'aggregate' ? (
          <div className={styles.chartsContainer}>
            {['First', 'Second', 'Third'].map((choice, index) => (
              <div key={choice} className={styles.chartCard}>
                <h2 className={styles.chartTitle}>
                  {choice} Choice Distribution
                </h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart 
                    data={formatChartData(data[`${choice.toLowerCase()}ChoiceStats`])}
                    margin={{ top: 5, right: 30, left: 20, bottom: 70 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="name" 
                      angle={-45} 
                      textAnchor="end" 
                      height={70} 
                    />
                    <YAxis />
                    <Tooltip />
                    <Bar 
                      dataKey="count" 
                      className={`chart-bar-${index + 1}`}
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ))}
          </div>
        ) : (
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
        )}
      </div>
    </div>
  );
};

export default Results;
