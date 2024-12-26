import React, { useEffect, useState } from 'react';
import Vote from './Vote';
import Notification from '../Notification';

const COOKIE_NAME = 'has_voted_2t7';
const COOKIE_EXPIRY_DAYS = 365;

const setCookie = (name, value, days) => {
  const date = new Date();
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
  const expires = `expires=${date.toUTCString()}`;
  document.cookie = `${name}=true;${expires};path=/`;
};

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};

const VoteWrapper = () => {
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({
    isVisible: false,
    message: '',
    type: 'error'
  });

  useEffect(() => {
    const voteCookie = getCookie(COOKIE_NAME);
    if (voteCookie === 'true') {
      setNotification({
        isVisible: true,
        message: 'You have already submitted your vote. Only one vote per person is allowed.',
        type: 'error'
      });
    }
    setLoading(false);
  }, []);

  const handleSuccessfulVote = () => {
    setCookie(COOKIE_NAME, true, COOKIE_EXPIRY_DAYS);
  };

  const handleNotificationClose = () => {
    setNotification({
      ...notification,
      isVisible: false
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary-500"></div>
      </div>
    );
  }

  return (
    <>
      {notification.isVisible && (
        <Notification
          message={notification.message}
          type={notification.type}
          duration={5000}
          onClose={handleNotificationClose}
        />
      )}
      <Vote onSuccessfulVote={handleSuccessfulVote} />
    </>
  );
};

export default VoteWrapper;