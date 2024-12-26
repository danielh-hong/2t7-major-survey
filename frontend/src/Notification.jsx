import React, { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import styles from './Notification.module.css';

const Notification = ({ 
  message, 
  type = 'success', // 'success', 'error', 'info'
  duration = 5000,  // Duration in milliseconds
  onClose 
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      if (onClose) onClose();
    }, 300); // Match this with CSS animation duration
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className={styles.icon} />;
      case 'error':
        return <AlertCircle className={styles.icon} />;
      case 'info':
        return <Info className={styles.icon} />;
      default:
        return null;
    }
  };

  if (!isVisible) return null;

  return (
    <div 
      className={`
        ${styles.notificationContainer} 
        ${styles[type]} 
        ${isExiting ? styles.exit : styles.enter}
      `}
    >
      <div className={styles.iconContainer}>
        {getIcon()}
      </div>
      <p className={styles.message}>{message}</p>
      <button 
        onClick={handleClose}
        className={styles.closeButton}
        aria-label="Close notification"
      >
        <X size={18} />
      </button>
    </div>
  );
};

export default Notification;