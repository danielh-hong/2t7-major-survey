// src/App.jsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Vote from './Vote';
import Results from './Results';
import Navbar from './Navbar'; 
import './App.css'; 

const App = () => {
  return (
    <div className="app-content">
      <Router>
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Navigate to="/vote" replace />} />
            <Route path="/vote" element={<Vote />} />
            <Route path="/results" element={<Results />} />
            {/* Fallback route for undefined paths */}
            <Route path="*" element={<h1>404: Page Not Found</h1>} />
          </Routes>
        </main>
      </Router>
    </div>
  );
};

export default App;
