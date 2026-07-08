const createTaskId = () => `task-${Date.now()}-${Math.random().toString(16).slice(2)}`;

export const normalizeTasks = (tasks = []) =>
  (Array.isArray(tasks) ? tasks : []).map((task) => ({
    ...task,
    id: task.id || createTaskId(),
    completed: Boolean(task.completed),
  }));

export const updateTaskCompletion = (tasks = [], taskId) =>
  normalizeTasks(tasks).map((task) =>
    task.id === taskId ? { ...task, completed: true } : { ...task, completed: Boolean(task.completed) }
  );
