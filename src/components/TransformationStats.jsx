import React from 'react';
import './TransformationStats.css';

const TransformationStats = ({ level, levelProgress, percent }) => {
  const progressPercent = (levelProgress / 7) * 100;

  return (
    <div className="card stats-card animate-fade-in delay-300">
      <h2 className="text-secondary text-sm stats-label">TRANSFORMATION STATS</h2>
      
      <div className="stats-grid">
        <div className="stat-item">
          <div className="stat-value">Level {level}</div>
          <div className="stat-name text-tertiary">Current Level</div>
        </div>
        
        <div className="stat-item tooltip-container">
          <div className="stat-value">{levelProgress} <span className="text-sm text-tertiary">/ 7 Days</span></div>
          <div className="stat-name text-tertiary">Next Level Progress</div>
          <div className="mini-progress-bg">
            <div className="mini-progress-fill" style={{ width: `${progressPercent}%` }}></div>
          </div>
          
          <div className="custom-tooltip">
            to reach level {level + 1} you need to complete all your daily task for 7 days straight
          </div>
        </div>
        
        <div className="stat-item full-width">
          <div className="flex-between">
            <div className="stat-name text-tertiary">Completion</div>
            <div className="stat-value text-accent">{percent}%</div>
          </div>
          <div className="mini-progress-bg">
            <div className="mini-progress-fill" style={{ width: `${percent}%` }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransformationStats;
