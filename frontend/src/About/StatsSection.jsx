import React, { useEffect, useState } from 'react';
import { TrendingUp, Users } from 'lucide-react';
import styles from './StatsSection.module.css';

const BASE_URL = import.meta.env.VITE_DEPLOYED_BACKEND_API_URL;

const LoadingValue = () => (
  <div className={styles.loadingContainer}>
    <div className={styles.loadingDot}></div>
    <div className={`${styles.loadingDot} ${styles.loadingDotDelay1}`}></div>
    <div className={`${styles.loadingDot} ${styles.loadingDotDelay2}`}></div>
  </div>
);

const StatsCard = ({ title, value, subtitle, icon: Icon, isLoading }) => {
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
        {isLoading ? (
          <LoadingValue />
        ) : (
          <>
            <span className={styles.value}>{value.toLocaleString()}</span>
            {subtitle && (
              <span className={styles.subtitle}>{subtitle}</span>
            )}
          </>
        )}
      </div>
    </div>
  );
};

const StatsSection = () => {
  const [stats, setStats] = useState({
    totalResponses: null,
    totalVisits: null
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAndInitialize = async () => {
      try {
        const hasVisitedBefore = localStorage.getItem('hasVisited');
        
        if (!hasVisitedBefore) {
          await fetch(`${BASE_URL}/api/survey/visit`, {
            method: 'POST'
          });
          localStorage.setItem('hasVisited', 'true');
        }

        const response = await fetch(`${BASE_URL}/api/survey/stats`);
        const data = await response.json();
        setStats({
          totalResponses: data.totalResponses,
          totalVisits: data.totalVisits
        });
        setIsLoading(false);
      } catch (error) {
        console.error('Error:', error);
        setIsLoading(false);
      }
    };

    fetchAndInitialize();

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
    }, 0.5*60*1000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.statsWrapper}>
      <div className={styles.statsContainer}>
        <StatsCard
          title="Total Survey Responses"
          value={stats.totalResponses || 0}
          subtitle="responses collected"
          icon={TrendingUp}
          isLoading={isLoading || stats.totalResponses === null}
        />
        <StatsCard
          title="Total Site Visits"
          value={stats.totalVisits || 0}
          subtitle="unique visitors"
          icon={Users}
          isLoading={isLoading || stats.totalVisits === null}
        />
      </div>
    </div>
  );
};

export default StatsSection;