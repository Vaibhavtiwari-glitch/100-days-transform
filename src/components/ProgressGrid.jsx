import React, { useState } from 'react';
import './ProgressGrid.css';

const ProgressGrid = ({ calendarHistory = {}, activeDay }) => {
  const [hoveredDay, setHoveredDay] = useState(null);
  
  const days = Array.from({ length: 100 }, (_, i) => {
    const dayNum = i + 1;
    const ratio = calendarHistory[dayNum];
    
    let status = 'empty';
    if (ratio === 1) status = 'full';
    else if (ratio >= 0.75) status = 'high';
    else if (ratio >= 0.5) status = 'medium';
    else if (ratio > 0) status = 'low';
    else if (activeDay === dayNum) status = 'active';
    
    return {
      day: dayNum,
      status,
      percent: ratio !== undefined ? Math.round(ratio * 100) : 0,
      tasks: ratio !== undefined ? "Logged" : "None"
    };
  });

  return (
    <div className="card grid-card animate-fade-in delay-400">
      <div className="flex-between">
        <h2 className="text-secondary text-sm grid-label">100-DAY PROGRESS</h2>
        <div className="legend">
          <span className="legend-item"><div className="legend-box empty"></div> Pending</span>
          <span className="legend-item"><div className="legend-box active"></div> Active</span>
          <span className="legend-item" style={{gap: '2px'}}>
            <div className="legend-box low"></div>
            <div className="legend-box medium"></div>
            <div className="legend-box high"></div>
            <div className="legend-box full"></div> Complete
          </span>
        </div>
      </div>
      
      <div className="grid-container">
        {days.map((day) => (
          <div 
            key={day.day} 
            className={`grid-square ${day.status}`}
            onMouseEnter={() => setHoveredDay(day)}
            onMouseLeave={() => setHoveredDay(null)}
          >
            {hoveredDay?.day === day.day && (
              <div className="grid-tooltip">
                <div className="tooltip-day">Day {day.day}</div>
                <div className="tooltip-stat">Completion: <span className={day.percent > 0 ? 'text-accent' : ''}>{day.percent}%</span></div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressGrid;
