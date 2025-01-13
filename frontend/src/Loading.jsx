// Loading.jsx
import React, { useState, useEffect } from 'react';
import styles from './Loading.module.css';

const Loading = () => {
  const messages = [
    "Hi! 👋",
    "Please wait while we wake up our servers...",
    "This might take a minute since we're using a free service",
    "The backend goes to sleep when inactive to save resources",
    "Almost there! Thanks for your patience",
  ];

  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % messages.length);
    }, 1500);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className={styles.loadingContainer}>
      <div className={styles.loadingContent}>
        <div className={styles.dotContainer}>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={styles.dot}
              style={{ animationDelay: `${i * 150}ms` }}
            />
          ))}
        </div>
        <div className={styles.messageContainer}>
          <p className={styles.loadingText}>
            {messages[currentMessageIndex]}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Loading;