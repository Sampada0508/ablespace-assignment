'use client';

import { useState } from 'react';
import { deleteTask, updateTask } from '@/lib/api';
import type { Task } from '@/types/task';

interface TaskCardProps {
  task: Task;
  userId: string;
  onUpdated: (task: Task) => void;
  onDeleted: (taskId: string) => void;
}

export default function TaskCard({
  task,
  userId,
  onUpdated,
  onDeleted,
}: TaskCardProps) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(
    task.description ?? '',
  );
  const [status, setStatus] = useState(task.status);
  const [priority, setPriority] = useState(task.priority);

  const [dueDate, setDueDate] = useState(
    task.dueDate
      ? new Date(task.dueDate)
          .toISOString()
          .slice(0, 16)
      : '',
  );

  // ==================================================
  // SAVE TASK
  // ==================================================

  async function handleSave() {
    try {
      setSaving(true);

      const updatedTask = await updateTask(
        task._id,
        userId,
        {
          title,
          description,
          status,
          priority,
          dueDate: dueDate
            ? new Date(dueDate).toISOString()
            : undefined,
        },
      );

      onUpdated(updatedTask);
      setEditing(false);
    } catch (error) {
      console.error(
        'Failed to update task:',
        error,
      );

      alert('Failed to update task');
    } finally {
      setSaving(false);
    }
  }

  // ==================================================
  // DELETE TASK
  // ==================================================

  async function handleDelete() {
    const confirmed = window.confirm(
      'Are you sure you want to delete this task?',
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeleting(true);

      await deleteTask(
        task._id,
        userId,
      );

      onDeleted(task._id);
    } catch (error) {
      console.error(
        'Failed to delete task:',
        error,
      );

      alert('Failed to delete task');
    } finally {
      setDeleting(false);
      setMenuOpen(false);
    }
  }

  // ==================================================
  // STATUS LABEL
  // ==================================================

  function getStatusLabel(
    value: Task['status'],
  ) {
    switch (value) {
      case 'todo':
        return 'To Do';

      case 'in-progress':
        return 'Doing';

      case 'completed':
        return 'Completed';

      default:
        return value;
    }
  }

  // ==================================================
  // PRIORITY LABEL
  // ==================================================

  function getPriorityLabel(
    value: Task['priority'],
  ) {
    switch (value) {
      case 'high':
        return 'High';

      case 'medium':
        return 'Medium';

      case 'low':
        return 'Low';

      default:
        return value;
    }
  }

  // ==================================================
  // EDIT MODE
  // ==================================================

  if (editing) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="space-y-4">

          {/* Title */}

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">
              Title
            </label>

            <input
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
            />
          </div>

          {/* Description */}

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">
              Description
            </label>

            <textarea
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              rows={3}
              className="w-full resize-none rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
            />
          </div>

          {/* Status */}

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">
              Status
            </label>

            <select
              value={status}
              onChange={(e) =>
                setStatus(
                  e.target.value as Task['status'],
                )
              }
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none"
            >
              <option value="todo">
                To Do
              </option>

              <option value="in-progress">
                Doing
              </option>

              <option value="completed">
                Completed
              </option>
            </select>
          </div>

          {/* Priority */}

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">
              Priority
            </label>

            <select
              value={priority}
              onChange={(e) =>
                setPriority(
                  e.target.value as Task['priority'],
                )
              }
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none"
            >
              <option value="low">
                Low
              </option>

              <option value="medium">
                Medium
              </option>

              <option value="high">
                High
              </option>
            </select>
          </div>

          {/* Due Date */}

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">
              Due date
            </label>

            <input
              type="datetime-local"
              value={dueDate}
              onChange={(e) =>
                setDueDate(e.target.value)
              }
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none"
            />
          </div>

          {/* Buttons */}

          <div className="flex justify-end gap-2 pt-1">

            <button
              type="button"
              onClick={() =>
                setEditing(false)
              }
              disabled={saving}
              className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="rounded-lg bg-black px-3 py-2 text-xs font-semibold text-white hover:bg-gray-800 disabled:opacity-50"
            >
              {saving
                ? 'Saving...'
                : 'Save'}
            </button>

          </div>

        </div>
      </div>
    );
  }

  // ==================================================
  // NORMAL TASK CARD
  // ==================================================

  return (
    <article className="group relative rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:border-gray-300 hover:shadow-md">

      {/* ==================================================
          TOP ROW
      ================================================== */}

      <div className="flex items-start justify-between gap-3">

        <h4 className="min-w-0 flex-1 text-sm font-semibold leading-5 text-gray-900">
          {task.title}
        </h4>

        {/* Three-dot menu */}

        <div className="relative">

          <button
            type="button"
            onClick={() =>
              setMenuOpen(
                (current) => !current,
              )
            }
            className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
            aria-label="Task actions"
          >
            ⋯
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-8 z-20 w-28 rounded-lg border border-gray-200 bg-white p-1 shadow-lg">

              <button
                type="button"
                onClick={() => {
                  setEditing(true);
                  setMenuOpen(false);
                }}
                className="w-full rounded-md px-3 py-2 text-left text-xs hover:bg-gray-50"
              >
                Edit
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="w-full rounded-md px-3 py-2 text-left text-xs text-red-600 hover:bg-red-50 disabled:opacity-50"
              >
                {deleting
                  ? 'Deleting...'
                  : 'Delete'}
              </button>

            </div>
          )}

        </div>
      </div>

      {/* ==================================================
          DESCRIPTION
      ================================================== */}

      {task.description && (
        <p className="mt-2 line-clamp-3 text-xs leading-5 text-gray-500">
          {task.description}
        </p>
      )}

      {/* ==================================================
          META ROW
      ================================================== */}

      <div className="mt-4 flex flex-wrap items-center gap-2">

        {/* Status */}

        <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-medium text-gray-600">
          {getStatusLabel(task.status)}
        </span>

        {/* Priority */}

        <span className="flex items-center gap-1.5 rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-medium text-gray-600">

          <span className="flex items-end gap-[2px]">

            <span
              className={`h-1 w-[2px] ${
                task.priority === 'high'
                  ? 'bg-red-500'
                  : task.priority === 'medium'
                    ? 'bg-orange-400'
                    : 'bg-gray-400'
              }`}
            />

            <span
              className={`h-2 w-[2px] ${
                task.priority === 'high'
                  ? 'bg-red-500'
                  : task.priority === 'medium'
                    ? 'bg-orange-400'
                    : 'bg-gray-400'
              }`}
            />

            <span
              className={`h-3 w-[2px] ${
                task.priority === 'high'
                  ? 'bg-red-500'
                  : task.priority === 'medium'
                    ? 'bg-orange-400'
                    : 'bg-gray-400'
              }`}
            />

          </span>

          {getPriorityLabel(task.priority)}

        </span>

      </div>

      {/* ==================================================
          DUE DATE
      ================================================== */}

      {task.dueDate && (
        <div className="mt-3">

          <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1 text-[11px] font-medium text-red-500">

            <span>◷</span>

            {new Date(
              task.dueDate,
            ).toLocaleDateString(
              undefined,
              {
                day: '2-digit',
                month: 'short',
              },
            )}

          </span>

        </div>
      )}

    </article>
  );
}