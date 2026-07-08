import { useState, useEffect } from 'react'
import './index.css'
import { supabase } from './supabaseClient'
import GoalSetting from './components/GoalSetting'
import TopSection from './components/TopSection'
import MissionCard from './components/MissionCard'
import TransformationStats from './components/TransformationStats'
import ProgressGrid from './components/ProgressGrid'
import ActivityTimeline from './components/ActivityTimeline'
import ShareCard from './components/ShareCard'
import IntroAnimation from './components/IntroAnimation'
import { normalizeTasks, updateTaskCompletion } from './utils/taskState'

function App() {
  const [goal, setGoal] = useState(() => localStorage.getItem('userGoal') || '')
  const [hasChosenPath, setHasChosenPath] = useState(() => localStorage.getItem('hasChosenPath') === 'true');
  
  const [stats, setStats] = useState(() => {
    const saved = localStorage.getItem('userStats');

    let parsed = {
      streak: 0,
      day: 1,
      xp: 0,
      level: 1,
      percent: 0,
      completedDays: [],
      partialDays: [],
      calendar_history: {},
      tasks: [],
    };

    if (saved) {
      try {
        const savedStats = JSON.parse(saved);
        parsed = {
          ...parsed,
          ...savedStats,
          calendar_history: savedStats.calendar_history || {},
          tasks: Array.isArray(savedStats.tasks) ? savedStats.tasks : []
        };
      } catch (err) {
        console.error('Error loading saved stats:', err);
      }
    }

    return parsed;
  });

  useEffect(() => {
    const fetchSupabaseData = async () => {
      try {
        const { data: tasksData, error: tasksError } = await supabase
          .from('daily_tasks')
          .select('*');
        
        if (tasksError) throw tasksError;

        const { data: historyData, error: historyError } = await supabase
          .from('calendar_history')
          .select('*');
          
        if (historyError) throw historyError;
        
        const historyMap = {};
        if (historyData) {
          historyData.forEach(item => {
            historyMap[item.day] = item.ratio;
          });
        }

        setStats(prev => ({
          ...prev,
          tasks: normalizeTasks(tasksData || []),
          calendar_history: historyMap
        }));
      } catch (err) {
        console.error("Error fetching Supabase data:", err);
      }
    };
    
    if (hasChosenPath) {
      fetchSupabaseData();
    }
  }, [hasChosenPath]);

  useEffect(() => {
    if (goal) {
      localStorage.setItem('userGoal', goal)
    }
  }, [goal])

  useEffect(() => {
    localStorage.setItem('userStats', JSON.stringify(stats));
  }, [stats]);

  const handleAddTask = async (taskName) => {
    const newTask = { text: taskName, completed: false };

    try {
      const { error } = await supabase.from('daily_tasks').insert([newTask]);
      if (error) console.error("Supabase insert error:", error);
    } catch(err) {
      console.error(err);
    }

    setStats(prev => {
      try {
        const currentTasks = normalizeTasks(prev.tasks);
        const currentCompletedDays = Array.isArray(prev.completedDays) ? prev.completedDays : [];
        const currentPartialDays = Array.isArray(prev.partialDays) ? prev.partialDays : [];
        const currentDay = prev.day || 1;

        const newTasks = [...currentTasks, { ...newTask, id: newTask.id || `task-${Date.now()}-${Math.random().toString(16).slice(2)}` }];
        
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

  const handleCompleteTask = async (taskId) => {
    try {
      const { error } = await supabase
        .from('daily_tasks')
        .update({ completed: true })
        .eq('id', taskId);
      if (error) console.error("Supabase update error:", error);
    } catch(err) {
      console.error(err);
    }

    setStats(prev => {
      try {
        const currentTasks = normalizeTasks(prev.tasks);
        const currentCompletedDays = Array.isArray(prev.completedDays) ? prev.completedDays : [];
        const currentPartialDays = Array.isArray(prev.partialDays) ? prev.partialDays : [];
        const currentDay = prev.day || 1;

        const newTasks = updateTaskCompletion(currentTasks, taskId);
        
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

  const handleCompleteDay = async () => {
    const currentTasks = stats.tasks || [];
    if (currentTasks.length === 0) return;
    
    const totalTasks = currentTasks.length;
    const completedTasks = currentTasks.filter(t => t.completed).length;
    const ratio = completedTasks / totalTasks;
    
    const currentDay = stats.day || 1;

    try {
      const { error: historyError } = await supabase
        .from('calendar_history')
        .insert([{ day: currentDay, ratio }]);
      if (historyError) console.error("Supabase history error:", historyError);

      const taskIds = currentTasks.map(t => t.id);
      if (taskIds.length > 0) {
        const { error: deleteError } = await supabase
          .from('daily_tasks')
          .delete()
          .in('id', taskIds);
        if (deleteError) console.error("Supabase delete error:", deleteError);
      }
    } catch (err) {
      console.error("Error in complete day:", err);
    }

    setStats(prev => {
      const newHistory = {
        ...(prev.calendar_history || {}),
        [currentDay]: ratio
      };
      
      return {
        ...prev,
        calendar_history: newHistory,
        tasks: [],
        day: currentDay + 1
      };
    });
  };

  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  const handleResetClick = () => {
    setIsResetModalOpen(true);
  };

  const confirmReset = async () => {
    try {
      await supabase.from('daily_tasks').delete().neq('id', 0);
      await supabase.from('calendar_history').delete().neq('day', 0);
    } catch (err) {
      console.error(err);
    }

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
      calendar_history: {},
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
          onCompleteDay={handleCompleteDay}
        />
        <TransformationStats level={stats.level} levelProgress={stats.levelProgress || 0} percent={stats.percent} />
      </div>
      
      <ProgressGrid calendarHistory={stats.calendar_history || {}} activeDay={stats.day} />
      
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
