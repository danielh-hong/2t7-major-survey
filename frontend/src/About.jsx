import React, { useState } from 'react';
import styles from './About.module.css';

const About = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement form submission logic
    console.log('Form submitted:', formData);
  };

  return (
    <div className={styles.aboutContainer}>
      <div className={`${styles.section} ${styles.headerSection}`}>
        <h1 className={styles.mainTitle}>2T7 Engineering Sciences Voting Platform</h1>
        <p className={styles.subtitle}>Empowering Student Choices, Preserving Anonymity</p>
      </div>

      <div className={`${styles.section} ${styles.descriptionSection}`}>
        <div className={styles.descriptionContent}>
          <div className={styles.descriptionBlock}>
            <h2 className={styles.sectionTitle}>Our Mission</h2>
            <p>
              This platform was created to provide 2T7 Engineering Sciences students 
              with a transparent view of major preferences. By anonymously sharing your 
              choice, you help your peers make informed academic decisions.
            </p>
          </div>
          
          <div className={styles.descriptionBlock}>
            <h2 className={styles.sectionTitle}>Privacy Guarantee</h2>
            <p>
              This site is not not affiliated with the University 
              of Toronto and collects absolutely no personally identifiable information. 
              Your vote remains completely anonymous. The only information collected 
              is your choice of major; nothing else!
            </p>
          </div>
        </div>
      </div>

      <div className={`${styles.section} ${styles.contactSection}`}>
        <h2 className={styles.sectionTitle}>Contact Us</h2>
        <form className={styles.contactForm} onSubmit={handleSubmit}>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Your name"
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="your.email@example.com"
              />
            </div>
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              placeholder="Your message here..."
              rows="4"
            ></textarea>
          </div>
          
          <button type="submit" className={styles.submitButton}>
            Send Message
          </button>
        </form>

        <div className={styles.alternativeContact}>
          <p>
            Alternative Contact: {' '}
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a> | {' '}
            <a href="mailto:contact@example.com">Email</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;