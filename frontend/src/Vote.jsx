// Vote.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { GripVertical, Trophy, Medal } from 'lucide-react';
import Confetti from './Confetti'; // Ensure this path is correct
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
  const [{ isDragging }, drag] = useDrag({
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

  // Enhanced ranking indicators for top 3
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

  const itemClass = `${styles.majorItem} ${isDragging ? styles.dragging : ''} ${
    index < 3 ? styles[`topThree${index + 1}`] : ''
  }`;

  return (
    <div ref={(node) => drag(drop(node))} className={itemClass}>
      {getRankingElement(index)}
      <span className={styles.majorName}>{text}</span>
      <GripVertical className={styles.dragIcon} />
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

    // Prepare data based on user decision
    const data = {
      hasDecided: hasDecided === 'yes',
      preferences: {
        firstChoice: majors[0],
        secondChoice: majors[1],
        thirdChoice: majors[2]
      }
    };

    // If decided, add confirmed major
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

      // Successful submission
      setShowConfetti(true);
      console.log('Survey submitted successfully');
      
      // Redirect to results after 6 seconds
      setTimeout(() => {
        setShowConfetti(false);
        navigate('/results');
      }, 3500); // Match the confetti duration
    } catch (error) {
      setError(error.message);
      setIsSubmitting(false);
    }
  };

  const isValid = hasDecided !== null && 
    (
      (hasDecided === 'no' && majors.length >= 3) ||
      (hasDecided === 'yes' && confirmedMajor)
    );

  return (
    <div className={styles.container}>
      <div className={styles.ConfettiOverlay}>
        {showConfetti && (
          <Confetti 
            active={showConfetti} 
            duration={3500}  // 6 seconds
          />
        )}
      </div>
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
              <div className={styles.reorderGroup}>
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
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  className={styles.radioInput}
                  name="decided"
                  value="yes"
                  checked={hasDecided === 'yes'}
                  onChange={() => setHasDecided('yes')}
                />
                <span>Yes, I'm certain</span>
              </label>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  className={styles.radioInput}
                  name="decided"
                  value="no"
                  checked={hasDecided === 'no'}
                  onChange={() => setHasDecided('no')}
                />
                <span>No, still deciding</span>
              </label>
            </div>

            {hasDecided === 'yes' && (
              <div className={styles.confirmedMajor}>
                <label htmlFor="confirmedMajor">Select Your Confirmed Major:</label>
                <select
                  id="confirmedMajor"
                  value={confirmedMajor}
                  onChange={(e) => setConfirmedMajor(e.target.value)}
                  className={styles.selectInput}
                >
                  <option value="">--Select Major--</option>
                  {majors.map((major) => (
                    <option key={major} value={major}>
                      {major}
                    </option>
                  ))}
                </select>
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
