import { useState, useEffect } from 'react'
import './index.css'
import GoalSetting from './components/GoalSetting'
import TopSection from './components/TopSection'
import MissionCard from './components/MissionCard'
import TransformationStats from './components/TransformationStats'
import ProgressGrid from './components/ProgressGrid'
import ActivityTimeline from './components/ActivityTimeline'
import ShareCard from './components/ShareCard'
import IntroAnimation from './components/IntroAnimation'

function App() {
  const [goal, setGoal] = useState(() => localStorage.getItem('userGoal') || '')
  const [hasChosenPath, setHasChosenPath] = useState(() => localStorage.getItem('hasChosenPath') === 'true');
  
  const [stats, setStats] = useState(() => {
    const saved = localStorage.getItem('userStats');
    return saved ? JSON.parse(saved) : {
      streak: 0,
      day: 1,
      xp: 0,
      level: 1,
      percent: 0,
      completedDays: [],
      partialDays: [],
      tasks: [],
    };
  });

  useEffect(() => {
    if (goal) {
      localStorage.setItem('userGoal', goal)
    }
  }, [goal])

  useEffect(() => {
    localStorage.setItem('userStats', JSON.stringify(stats))
  }, [stats])

  const handleAddTask = (taskName) => {
    setStats(prev => {
      try {
        const currentTasks = Array.isArray(prev.tasks) ? prev.tasks : [];
        const currentCompletedDays = Array.isArray(prev.completedDays) ? prev.completedDays : [];
        const currentPartialDays = Array.isArray(prev.partialDays) ? prev.partialDays : [];
        const currentDay = prev.day || 1;

        const newTask = { id: Date.now(), text: taskName, completed: false };
        const newTasks = [...currentTasks, newTask];
        
        const newCompletedDays = currentCompletedDays.filter(d => d !== currentDay);
        const newPartialDays = newTasks.some(t => t.completed) 
          ? (currentPartialDays.includes(currentDay) ? currentPartialDays : [...currentPartialDays, currentDay])
          : currentPartialDays;
          
        const previouslyFull = currentCompletedDays.includes(currentDay);
        let newStreak = prev.streak || 0;
        let newPercent = prev.percent || 0;
        let newLevel = prev.level || 1;
        let newLevelProgress = prev.levelProgress || 0;

        if (previouslyFull) {
          newStreak = Math.max(0, newStreak - 1);
          newPercent = Math.max(0, newPercent - 1);
          
          newLevelProgress -= 1;
          if (newLevelProgress < 0) {
            if (newLevel > 1) {
              newLevel -= 1;
              newLevelProgress = 6;
            } else {
              newLevelProgress = 0;
            }
          }
        }

        return {
          ...prev,
          tasks: newTasks,
          completedDays: newCompletedDays,
          partialDays: newPartialDays,
          streak: newStreak,
          percent: newPercent,
          level: newLevel,
          levelProgress: newLevelProgress
        };
      } catch (error) {
        console.error("Error adding task:", error);
        return prev;
      }
    });
  };

  const handleCompleteTask = (taskId) => {
    setStats(prev => {
      try {
        const currentTasks = Array.isArray(prev.tasks) ? prev.tasks : [];
        const currentCompletedDays = Array.isArray(prev.completedDays) ? prev.completedDays : [];
        const currentPartialDays = Array.isArray(prev.partialDays) ? prev.partialDays : [];
        const currentDay = prev.day || 1;

        const newTasks = currentTasks.map(t => t.id === taskId ? { ...t, completed: true } : t);
        
        const totalTasks = newTasks.length;
        const completedTasks = newTasks.filter(t => t.completed).length;
        
        const isPartial = totalTasks > 0 && completedTasks > 0 && completedTasks < totalTasks;
        const isFull = totalTasks > 0 && completedTasks === totalTasks;
        
        const previouslyFull = currentCompletedDays.includes(currentDay);
        let newStreak = prev.streak || 0;
        let newPercent = prev.percent || 0;
        let newLevel = prev.level || 1;
        let newLevelProgress = prev.levelProgress || 0;
        let newCompletedDays = [...currentCompletedDays];
        let newPartialDays = [...currentPartialDays];
        
        if (isPartial && !newPartialDays.includes(currentDay)) {
          newPartialDays.push(currentDay);
        }
        
        if (isFull && !previouslyFull) {
          newStreak += 1;
          newPercent = Math.min(100, newPercent + 1);
          newCompletedDays.push(currentDay);
          newPartialDays = newPartialDays.filter(d => d !== currentDay);
          
          newLevelProgress += 1;
          if (newLevelProgress >= 7) {
            newLevel += 1;
            newLevelProgress = 0;
          }
        }

        return {
          ...prev,
          tasks: newTasks,
          level: newLevel,
          levelProgress: newLevelProgress,
          streak: newStreak,
          percent: newPercent,
          completedDays: newCompletedDays,
          partialDays: newPartialDays,
        };
      } catch (error) {
        console.error("Error completing task:", error);
        return prev;
      }
    });
  };

  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  const handleResetClick = () => {
    setIsResetModalOpen(true);
  };

  const confirmReset = () => {
    localStorage.removeItem('hasChosenPath');
    localStorage.removeItem('userGoal');
    localStorage.removeItem('userStats');
    setHasChosenPath(false);
    setGoal('');
    setStats({
      streak: 0,
      day: 1,
      level: 1,
      levelProgress: 0,
      percent: 0,
      completedDays: [],
      partialDays: [],
      tasks: [],
    });
    setIsResetModalOpen(false);
  };

  const handlePathChosen = () => {
    setHasChosenPath(true);
    localStorage.setItem('hasChosenPath', 'true');
  };

  // Condition 1: First visit, no path chosen
  if (!hasChosenPath) {
    return <IntroAnimation onComplete={handlePathChosen} />;
  }

  // Condition 2: Path chosen, but no goal set
  if (hasChosenPath && !goal) {
    return <GoalSetting onGoalSet={setGoal} />;
  }

  // Condition 3: Path chosen and goal exists (Main Dashboard)
  return (
    <div className="dashboard-container">
      <TopSection goal={goal} streak={stats.streak} day={stats.day} percent={stats.percent} />
      
      <div className="main-grid">
        <MissionCard 
          tasks={stats.tasks || []} 
          onAddTask={handleAddTask} 
          onCompleteTask={handleCompleteTask} 
        />
        <TransformationStats level={stats.level} levelProgress={stats.levelProgress || 0} percent={stats.percent} />
      </div>
      
      <ProgressGrid completedDays={stats.completedDays} partialDays={stats.partialDays} />
      
      <div className="main-grid">
        <ActivityTimeline />
        <ShareCard goal={goal} day={stats.day} percent={stats.percent} />
      </div>

      <div className="flex-center" style={{ marginTop: '16px', paddingBottom: '32px' }}>
        <button className="reset-journey-btn" onClick={handleResetClick}>Reset Journey</button>
      </div>

      {isResetModalOpen && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h3 className="modal-text">Do you want to clear all your progress?</h3>
            <div className="modal-buttons">
              <button className="btn-cancel" onClick={() => setIsResetModalOpen(false)}>Cancel</button>
              <button className="btn-danger" onClick={confirmReset}>Yes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
