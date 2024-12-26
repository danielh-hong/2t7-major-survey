import React, { useEffect, useState } from 'react';
import { TrendingUp, Users } from 'lucide-react';
import styles from './StatsSection.module.css';

const BASE_URL = import.meta.env.VITE_DEPLOYED_BACKEND_API_URL;

const StatsCard = ({ title, value, subtitle, icon: Icon }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`${styles.statsCard} ${isVisible ? styles.visible : ''}`}>
      <div className={styles.cardHeader}>
        <div className={styles.iconWrapper}>
          <Icon size={24} className={styles.icon} />
        </div>
        <h3 className={styles.title}>{title}</h3>
      </div>
      <div className={styles.valueWrapper}>
        <span className={styles.value}>{value.toLocaleString()}</span>
        {subtitle && (
          <span className={styles.subtitle}>{subtitle}</span>
        )}
      </div>
    </div>
  );
};

const StatsSection = () => {
  const [stats, setStats] = useState({
    totalResponses: 0,
    totalVisits: 0
  });

  useEffect(() => {
    const fetchAndInitialize = async () => {
      try {
        // Check if this browser has already visited
        const hasVisitedBefore = localStorage.getItem('hasVisited');
        
        if (!hasVisitedBefore) {
          // Log visit only if haven't visited before
          await fetch(`${BASE_URL}/api/survey/visit`, {
            method: 'POST'
          });
          localStorage.setItem('hasVisited', 'true');
        }

        // Fetch stats
        const response = await fetch(`${BASE_URL}/api/survey/stats`);
        const data = await response.json();
        setStats({
          totalResponses: data.totalResponses,
          totalVisits: data.totalVisits
        });
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchAndInitialize();

    // Set up polling for stats updates
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/survey/stats`);
        const data = await response.json();
        setStats({
          totalResponses: data.totalResponses,
          totalVisits: data.totalVisits
        });
      } catch (error) {
        console.error('Error refreshing stats:', error);
      }
    }, 300000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.statsWrapper}>
      <div className={styles.statsContainer}>
        <StatsCard
          title="Total Survey Responses"
          value={stats.totalResponses}
          subtitle="responses collected"
          icon={TrendingUp}
        />
        <StatsCard
          title="Total Site Visits"
          value={stats.totalVisits}
          subtitle="unique visitors"
          icon={Users}
        />
      </div>
    </div>
  );
};

export default StatsSection;