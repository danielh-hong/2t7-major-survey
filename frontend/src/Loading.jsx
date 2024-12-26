import React from 'react';
import styles from './Loading.module.css';

const Loading = () => {
  return (
    <div className={styles.loadingContainer}>
      <div className={styles.loadingContent}>
        <div className={styles.dotContainer}>
          <div className={styles.dot} style={{ animationDelay: '0ms' }} />
          <div className={styles.dot} style={{ animationDelay: '150ms' }} />
          <div className={styles.dot} style={{ animationDelay: '300ms' }} />
        </div>
        <p className={styles.loadingText}>
          Loading results...
        </p>
      </div>
    </div>
  );
};

export default Loading;