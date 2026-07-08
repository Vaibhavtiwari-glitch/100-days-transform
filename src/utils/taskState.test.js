import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeTasks, updateTaskCompletion } from './taskState.js';

test('normalizeTasks assigns ids to tasks that do not have one', () => {
  const tasks = [{ text: 'Read', completed: false }, { text: 'Walk', completed: false }];
  const normalized = normalizeTasks(tasks);

  assert.equal(normalized.length, 2);
  assert.ok(normalized[0].id);
  assert.ok(normalized[1].id);
  assert.notEqual(normalized[0].id, normalized[1].id);
});

test('updateTaskCompletion only marks the requested task as completed', () => {
  const tasks = [
    { id: 'task-1', text: 'Read', completed: false },
    { id: 'task-2', text: 'Walk', completed: false },
  ];

  const updated = updateTaskCompletion(tasks, 'task-1');

  assert.equal(updated[0].completed, true);
  assert.equal(updated[1].completed, false);
});
