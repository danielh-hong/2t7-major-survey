import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import styles from './Charts.module.css';

const CombinedBarChart = ({ data }) => {
  // Add logging to debug the data being received
  console.log('Raw data received:', data);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const total = payload.reduce((sum, entry) => sum + entry.value, 0);
      return (
        <div className={styles.customTooltip}>
          <p className={styles.tooltipLabel}>{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className={styles.tooltipData} style={{ color: entry.color }}>
              {entry.name}: {entry.value} ({((entry.value / total) * 100).toFixed(1)}%)
            </p>
          ))}
          <p className={styles.tooltipTotal}>Total: {total}</p>
        </div>
      );
    }
    return null;
  };

  // Sort the data by total preferences
  const sortedData = [...data].sort((a, b) => {
    const totalA = a.first + a.second + a.third;
    const totalB = b.first + b.second + b.third;
    return totalB - totalA;
  });

  return (
    <div className={styles.chartWrapper}>
      <h2 className={styles.chartTitle}>Major Preference Distribution</h2>
      <div className={styles.chartContainer}>
        <ResponsiveContainer width="100%" height={500}>
          <BarChart
            data={sortedData}
            margin={{ top: 35, right: 20, left: 20, bottom: 65 }}
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
            <Legend 
              align="center"
              verticalAlign="top"
              wrapperStyle={{
                paddingTop: '0px',
                marginTop: '-35px',
                marginBottom: '10px'
              }}
            />
            <Bar 
              dataKey="first" 
              name="First Choice" 
              fill="#4CAF50"
              radius={[4, 4, 0, 0]}
              maxBarSize={80}
            />
            <Bar 
              dataKey="second" 
              name="Second Choice" 
              fill="#2196F3"
              maxBarSize={80}
            />
            <Bar 
              dataKey="third" 
              name="Third Choice" 
              fill="#FFC107"
              maxBarSize={80}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CombinedBarChart;