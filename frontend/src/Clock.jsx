// Clock.jsx
import React, { useState, useEffect } from 'react';
import { Info } from 'lucide-react';
import styles from './Clock.module.css';

const Clock = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const targetDate = new Date('2025-02-16T00:00:00');
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  const padNumber = (num) => String(num).padStart(2, '0');

  return (
    <div className={`${styles.clockContainer}`}>
      <div className={styles.infoSection}>
        <h2 className={styles.clockTitle}>Time Until Major Selection</h2>
        <div className={styles.tooltipContainer}>
          <Info className={styles.infoIcon} size={18} />
          <div className={`${styles.tooltip} glass`}>
            Approximate countdown to major selection period (Feb 14-18, 2024). 
            Official dates to be confirmed by the Division.
          </div>
        </div>
      </div>
      
      <div className={styles.clockGrid}>
        {[
          { label: 'Days', value: timeLeft.days },
          { label: 'Hours', value: timeLeft.hours },
          { label: 'Minutes', value: timeLeft.minutes },
          { label: 'Seconds', value: timeLeft.seconds }
        ].map((item, index) => (
          <React.Fragment key={item.label}>
            <div className={styles.timeBlock}>
              <div className={`${styles.numberBox} glass`}>
                <span className={styles.number}>{padNumber(item.value)}</span>
              </div>
              <span className={styles.label}>{item.label}</span>
            </div>
            {index < 3 && <div className={styles.separator}>:</div>}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default Clock;