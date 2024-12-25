import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { MdDragIndicator, MdPoll, MdHowToVote } from 'react-icons/md';
import { Tab } from '@headlessui/react';
import Results from './Results';
import styles from './Vote.module.css';

const MAJORS = [
  'Aerospace',
  'Biomedical Systems',
  'Electrical & Computer',
  'Energy Systems',
  'Machine Intelligence',
  'Mathematics, Statistics & Finance',
  'Physics',
  'Robotics'
];

const Vote = () => {
  const [majors, setMajors] = useState(MAJORS);
  const [hasDecided, setHasDecided] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('vote');
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    if (isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      const response = await fetch('http://localhost:5000/api/survey/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          hasDecided: hasDecided === 'yes',
          confirmedMajor: hasDecided === 'yes' ? majors[0] : null,
          preferences: {
            firstChoice: majors[0],
            secondChoice: majors[1],
            thirdChoice: majors[2]
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to submit survey');
      }

      setActiveTab('results');
      
    } catch (error) {
      setError('Failed to submit survey. Please try again.');
      console.error('Error submitting survey:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isValid = hasDecided !== null && 
    majors.length === MAJORS.length && 
    (hasDecided === 'no' || (hasDecided === 'yes' && majors[0]));

  return (
    <div className={styles.container}>
      <motion.div className={styles.content}>
        <motion.h1 className={styles.title}>
          2T7 EngSci Major Selection Survey
        </motion.h1>

        <Tab.Group selectedIndex={activeTab === 'vote' ? 0 : 1} onChange={(index) => setActiveTab(index === 0 ? 'vote' : 'results')}>
          <Tab.List className={styles.tabList}>
            <Tab className={({ selected }) => `${styles.tab} ${selected ? styles.tabSelected : ''}`}>
              <MdHowToVote className={styles.tabIcon} />
              Vote
            </Tab>
            <Tab className={({ selected }) => `${styles.tab} ${selected ? styles.tabSelected : ''}`}>
              <MdPoll className={styles.tabIcon} />
              Results
            </Tab>
          </Tab.List>

          <Tab.Panels className={styles.tabPanels}>
            <Tab.Panel>
              <motion.div className={styles.card}>
                <div className={styles.dragArea}>
                  <h2 className={styles.dragTitle}>Rank Your Preferences</h2>
                  <p className={styles.dragSubtitle}>
                    Drag and rank the majors in your order of preference. Your top 3 choices will be recorded.
                  </p>
                  <Reorder.Group 
                    axis="y" 
                    values={majors} 
                    onReorder={setMajors}
                    className={styles.reorderGroup}
                  >
                    {majors.map((major, index) => (
                      <Reorder.Item
                        key={major}
                        value={major}
                        className={styles.majorItem}
                        whileDrag={{
                          scale: 1.02,
                          boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
                        }}
                      >
                        <div className={styles.majorNumber}>{index + 1}</div>
                        <span className={styles.majorName}>{major}</span>
                        <MdDragIndicator className={styles.dragIcon} />
                      </Reorder.Item>
                    ))}
                  </Reorder.Group>
                </div>

                <div className={styles.decisionSection}>
                  <h2 className={styles.decisionTitle}>Have you decided on your major?</h2>
                  <div className={styles.decisionGroup}>
                    <label className={styles.radioLabel}>
                      <input
                        type="radio"
                        className={styles.radioInput}
                        name="decided"
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
                        checked={hasDecided === 'no'}
                        onChange={() => setHasDecided('no')}
                      />
                      <span>No, still deciding</span>
                    </label>
                  </div>

                  {error && (
                    <div className={styles.error}>
                      {error}
                    </div>
                  )}

                  <button 
                    className={styles.submitButton}
                    onClick={handleSubmit}
                    disabled={!isValid || isSubmitting}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Survey'}
                  </button>
                </div>
              </motion.div>
            </Tab.Panel>

            <Tab.Panel>
              <Results />
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </motion.div>
    </div>
  );
};

export default Vote;