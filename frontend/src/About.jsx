import React, { useState } from 'react';
import styles from './About.module.css';
import { useForm } from '@formspree/react';

const About = () => {
  const [state, handleSubmit] = useForm(process.env.REACT_APP_FORMSPREE_ID);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters long';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Message validation
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.length < 10) {
      newErrors.message = 'Message must be at least 10 characters long';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      await handleSubmit(e);
      if (state.succeeded) {
        setFormData({
          name: '',
          email: '',
          message: ''
        });
      }
    }
  };

  return (
    <div className={styles.aboutContainer}>
      <div className={`${styles.section} ${styles.headerSection}`}>
        <h1 className={styles.mainTitle}>2T7 Engineering Sciences Major Survey</h1>
        <p className={styles.subtitle}>A Completely Anonymous Survey Made by a Fellow 2t7</p>
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
              This site is not affiliated with the University 
              of Toronto and collects absolutely no personally identifiable information. 
              Your vote remains completely anonymous. The only information collected 
              is your choice of major; nothing else!
            </p>
          </div>
        </div>
      </div>

      <div className={`${styles.section} ${styles.contactSection}`}>
        <h2 className={styles.sectionTitle}>Contact Us</h2>
        {state.succeeded ? (
          <div className={styles.successMessage}>
            Thank you for your message! We'll get back to you soon.
          </div>
        ) : (
          <form className={styles.contactForm} onSubmit={onSubmit}>
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
                  className={errors.name ? styles.errorInput : ''}
                />
                {errors.name && <span className={styles.errorMessage}>{errors.name}</span>}
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
                  className={errors.email ? styles.errorInput : ''}
                />
                {errors.email && <span className={styles.errorMessage}>{errors.email}</span>}
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
                className={errors.message ? styles.errorInput : ''}
              ></textarea>
              {errors.message && <span className={styles.errorMessage}>{errors.message}</span>}
            </div>
            
            <button 
              type="submit" 
              className={styles.submitButton}
              disabled={state.submitting}
            >
              {state.submitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        )}

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