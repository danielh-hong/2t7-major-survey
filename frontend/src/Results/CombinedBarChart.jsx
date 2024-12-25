// CombinedBarChart.jsx
import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import styles from './CombinedBarChart.module.css';

const CombinedBarChart = ({ data }) => {
  return (
    <div className={styles.chartWrapper}>
      <h2 className={styles.chartTitle}>Combined Major Choices</h2>
      <ResponsiveContainer width="100%" height={500}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 20, right: 40, left: 150, bottom: 50 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis dataKey="name" type="category" />
          <Tooltip />
          <Legend />
          <Bar dataKey="first" name="First Choice" fill="#4CAF50" />
          <Bar dataKey="second" name="Second Choice" fill="#2196F3" />
          <Bar dataKey="third" name="Third Choice" fill="#FFC107" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CombinedBarChart;
