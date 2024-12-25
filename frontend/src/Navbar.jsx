// src/Navbar.jsx

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MdHowToVote, MdPoll, MdInfo } from 'react-icons/md'; // Import MdInfo icon
import { FiGithub } from 'react-icons/fi';
import styles from './Navbar.module.css';

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <div className={styles.navContent}>
          <div className={styles.linksContainer}>
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

            <Link
              to="/about"
              className={`${styles.link} ${location.pathname === '/about' ? styles.activeLink : ''}`}
            >
              <MdInfo className={styles.icon} />
              About
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
