import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { GripVertical, Trophy, Medal, Check } from 'lucide-react';
import Confetti from './Confetti';
import Clock from './Clock';
import Notification from '../Notification';
import styles from './Vote.module.css';

const MAJORS = [
  'Aerospace',
  'Biomedical Systems',
  'Electrical & Computer',
  'Energy Systems',
  'Machine Intelligence',
  'Mathematics, Statistics & Finance',
  'Engineering Physics',
  'Robotics'
];

// DraggableItem component remains the same...
const DraggableItem = ({ id, index, text, moveItem }) => {
  const [{ isDragging }, drag, dragPreview] = useDrag({
    type: 'major',
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  });

  const [, drop] = useDrop({
    accept: 'major',
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        moveItem(draggedItem.index, index);
        draggedItem.index = index;
      }
    }
  });

  const getRankingElement = (index) => {
    if (index === 0) return <div className={styles.rankBadgeGold}><Trophy className={styles.rankIcon} /></div>;
    if (index === 1) return <div className={styles.rankBadgeSilver}><Medal className={styles.rankIcon} /></div>;
    if (index === 2) return <div className={styles.rankBadgeBronze}><Medal className={styles.rankIcon} /></div>;
    return <div className={styles.rankBadgeDefault}>{index + 1}</div>;
  };

  return (
    <div ref={dragPreview} style={{ opacity: isDragging ? 0.5 : 1 }}>
      <div ref={(node) => drag(drop(node))} className={`${styles.majorItem} ${isDragging ? styles.dragging : ''}`}>
        {getRankingElement(index)}
        <span className={styles.majorName}>{text}</span>
        <GripVertical className={styles.dragIcon} />
      </div>
    </div>
  );
};

const Vote = ({ onSuccessfulVote }) => {
  const navigate = useNavigate();
  const [majors, setMajors] = useState(MAJORS);
  const [hasDecided, setHasDecided] = useState(null);
  const [confirmedMajor, setConfirmedMajor] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [notification, setNotification] = useState({
    isVisible: false,
    message: '',
    type: 'success'
  });

  const BASE_URL = import.meta.env.VITE_DEPLOYED_BACKEND_API_URL;

  const moveItem = (fromIndex, toIndex) => {
    const updatedMajors = [...majors];
    const [movedItem] = updatedMajors.splice(fromIndex, 1);
    updatedMajors.splice(toIndex, 0, movedItem);
    setMajors(updatedMajors);
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;

    if (localStorage.getItem('has_voted')) {
      setNotification({
        isVisible: true,
        message: 'You have already submitted your vote. Only one vote per person is allowed.',
        type: 'error'
      });
      return;
    }

    // Validate form data
    if (!hasDecided || (hasDecided === 'no' && majors.length < 3) || (hasDecided === 'yes' && !confirmedMajor)) {
      setNotification({
        isVisible: true,
        message: 'Please complete all required fields before submitting.',
        type: 'error'
      });
      return;
    }

    const data = {
      hasDecided: hasDecided === 'yes',
      preferences: {
        firstChoice: majors[0],
        secondChoice: majors[1],
        thirdChoice: majors[2]
      },
      name: name.trim() || undefined // Only include name if it's not empty
    };

    if (hasDecided === 'yes') {
      data.confirmedMajor = confirmedMajor;
      
      if (confirmedMajor !== majors[0]) {
        setNotification({
          isVisible: true,
          message: 'Your confirmed major must match your first choice! Please drag your confirmed major to the top.',
          type: 'error'
        });
        return;
      }
    }

    try {
      setIsSubmitting(true);
      const response = await fetch(`${BASE_URL}/api/survey/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
    
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit survey');
      }

      localStorage.setItem('has_voted', 'true');
      if (onSuccessfulVote) {
        onSuccessfulVote();
      }

      setNotification({
        isVisible: true,
        message: 'Survey submitted successfully!',
        type: 'success'
      });
      setShowConfetti(true);
      
      setTimeout(() => {
        setShowConfetti(false);
        navigate('/results');
      }, 3500);
    } catch (error) {
      setIsSubmitting(false);
      setNotification({
        isVisible: true,
        message: `Error: ${error.message}`,
        type: 'error'
      });
    }
  };

  const handleNotificationClose = () => {
    setNotification({
      ...notification,
      isVisible: false
    });
  };

  return (
    <div className={styles.container}>
      {notification.isVisible && (
        <Notification
          message={notification.message}
          type={notification.type}
          duration={5000}
          onClose={handleNotificationClose}
        />
      )}
  
      {showConfetti && (
        <div className={styles.confettiOverlay}>
          <Confetti active={showConfetti} duration={3500} />
        </div>
      )}
      
      <div className={styles.content}>
        <h1 className={styles.title}>2T7 EngSci Major Selection Survey</h1>
        <Clock />
        <div className={styles.card}>

          <div className={styles.nameField}>
            <h2 className={styles.nameLabel}>Your Name (Optional)</h2>
            <p className={styles.nameDescription}>
              Share your name if you'd like to be identified in the results.
            </p>
            <input
              type="text"
              className={styles.nameInput}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              maxLength={100}
            />
          </div>

          <div>
            <h2 className={styles.dragTitle}>Rank Your Preferences</h2>
            <p className={styles.dragSubtitle}>
              Drag and rank the majors in your order of preference. Your top 3 choices will be recorded. (Press and hold to drag on mobile).
            </p>
            
            <div className={styles.dragArea}>
              <DndProvider backend={HTML5Backend}>
                <div>
                  {majors.map((major, index) => (
                    <DraggableItem
                      key={major}
                      id={major}
                      index={index}
                      text={major}
                      moveItem={moveItem}
                    />
                  ))}
                </div>
              </DndProvider>
            </div>
          </div>
  
          <div className={styles.decisionSection}>
            <h2 className={styles.decisionTitle}>Have you decided on your major?</h2>
            
            <div className={styles.decisionGroup}>
              <label className={`${styles.radioCard} ${hasDecided === 'yes' ? styles.selected : ''}`}>
                <input
                  type="radio"
                  className={styles.radioInput}
                  name="decided"
                  value="yes"
                  checked={hasDecided === 'yes'}
                  onChange={() => setHasDecided('yes')}
                />
                <Check className={hasDecided === 'yes' ? 'text-primary-500' : 'text-neutral-300'} />
                <span className={styles.radioLabel}>Yes, I'm certain</span>
              </label>
  
              <label className={`${styles.radioCard} ${hasDecided === 'no' ? styles.selected : ''}`}>
                <input
                  type="radio"
                  className={styles.radioInput}
                  name="decided"
                  value="no"
                  checked={hasDecided === 'no'}
                  onChange={() => setHasDecided('no')}
                />
                <span className={styles.radioLabel}>No, still deciding</span>
              </label>
            </div>
  
            {hasDecided === 'yes' && (
              <div className={styles.fadeIn}>
                <h3 className={styles.decisionTitle}>Select Your Confirmed Major</h3>
                <div className={styles.majorGrid}>
                  {majors.map((major) => (
                    <button
                      key={major}
                      onClick={() => setConfirmedMajor(major)}
                      className={`${styles.majorOption} ${confirmedMajor === major ? styles.selected : ''}`}
                    >
                      <span className={styles.majorOptionText}>{major}</span>
                      {confirmedMajor === major && <Check className="text-primary-500" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
  
            <button 
              className={`${styles.submitButton} ${isSubmitting ? styles.submitting : ''}`}
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className={styles.loadingSpinner}>
                  <svg className={styles.spinner} viewBox="0 0 50 50">
                    <circle className={styles.spinnerCircle} cx="25" cy="25" r="20" />
                  </svg>
                  Submitting...
                </span>
              ) : 'Submit Survey'}
            </button>          
          </div>
        </div>
      </div>
    </div>
  );
};

export default Vote;