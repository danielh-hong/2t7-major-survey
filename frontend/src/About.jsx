import React, { useState } from 'react';
import styles from './About.module.css';
import Notification from './Notification';

const About = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState({
    submitting: false,
    submitted: false,
    error: null
  });
  const [errors, setErrors] = useState({});
  const [notification, setNotification] = useState(null);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters long';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      setNotification({
        type: 'error',
        message: 'Please fill out all required fields correctly',
        duration: 5000
      });
      return;
    }

    setStatus({ submitting: true, submitted: false, error: null });

    try {
      const response = await fetch('https://formspree.io/f/mkggozve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus({ submitting: false, submitted: true, error: null });
        setFormData({ name: '', email: '', message: '' });
        setNotification({
          type: 'success',
          message: 'Thank you for your message! We\'ll get back to you soon.',
          duration: 5000
        });
      } else {
        throw new Error('Failed to submit form');
      }
    } catch (error) {
      setStatus({ 
        submitting: false, 
        submitted: false, 
        error: 'Failed to submit form. Please try again.' 
      });
      setNotification({
        type: 'error',
        message: 'Failed to submit form. Please try again.',
        duration: 5000
      });
    }
  };

  const handleNotificationClose = () => {
    setNotification(null);
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
              choice, you help your peers make informed academic decisions. All information
              is publicly available and updated in real-time. Also, all that is asked is that you only vote once!
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
            disabled={status.submitting}
          >
            {status.submitting ? 'Sending...' : 'Send Message'}
          </button>
        </form>

      </div>

      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          duration={notification.duration}
          onClose={handleNotificationClose}
        />
      )}
    </div>
  );
};

export default About;