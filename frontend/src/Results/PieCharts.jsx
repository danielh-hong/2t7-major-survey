import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import styles from './Charts.module.css';

const PieCharts = ({ data }) => {
  const [pieSize, setPieSize] = useState(130);
  const [legendPosition, setLegendPosition] = useState('right');

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setPieSize(100);
        setLegendPosition('bottom');
      } else if (window.innerWidth <= 1024) {
        setPieSize(110);
        setLegendPosition('right');
      } else {
        setPieSize(130);
        setLegendPosition('right');
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const choices = [
    { 
      key: 'first', 
      name: 'First Choice', 
      colors: [
        '#2E86AB', // Deep Blue
        '#F6511D', // Bright Orange
        '#7B2D26', // Dark Red
        '#5FAD56', // Green
        '#9B4DCA', // Purple
        '#F0C808', // Yellow
        '#3B7080', // Teal
        '#D64933'  // Coral
      ]
    },
    { 
      key: 'second', 
      name: 'Second Choice', 
      colors: [
        '#00A896', // Teal
        '#FF6B6B', // Salmon
        '#4ECDC4', // Turquoise
        '#FFD93D', // Gold
        '#95A5A6', // Gray
        '#E84855', // Red
        '#6C5B7B', // Purple
        '#45B7D1'  // Light Blue
      ]
    },
    { 
      key: 'third', 
      name: 'Third Choice', 
      colors: [
        '#FF9F1C', // Orange
        '#2EC4B6', // Turquoise
        '#E71D36', // Red
        '#662E9B', // Purple
        '#43AA8B', // Green
        '#F46036', // Coral
        '#2B50AA', // Blue
        '#7F2982'  // Magenta
      ]
    }
  ];

  const formatData = (choiceType) => {
    // Get data for this choice and filter out zeros
    let choiceData = data
      .map((major) => ({
        name: major.name,
        value: major[choiceType] || 0
      }))
      .filter(item => item.value > 0)
      .sort((a, b) => b.value - a.value);

    // Calculate total for this choice
    const total = choiceData.reduce((sum, item) => sum + item.value, 0);
    
    // Add total to each item for percentage calculation
    choiceData = choiceData.map(item => ({
      ...item,
      total
    }));

    return choiceData;
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const percentage = ((data.value / data.payload.total) * 100).toFixed(1);
      return (
        <div className={styles.customTooltip}>
          <p className={styles.tooltipLabel}>{data.name}</p>
          <p className={styles.tooltipData} style={{ color: data.payload.fill }}>
            Count: {data.value} ({percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={styles.pieChartsContainer}>
      {choices.map((choice) => {
        const chartData = formatData(choice.key);
        const total = chartData.reduce((sum, item) => sum + item.value, 0);
        const chartHeight = 400;
        
        return (
          <div key={choice.key} className={styles.pieChartCard}>
            <h3 className={styles.chartTitle}>{choice.name} Distribution</h3>
            <div className={styles.chartContainer}>
              <ResponsiveContainer width="100%" height={chartHeight}>
                <PieChart margin={{ top: 0, right: 0, bottom: 50, left: 0 }}>
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={pieSize}
                    innerRadius={pieSize/2}
                  >
                    {chartData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`}
                        fill={choice.colors[index % choice.colors.length]}
                        stroke="white"
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    layout="horizontal"
                    align="center"
                    verticalAlign="bottom"
                    formatter={(value, entry) => {
                      const item = chartData.find(d => d.name === value);
                      if (!item) return value;
                      const percentage = ((item.value / total) * 100).toFixed(1);
                      return `${value.length > 15 ? value.substring(0, 15) + '...' : value} (${percentage}%)`;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PieCharts;