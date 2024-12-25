// IndividualBarCharts.jsx
import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import styles from './Charts.module.css';

const IndividualBarCharts = ({ data }) => {
  const choices = [
    { key: 'first', name: 'First Choice', color: '#4CAF50' },
    { key: 'second', name: 'Second Choice', color: '#2196F3' },
    { key: 'third', name: 'Third Choice', color: '#FFC107' },
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className={styles.customTooltip}>
          <p className={styles.tooltipLabel}>{label}</p>
          <p className={styles.tooltipData} style={{ color: payload[0].color }}>
            Count: {payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={styles.individualChartsContainer}>
      {choices.map((choice) => (
        <div key={choice.key} className={styles.individualChartCard}>
          <h3 className={styles.chartTitle}>{choice.name} Distribution</h3>
          <div className={styles.chartContainer}>
            <ResponsiveContainer width="100%" height={400} minWidth={300}>
              <BarChart
                data={data}
                margin={{ top: 20, right: 30, left: 30, bottom: 70 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name"
                  interval={0}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                  tick={{ fontSize: 12 }}
                  tickFormatter={value => {
                    // Truncate long names
                    return value.length > 15 ? value.substring(0, 15) + '...' : value;
                  }}
                />
                <YAxis 
                  tickFormatter={value => Math.round(value)}
                  domain={[0, 'dataMax + 5']}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey={choice.key}
                  fill={choice.color}
                  radius={[4, 4, 0, 0]}
                  maxBarSize={50}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      ))}
    </div>
  );
};

export default IndividualBarCharts;