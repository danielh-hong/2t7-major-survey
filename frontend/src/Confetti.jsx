import React, { useState, useEffect } from 'react';
import ReactConfetti from 'react-confetti';
import styles from './Confetti.module.css';

const Confetti = ({ active, duration = 3000 }) => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (active) {
      setIsRunning(true);
      const timer = setTimeout(() => {
        setIsRunning(false);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [active, duration]);

  if (!active && !isRunning) return null;

  return (
    <div className={styles.confettiContainer}>
      <ReactConfetti
        width={windowSize.width}
        height={windowSize.height}
        numberOfPieces={500}
        recycle={false}
        run={isRunning}
        colors={[
          '#FFD700', // Gold
          '#FF69B4', // Pink
          '#4169E1', // Royal Blue
          '#32CD32', // Lime Green
          '#FF4500', // Orange Red
          '#9370DB', // Medium Purple
          '#FF1493', // Deep Pink
          '#00CED1'  // Dark Turquoise
        ]}
        tweenDuration={duration}
        gravity={0.1}
        initialVelocityY={4}
        onConfettiComplete={() => setIsRunning(false)}
      />
    </div>
  );
};

export default Confetti;