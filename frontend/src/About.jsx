// src/About.jsx

import React from 'react';
import styles from './About.module.css';

const About = () => {
  return (
    <div className={styles.aboutContainer}>
      <header className={styles.header}>
        <h1>About Our Voting Platform</h1>
      </header>

      <section className={styles.description}>
        <p>
          Welcome to our voting platform, specifically designed for 2T7 Engineering Sciences students to gauge the majors their peers are choosing. This tool provides valuable insights into the popularity of various majors, helping students make informed decisions about their academic paths.
        </p>
        <p>
          <strong>Privacy is Our Priority:</strong> Your participation is completely anonymous. We are not affiliated with the University of Toronto, and we do not collect any information beyond the data you directly provide through your votes.
        </p>
        <p>
          <strong>Please:</strong> Do not abuse this platform and consider sharing it with other Engineering Sciences students you know.
        </p>
      </section>

      <section className={styles.contact}>
        <h2>Contact Me</h2>
        <form
          action="https://formspree.io/f/yourFormId" // Replace with your Formspree form ID
          method="POST"
          className={styles.contactForm}
        >
          <div className={styles.formGroup}>
            <label htmlFor="name">Name</label>
            <input type="text" id="name" name="name" required />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="_replyto" required />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="message">Message</label>
            <textarea id="message" name="message" rows="5" required></textarea>
          </div>

          <button type="submit" className={styles.submitButton}>
            Send Message
          </button>
        </form>
        <p className={styles.alternativeContact}>
          Alternatively, you can reach out via{' '}
          <a href="https://instagram.com/yourusername" target="_blank" rel="noopener noreferrer">
            Instagram
          </a>{' '}
          or{' '}
          <a href="mailto:youremail@example.com">
            Email
          </a>.
        </p>
      </section>
    </div>
  );
};

export default About;
