import React, { useState, useEffect, useCallback, useRef } from 'react';
import styles from './AnimatedBackground.module.css';

const AnimatedBackground = () => {
  const [clouds, setClouds] = useState([]);
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });
  
  // Use refs to store the last timestamp and dimensions for animation
  const lastTimeRef = useRef(0);
  const baseWidth = useRef(1920); // Reference width for speed normalization

  const generateClouds = useCallback(() => {
    const numClouds = Math.floor(Math.random() * 3) + 4;
    
    return Array.from({ length: numClouds }, (_, i) => ({
      id: i,
      x: Math.random() * dimensions.width,
      y: Math.random() * (dimensions.height - 100),
      scale: Math.random() * 0.6 + 0.4,
      // Base speed in pixels per second (at reference width)
      baseSpeed: (Math.random() * 30 + 20)
    }));
  }, [dimensions]);

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    setClouds(generateClouds());
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [generateClouds]);

  // Update cloud positions using time-based animation
  useEffect(() => {
    const animateClouds = (timestamp) => {
      if (!lastTimeRef.current) {
        lastTimeRef.current = timestamp;
      }

      // Calculate time elapsed since last frame in seconds
      const deltaTime = (timestamp - lastTimeRef.current) / 1000;
      lastTimeRef.current = timestamp;

      setClouds(prevClouds => 
        prevClouds.map(cloud => {
          // Scale speed based on screen width ratio
          const speedScale = dimensions.width / baseWidth.current;
          const adjustedSpeed = cloud.baseSpeed * speedScale;
          
          // Calculate distance to move this frame
          const distance = adjustedSpeed * deltaTime;
          let newX = cloud.x + distance;

          if (newX > dimensions.width + 200) {
            newX = -200;
            return {
              ...cloud,
              x: newX,
              y: Math.random() * (dimensions.height - 100),
              scale: Math.random() * 0.6 + 0.4,
              baseSpeed: (Math.random() * 30 + 20)
            };
          }
          return { ...cloud, x: newX };
        })
      );
      requestAnimationFrame(animateClouds);
    };
    
    const animationId = requestAnimationFrame(animateClouds);
    return () => cancelAnimationFrame(animationId);
  }, [dimensions]);

  return (
    <div className={styles.background}>
      {/* Sun */}
      <div className={styles.sunContainer}>
        <div className={styles.sun}></div>
        <div className={styles.sunGlow}></div>
      </div>

      {/* Clouds */}
      {clouds.map((cloud) => (
        <div
          key={cloud.id}
          className={styles.cloudContainer}
          style={{
            transform: `translate(${cloud.x}px, ${cloud.y}px) scale(${cloud.scale})`,
          }}
        >
          <div className={styles.cloud}>
            <div className={`${styles.cloudPart} ${styles.cloudPartMain}`}></div>
            <div className={`${styles.cloudPart} ${styles.cloudPartLeft}`}></div>
            <div className={`${styles.cloudPart} ${styles.cloudPartRight}`}></div>
          </div>
        </div>
      ))}

      {/* Credit Text */}
      <div className={styles.creditText}>
        Made by a Fellow 2t7 😊
      </div>
    </div>
  );
};

export default AnimatedBackground;
