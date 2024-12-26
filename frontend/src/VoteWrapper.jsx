import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import Vote from './Vote';

const COOKIE_NAME = 'has_voted_2t7';
const COOKIE_EXPIRY_DAYS = 365; // Cookie will last for a year

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
  const [hasVoted, setHasVoted] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const voteCookie = getCookie(COOKIE_NAME);
    setHasVoted(voteCookie === 'true');
    setLoading(false);
  }, []);

  const handleSuccessfulVote = () => {
    setCookie(COOKIE_NAME, true, COOKIE_EXPIRY_DAYS);
    setHasVoted(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary-500"></div>
      </div>
    );
  }

  if (hasVoted) {
    return <Navigate to="/results" replace />;
  }

  return <Vote onSuccessfulVote={handleSuccessfulVote} />;
};

export default VoteWrapper;