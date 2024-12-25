import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MdHowToVote, MdPoll } from 'react-icons/md';
import { FiGithub } from 'react-icons/fi';
import styles from './Navbar.module.css';

const Navbar = () => {
  const location = useLocation();
  
  return (
    <nav className={styles.navbar}>
      <div className={styles.horizontalLine}></div>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.linkGroup}>
            <Link
              to="/vote"
              className={`${styles.link} ${location.pathname === '/vote' ? styles.activeLink : ''}`}
            >
              <MdHowToVote className={styles.icon} />
              Vote
            </Link>
            <div className={styles.divider}></div>
            <Link
              to="/results"
              className={`${styles.link} ${location.pathname === '/results' ? styles.activeLink : ''}`}
            >
              <MdPoll className={styles.icon} />
              Results
            </Link>
          </div>
          <div className={styles.divider}></div>
          <a 
            href="https://github.com/danielh-hong/2t7-major-survey" 
            target="_blank" 
            rel="noopener noreferrer"
            className={styles.githubLink}
          >
            <FiGithub />
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;