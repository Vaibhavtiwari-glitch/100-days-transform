import React, { useState } from 'react';
import './MissionCard.css';

const MissionCard = ({ tasks = [], onAddTask, onCompleteTask, onCompleteDay }) => {
  const [inputValue, setInputValue] = useState('');
  const [showXP, setShowXP] = useState(false);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && inputValue.trim() !== '') {
      onAddTask(inputValue.trim());
      setInputValue('');
    }
  };

  const handleComplete = (taskId, isCompleted) => {
    if (isCompleted) return;
    onCompleteTask(taskId);
    setShowXP(true);
    setTimeout(() => {
      setShowXP(false);
    }, 2000);
  };

  return (
    <div className={`card mission-card animate-fade-in delay-200`}>
      <h2 className="text-secondary text-sm mission-label">TODAY'S MISSION</h2>
      
      <div className="task-list">
        {tasks.map(task => (
          <div key={task.id} className="active-task-container">
            <h3 className={`task-text ${task.completed ? 'strike' : ''}`}>{task.text}</h3>
            
            <div className={`checkbox-right ${task.completed ? 'checked' : ''}`} onClick={() => handleComplete(task.id, task.completed)}>
              {task.completed && (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              )}
            </div>
          </div>
        ))}
        
        <input 
          type="text" 
          className="mission-input" 
          placeholder={tasks.length === 0 ? "Enter your tasks for today..." : "+ Add another mission..."} 
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        
        {tasks.length > 0 && (
          <button className="complete-day-btn" onClick={onCompleteDay}>
            Complete Day
          </button>
        )}
      </div>

      {showXP && (
        <div className="xp-popup">
          +50 XP
        </div>
      )}
    </div>
  );
};

export default MissionCard;
