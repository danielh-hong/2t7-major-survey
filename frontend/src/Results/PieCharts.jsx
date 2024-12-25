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

    handleResize(); // Initial call
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const choices = [
    { key: 'first', name: 'First Choice', colors: ['#4CAF50', '#81C784', '#A5D6A7', '#C8E6C9', '#E8F5E9', '#B2DFDB', '#80CBC4', '#4DB6AC'] },
    { key: 'second', name: 'Second Choice', colors: ['#2196F3', '#64B5F6', '#90CAF9', '#BBDEFB', '#E3F2FD', '#B3E5FC', '#81D4FA', '#4FC3F7'] },
    { key: 'third', name: 'Third Choice', colors: ['#FFC107', '#FFD54F', '#FFE082', '#FFECB3', '#FFF8E1', '#FFE0B2', '#FFCC80', '#FFB74D'] }
  ];

  const formatData = (choiceType) => {
    return data
      .map((major) => ({
        name: major.name,
        value: major[choiceType] || 0
      }))
      .filter(item => item.value > 0)
      .sort((a, b) => b.value - a.value);
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
        const chartHeight = legendPosition === 'bottom' ? 500 : 400;
        
        return (
          <div key={choice.key} className={styles.pieChartCard}>
            <h3 className={styles.chartTitle}>{choice.name} Distribution</h3>
            <div className={styles.chartContainer}>
              <ResponsiveContainer width="100%" height={chartHeight}>
                <PieChart>
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
                    wrapperStyle={{
                      position: 'relative',
                      marginTop: '20px',
                      width: '100%'
                    }}
                    formatter={(value, entry) => {
                      const item = chartData.find(d => d.name === value);
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