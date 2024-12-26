import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
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
      // Calculate total for this specific choice
      const choiceKey = payload[0].dataKey;
      const total = data.reduce((sum, item) => sum + (item[choiceKey] || 0), 0);
      const percentage = total > 0 ? ((payload[0].value / total) * 100).toFixed(1) : 0;

      return (
        <div className={styles.customTooltip}>
          <p className={styles.tooltipLabel}>{label}</p>
          <p className={styles.tooltipData} style={{ color: payload[0].color }}>
            Count: {payload[0].value} ({percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={styles.individualChartsContainer}>
      {choices.map((choice) => {
        // Sort data for this specific choice but keep all majors
        const sortedData = [...data]
          .sort((a, b) => (b[choice.key] || 0) - (a[choice.key] || 0));

        return (
          <div key={choice.key} className={styles.individualChartCard}>
            <h3 className={styles.chartTitle}>{choice.name} Distribution</h3>
            <div className={styles.chartContainer}>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart
                  data={sortedData}
                  margin={{ top: 20, right: 20, left: 20, bottom: 70 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name"
                    interval={0}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                    tick={{ fontSize: 12 }}
                    tickMargin={20}
                  />
                  <YAxis 
                    tickFormatter={value => Math.round(value)}
                    domain={[0, 'dataMax + 2']}
                    width={45}
                    label={{ 
                      value: 'Number of Students',
                      angle: -90,
                      position: 'insideLeft',
                      style: { textAnchor: 'middle' },
                      offset: 0
                    }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar 
                    dataKey={choice.key}
                    name={choice.name}
                    fill={choice.color}
                    radius={[4, 4, 0, 0]}
                    maxBarSize={50}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default IndividualBarCharts;