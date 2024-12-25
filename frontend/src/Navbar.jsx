import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MdHowToVote, MdPoll } from 'react-icons/md';
import styles from './Navbar.module.css';

const Navbar = () => {
  const location = useLocation();
  
  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <div className={styles.line}></div>
        <div className={styles.linkGroup}>
          <Link
            to="/vote"
            className={`${styles.link} ${location.pathname === '/vote' ? styles.activeLink : ''}`}
          >
            <MdHowToVote className={styles.icon} />
            Vote
          </Link>

          <Link
            to="/results"
            className={`${styles.link} ${location.pathname === '/results' ? styles.activeLink : ''}`}
          >
            <MdPoll className={styles.icon} />
            Results
          </Link>
        </div>
        <div className={styles.line}></div>
      </div>
    </nav>
  );
};

export default Navbar;
