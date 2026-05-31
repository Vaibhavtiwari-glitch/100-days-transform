import React, { useState } from 'react';
import './GoalSetting.css';

const GoalSetting = ({ onGoalSet }) => {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && inputValue.trim() !== '') {
      onGoalSet(inputValue.trim());
    }
  };

  return (
    <div className="goal-setting-container animate-fade-in">
      <div className="goal-setting-content">
        <h1 className="goal-question">What do you want to become in the next 100 days?</h1>
        <input 
          type="text" 
          className="goal-input" 
          placeholder="Type here..." 
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
        />
      </div>
    </div>
  );
};

export default GoalSetting;
