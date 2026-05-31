import React from 'react';
import './ActivityTimeline.css';

const activities = [];

const ActivityTimeline = () => {
  return (
    <div className="card timeline-card animate-fade-in delay-500">
      <h2 className="text-secondary text-sm timeline-label">RECENT PROGRESS</h2>
      
      <div className="timeline-container">
        {activities.length === 0 ? (
          <div className="text-tertiary text-sm" style={{ padding: '16px 0' }}>No recent activity. Start your journey today!</div>
        ) : (
          activities.map((activity, index) => (
            <div key={index} className="timeline-item">
              <div className="timeline-dot"></div>
              {index < activities.length - 1 && <div className="timeline-line"></div>}
              
              <div className="timeline-content">
                <span className="timeline-day text-secondary text-sm">Day {activity.day}</span>
                <span className="timeline-arrow text-tertiary">→</span>
                <span className="timeline-title">{activity.title}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ActivityTimeline;
