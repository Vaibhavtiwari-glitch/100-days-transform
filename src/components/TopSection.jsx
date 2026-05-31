import React from 'react';
import './TopSection.css';

const TopSection = ({ goal, streak, day, percent }) => {
  return (
    <div className="top-section animate-fade-in delay-100">
      <div className="flex-between header-top">
        <div className="streak-badge">
          🔥 <span className="streak-count">{streak} Day Streak</span>
        </div>
        <div className="day-counter text-secondary">
          Day <span className="text-primary">{day}</span> / 100
        </div>
      </div>
      
      <div className="goal-container">
        <h2 className="text-secondary text-sm">CURRENT GOAL</h2>
        <h1 className="goal-title">{goal}</h1>
      </div>
      
      <div className="progress-container">
        <div className="progress-bar-bg">
          <div className="progress-bar-fill" style={{ width: `${percent}%` }}></div>
        </div>
      </div>
    </div>
  );
};

export default TopSection;
