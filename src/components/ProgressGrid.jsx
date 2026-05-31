import React, { useState } from 'react';
import './ProgressGrid.css';

const ProgressGrid = ({ completedDays, activeDay }) => {
  const [hoveredDay, setHoveredDay] = useState(null);
  
  const days = Array.from({ length: 100 }, (_, i) => {
    const dayNum = i + 1;
    let status = 'empty';
    if (completedDays.includes(dayNum)) {
      status = 'full';
    } else if (activeDay === dayNum) {
      status = 'partial';
    }
    
    return {
      day: dayNum,
      status,
      percent: completedDays.includes(dayNum) ? 100 : 0,
      tasks: completedDays.includes(dayNum) ? 1 : 0
    };
  });

  return (
    <div className="card grid-card animate-fade-in delay-400">
      <div className="flex-between">
        <h2 className="text-secondary text-sm grid-label">100-DAY PROGRESS</h2>
        <div className="legend">
          <span className="legend-item"><div className="legend-box empty"></div> Pending</span>
          <span className="legend-item"><div className="legend-box partial"></div> Active</span>
          <span className="legend-item"><div className="legend-box full"></div> Complete</span>
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
                <div className="tooltip-stat">Tasks: {day.tasks}</div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressGrid;
