// PieCharts.jsx
import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import styles from './PieCharts.module.css';

const COLORS = [
  '#4CAF50', '#2196F3', '#FFC107', 
  '#FF5722', '#9C27B0', '#00BCD4', 
  '#E91E63', '#FF9800'
];

const PieCharts = ({ data }) => {
  const choices = ['first', 'second', 'third'];

  const formatData = (choiceType) => {
    return data.map((major) => ({
      name: major.name,
      value: major[choiceType] || 0
    }));
  };

  return (
    <div className={styles.chartsContainer}>
      {choices.map((choice, index) => (
        <div key={choice} className={styles.chartCard}>
          <h3 className={styles.chartTitle}>
            {choice.charAt(0).toUpperCase() + choice.slice(1)} Choice Distribution
          </h3>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={formatData(choice)}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={150}
                fill="#8884d8"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {formatData(choice).map((entry, idx) => (
                  <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      ))}
    </div>
  );
};

export default PieCharts;
