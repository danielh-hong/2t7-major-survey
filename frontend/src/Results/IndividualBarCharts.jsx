// IndividualBarCharts.jsx
import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import styles from './IndividualBarCharts.module.css';

const COLORS = [
  '#4CAF50', '#2196F3', '#FFC107', 
  '#FF5722', '#9C27B0', '#00BCD4', 
  '#E91E63', '#FF9800'
];

const IndividualBarCharts = ({ data }) => {
  const choices = [
    { key: 'first', name: 'First Choice', color: '#4CAF50' },
    { key: 'second', name: 'Second Choice', color: '#2196F3' },
    { key: 'third', name: 'Third Choice', color: '#FFC107' },
  ];

  return (
    <div className={styles.chartsContainer}>
      {choices.map((choice) => (
        <div key={choice.key} className={styles.chartCard}>
          <h3 className={styles.chartTitle}>{choice.name} Distribution</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 100, bottom: 50 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                angle={-45} 
                textAnchor="end" 
                height={80} 
                tick={{ fontSize: 12 }}
              />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar 
                dataKey={choice.key} 
                fill={choice.color} 
                barSize={30}
                radius={[10, 10, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ))}
    </div>
  );
};

export default IndividualBarCharts;
