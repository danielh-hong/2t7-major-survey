import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { GripVertical, Trophy, Medal, Check } from 'lucide-react';
import Confetti from './Confetti';
import Clock from './Clock';
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
    if (index === 0) {
      return (
        <div className={styles.rankBadgeGold}>
          <Trophy className={styles.rankIcon} />
        </div>
      );
    } else if (index === 1) {
      return (
        <div className={styles.rankBadgeSilver}>
          <Medal className={styles.rankIcon} />
        </div>
      );
    } else if (index === 2) {
      return (
        <div className={styles.rankBadgeBronze}>
          <Medal className={styles.rankIcon} />
        </div>
      );
    }
    return (
      <div className={styles.rankBadgeDefault}>
        {index + 1}
      </div>
    );
  };

  return (
    <div ref={dragPreview} style={{ opacity: isDragging ? 0.5 : 1 }}>
      <div
        ref={(node) => drag(drop(node))}
        className={`${styles.majorItem} ${isDragging ? styles.dragging : ''}`}
      >
        {getRankingElement(index)}
        <span className={styles.majorName}>{text}</span>
        <GripVertical className={styles.dragIcon} />
      </div>
    </div>
  );
};

const Vote = () => {
  const navigate = useNavigate();
  const [majors, setMajors] = useState(MAJORS);
  const [hasDecided, setHasDecided] = useState(null);
  const [confirmedMajor, setConfirmedMajor] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [error, setError] = useState(null);

  const moveItem = (fromIndex, toIndex) => {
    const updatedMajors = [...majors];
    const [movedItem] = updatedMajors.splice(fromIndex, 1);
    updatedMajors.splice(toIndex, 0, movedItem);
    setMajors(updatedMajors);
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;

    const data = {
      hasDecided: hasDecided === 'yes',
      preferences: {
        firstChoice: majors[0],
        secondChoice: majors[1],
        thirdChoice: majors[2]
      }
    };

    if (hasDecided === 'yes') {
      data.confirmedMajor = confirmedMajor;
    }

    try {
      setIsSubmitting(true);
      const response = await fetch('http://localhost:5000/api/survey/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit survey');
      }

      setShowConfetti(true);
      setTimeout(() => {
        setShowConfetti(false);
        navigate('/results');
      }, 3500);
    } catch (error) {
      setError(error.message);
      setIsSubmitting(false);
    }
  };

  const isValid = hasDecided !== null && 
    ((hasDecided === 'no' && majors.length >= 3) ||
     (hasDecided === 'yes' && confirmedMajor));

  return (
    <div className={styles.container}>
      {showConfetti && (
        <div className={styles.confettiOverlay}>
          <Confetti active={showConfetti} duration={3500} />
        </div>
      )}
      
      <div className={styles.content}>
        <h1 className={styles.title}>
          2T7 EngSci Major Selection Survey
        </h1>

        <Clock />

        <div className={styles.card}>
          <div className={styles.dragArea}>
            <h2 className={styles.dragTitle}>
              Rank Your Preferences
            </h2>
            <p className={styles.dragSubtitle}>
              Drag and rank the majors in your order of preference. Your top 3 choices will be recorded.
            </p>
            
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

          <div className={styles.decisionSection}>
            <h2 className={styles.decisionTitle}>
              Have you decided on your major?
            </h2>
            
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
                      className={`${styles.majorOption} ${
                        confirmedMajor === major ? styles.selected : ''
                      }`}
                    >
                      <span className={styles.majorOptionText}>{major}</span>
                      {confirmedMajor === major && (
                        <Check className="text-primary-500" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {error && (
              <div className={styles.error}>
                {error}
              </div>
            )}

            <button 
              className={`${styles.submitButton} ${isSubmitting ? styles.submitting : ''}`}
              onClick={handleSubmit}
              disabled={!isValid || isSubmitting}
            >
              {isSubmitting ? (
                <span className={styles.loadingSpinner}>
                  <svg className={styles.spinner} viewBox="0 0 24 24">
                    <circle className={styles.spinnerCircle} cx="12" cy="12" r="10" />
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