'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

import {
  createSubtask,
  createUpdate,
  deleteSubtask,
  getTasks,
  updateSubtask,
  updateTask,
} from '@/lib/api';
import type { Task } from '@/types/task';

interface User {
  _id: string;
  name: string;
  guestId: string;
}

export default function TaskDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const taskId = params.id as string;

  const [user, setUser] = useState<User | null>(null);
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [showSubtaskForm, setShowSubtaskForm] =
    useState(false);

  const [subtaskTitle, setSubtaskTitle] =
    useState('');

  const [subtaskPriority, setSubtaskPriority] =
    useState<'low' | 'medium' | 'high'>('medium');

  const [subtaskDueDate, setSubtaskDueDate] =
    useState('');

  const [subtaskSaving, setSubtaskSaving] =
    useState(false);

  const [showLabelForm, setShowLabelForm] =
    useState(false);

  const [labelName, setLabelName] =
    useState('');

  const [labelSaving, setLabelSaving] =
    useState(false);

  const [showResourceForm, setShowResourceForm] =
    useState(false);

  const [resourceName, setResourceName] =
    useState('');

  const [resourceUrl, setResourceUrl] =
    useState('');

  const [resourceSaving, setResourceSaving] =
    useState(false);

  const [updateText, setUpdateText] =
    useState('');

  const [updateSaving, setUpdateSaving] =
    useState(false);




  useEffect(() => {
    const savedUser = localStorage.getItem('user');

    if (!savedUser) {
      router.push('/');
      return;
    }

    try {
      setUser(JSON.parse(savedUser));
    } catch {
      localStorage.removeItem('user');
      router.push('/');
    }
  }, [router]);

  useEffect(() => {
    if (!user) {
      return;
    }

    const userId = user._id;

    async function loadTask() {
      try {
        setLoading(true);

        const tasks = await getTasks(userId);

        const foundTask = tasks.find(
          (currentTask: Task) =>
            currentTask._id === taskId,
        );

        setTask(foundTask ?? null);
      } catch (error) {
        console.error('Failed to load task:', error);
      } finally {
        setLoading(false);
      }
    }

    loadTask();
  }, [user, taskId]);

  async function updateStatus(
    status: Task['status'],
  ) {
    if (!task || !user) return;

    try {
      setSaving(true);

      const updated = await updateTask(
        task._id,
        user._id,
        { status },
      );

      setTask(updated);
    } catch (error) {
      console.error(error);
      alert('Failed to update status');
    } finally {
      setSaving(false);
    }
  }

  async function updatePriority(
    priority: Task['priority'],
  ) {
    if (!task || !user) return;

    try {
      setSaving(true);

      const updated = await updateTask(
        task._id,
        user._id,
        { priority },
      );

      setTask(updated);
    } catch (error) {
      console.error(error);
      alert('Failed to update priority');
    } finally {
      setSaving(false);
    }
  }

  async function handleCreateUpdate() {
    if (!task || !user || !updateText.trim()) {
      return;
    }

    try {
      setUpdateSaving(true);

      await createUpdate(
        task._id,
        user._id,
        {
          text: updateText.trim(),
          userName: user.name,
        },
      );

      const tasks = await getTasks(user._id);

      const refreshedTask = tasks.find(
        (currentTask: Task) =>
          currentTask._id === task._id,
      );

      if (refreshedTask) {
        setTask(refreshedTask);
      }

      setUpdateText('');
    } catch (error) {
      console.error(error);
      alert('Failed to add update');
    } finally {
      setUpdateSaving(false);
    }
  }

  async function handleAddResource() {
    if (
      !task ||
      !user ||
      !resourceName.trim() ||
      !resourceUrl.trim()
    ) {
      return;
    }

    try {
      setResourceSaving(true);

      const updatedTask = await updateTask(
        task._id,
        user._id,
        {
          resources: [
            ...(task.resources ?? []),
            {
              name: resourceName.trim(),
              url: resourceUrl.trim(),
            },
          ],
        },
      );

      setTask(updatedTask);
      setResourceName('');
      setResourceUrl('');
      setShowResourceForm(false);
    } catch (error) {
      console.error(error);
      alert('Failed to add resource');
    } finally {
      setResourceSaving(false);
    }
  }

  async function handleAddLabel() {
    if (!task || !user || !labelName.trim()) {
      return;
    }

    try {
      setLabelSaving(true);

      const updatedTask = await updateTask(
        task._id,
        user._id,
        {
          labels: [
            ...(task.labels ?? []),
            labelName.trim(),
          ],
        },
      );

      setTask(updatedTask);
      setLabelName('');
      setShowLabelForm(false);
    } catch (error) {
      console.error(error);
      alert('Failed to add label');
    } finally {
      setLabelSaving(false);
    }
  }

  async function handleCreateSubtask() {
    if (!task || !user || !subtaskTitle.trim()) {
      return;
    }

    try {
      setSubtaskSaving(true);

      const newSubtask = await createSubtask(
        task._id,
        user._id,
        {
          title: subtaskTitle.trim(),
          priority: subtaskPriority,
          dueDate: subtaskDueDate
            ? new Date(subtaskDueDate).toISOString()
            : undefined,
        },
      );

      setTask({
        ...task,
        subtasks: [
          ...(task.subtasks ?? []),
          newSubtask,
        ],
      });

      setSubtaskTitle('');
      setSubtaskPriority('medium');
      setSubtaskDueDate('');
      setShowSubtaskForm(false);
    } catch (error) {
      console.error(error);
      alert('Failed to create subtask');
    } finally {
      setSubtaskSaving(false);
    }
  }

  function statusLabel(status: Task['status']) {
    if (status === 'todo') return 'To Do';
    if (status === 'in-progress') return 'Doing';
    if (status === 'completed') return 'Completed';
    return 'On Hold';
  }

  function priorityLabel(
    priority: Task['priority'],
  ) {
    return (
      priority.charAt(0).toUpperCase() +
      priority.slice(1)
    );
  }

  function priorityColor(priority: Task['priority']) {
    if (priority === 'high') {
      return 'bg-red-50 text-red-500';
    }

    if (priority === 'medium') {
      return 'bg-orange-50 text-orange-500';
    }

    return 'bg-gray-100 text-gray-500';
  }

  function statusColor(status: Task['status']) {
    if (status === 'completed') {
      return 'bg-green-50 text-green-600';
    }

    if (status === 'in-progress') {
      return 'bg-blue-50 text-blue-600';
    }

    if (status === 'on-hold') {
      return 'bg-gray-100 text-gray-500';
    }

    return 'bg-orange-50 text-orange-500';
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f8fa]">
        <p className="text-sm text-gray-500">
          Loading task...
        </p>
      </main>
    );
  }

  if (!task || !user) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-[#f7f8fa]">
        <h1 className="text-xl font-semibold">
          Task not found
        </h1>

        <button
          type="button"
          onClick={() => router.push('/')}
          className="mt-4 rounded-xl px-5 py-3 text-sm font-semibold text-white"
          style={{
            backgroundColor: 'var(--theme-primary)',
          }}
        >
          Back to Tasks
        </button>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f8fa] text-gray-900">

      {/* Sidebar */}

      <aside className="fixed left-0 top-0 hidden h-screen w-64 border-r border-gray-200 bg-white lg:block">

        <div className="flex h-full flex-col p-6">

          <div className="mb-10">
            <h1 className="text-2xl font-bold">
              AbleSpace
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Task management
            </p>
          </div>

          <nav className="space-y-2">

            <button
              type="button"
              onClick={() => router.push('/')}
              className="w-full rounded-xl px-4 py-3 text-left text-sm text-gray-600 hover:bg-gray-100"
            >
              Dashboard
            </button>

            <button
              type="button"
              onClick={() => router.push('/')}
              className="w-full rounded-xl bg-gray-100 px-4 py-3 text-left text-sm font-medium"
            >
              Tasks
            </button>

            <button
              type="button"
              className="w-full rounded-xl px-4 py-3 text-left text-sm text-gray-600 hover:bg-gray-100"
            >
              Projects
            </button>

          </nav>

          <div className="mt-auto border-t border-gray-200 pt-5">

            <p className="text-xs text-gray-400">
              Signed in as
            </p>

            <p className="mt-1 text-sm font-medium">
              {user.name}
            </p>

            <p className="mt-1 text-xs text-gray-400">
              {user.guestId}
            </p>

          </div>

        </div>

      </aside>

      {/* Main */}

      <section className="lg:ml-64">

        <div className="mx-auto max-w-[1400px] px-6 py-6 sm:px-8 lg:px-10">

          {/* Top navigation */}

          <div className="mb-6 flex items-center justify-between">

            <button
              type="button"
              onClick={() => router.push('/')}
              className="text-sm font-medium text-gray-500 hover:text-gray-900"
            >
              ← Tasks
            </button>

            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50"
            >
              ⋯
            </button>

          </div>

          {/* Page layout */}

          <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_320px]">

            {/* LEFT */}

            <div className="space-y-5">

              {/* Task header */}

              <section className="px-1">

                <div className="flex items-center gap-2">

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${statusColor(task.status)}`}
                  >
                    {statusLabel(task.status)}
                  </span>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${priorityColor(task.priority)}`}
                  >
                    {priorityLabel(task.priority)}
                  </span>

                </div>

                <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900">
                  {task.title}
                </h1>

                <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-500">
                  {task.description || 'No description added.'}
                </p>

              </section>

              {/* Properties */}

              <section className="border-b border-gray-200 pb-5">

                <div className="flex items-center justify-between">

                  <h2 className="text-sm font-semibold text-gray-900">
                    Properties
                  </h2>

                  {saving && (
                    <span className="text-xs text-gray-400">
                      Saving...
                    </span>
                  )}

                </div>

                <div className="mt-4 grid gap-4 sm:grid-cols-2">

                  <div>
                    <label className="text-xs font-medium text-gray-400">
                      Status
                    </label>

                    <select
                      value={task.status}
                      disabled={saving}
                      onChange={(event) =>
                        updateStatus(
                          event.target.value as Task['status'],
                        )
                      }
                      className="mt-1.5 w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-gray-400"
                    >
                      <option value="todo">To Do</option>
                      <option value="in-progress">Doing</option>
                      <option value="completed">Completed</option>
                      <option value="on-hold">On Hold</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-gray-400">
                      Priority
                    </label>

                    <select
                      value={task.priority}
                      disabled={saving}
                      onChange={(event) =>
                        updatePriority(
                          event.target.value as Task['priority'],
                        )
                      }
                      className="mt-1.5 w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-gray-400"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>

                  <div>
                    <p className="text-xs font-medium text-gray-400">
                      Members
                    </p>

                    <div className="mt-1.5 flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2.5">

                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-200 text-xs font-semibold">
                        {user.name.charAt(0).toUpperCase()}
                      </span>

                      <span className="text-sm">
                        {user.name}
                      </span>

                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-medium text-gray-400">
                      Due Date
                    </p>

                    <div className="mt-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm">
                      {task.dueDate
                        ? new Date(task.dueDate).toLocaleDateString(
                            'en-GB',
                            {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                            },
                          )
                        : 'No due date'}
                    </div>
                  </div>

                </div>

              </section>

              {/* Labels */}

              <section className="rounded-2xl border border-gray-200 bg-white p-6">

                <div className="flex items-center justify-between">

                  <h2 className="text-lg font-semibold">
                    Labels
                  </h2>

                  <button
                    type="button"
                    onClick={() =>
                      setShowLabelForm((current) => !current)
                    }
                    className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
                  >
                    + Add label
                  </button>

                </div>

                {showLabelForm && (
                  <div className="mt-4 flex gap-2">

                    <input
                      type="text"
                      value={labelName}
                      onChange={(e) =>
                        setLabelName(e.target.value)
                      }
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleAddLabel();
                        }
                      }}
                      placeholder="Label name"
                      autoFocus
                      className="min-w-0 flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-gray-400"
                    />

                    <button
                      type="button"
                      onClick={handleAddLabel}
                      disabled={
                        labelSaving || !labelName.trim()
                      }
                      className="rounded-xl px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
                      style={{
                        backgroundColor:
                          'var(--theme-primary)',
                      }}
                    >
                      {labelSaving ? 'Adding...' : 'Add'}
                    </button>

                  </div>
                )}

                <div className="mt-4 flex flex-wrap gap-2">

                  {(task.labels ?? []).map((label) => (

                    <span
                      key={label}
                      className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700"
                    >
                      {label}

                      <button
                        type="button"
                        onClick={async () => {
                          try {
                            const updatedTask =
                              await updateTask(
                                task._id,
                                user._id,
                                {
                                  labels:
                                    (task.labels ?? []).filter(
                                      (currentLabel) =>
                                        currentLabel !== label,
                                    ),
                                },
                              );

                            setTask(updatedTask);
                          } catch (error) {
                            console.error(error);
                            alert('Failed to remove label');
                          }
                        }}
                        className="text-gray-400 hover:text-red-500"
                        aria-label={`Remove ${label}`}
                      >
                        ×
                      </button>

                    </span>

                  ))}

                  {(task.labels ?? []).length === 0 &&
                    !showLabelForm && (
                      <span className="text-sm text-gray-400">
                        No labels
                      </span>
                    )}

                </div>

              </section>

              {/* Resources */}

              <section className="rounded-2xl border border-gray-200 bg-white p-6">

                <div className="flex items-center justify-between">

                  <h2 className="text-lg font-semibold">
                    Resources
                  </h2>

                  <button
                    type="button"
                    onClick={() =>
                      setShowResourceForm((current) => !current)
                    }
                    className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
                  >
                    + Add
                  </button>

                </div>

                {showResourceForm && (
                  <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_1.5fr_auto]">

                    <input
                      type="text"
                      value={resourceName}
                      onChange={(e) =>
                        setResourceName(e.target.value)
                      }
                      placeholder="Resource name"
                      autoFocus
                      className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-gray-400"
                    />

                    <input
                      type="url"
                      value={resourceUrl}
                      onChange={(e) =>
                        setResourceUrl(e.target.value)
                      }
                      placeholder="https://example.com"
                      className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-gray-400"
                    />

                    <button
                      type="button"
                      onClick={handleAddResource}
                      disabled={
                        resourceSaving ||
                        !resourceName.trim() ||
                        !resourceUrl.trim()
                      }
                      className="rounded-xl px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
                      style={{
                        backgroundColor:
                          'var(--theme-primary)',
                      }}
                    >
                      {resourceSaving ? 'Adding...' : 'Add'}
                    </button>

                  </div>
                )}

                <div className="mt-4 space-y-2">

                  {(task.resources ?? []).map((resource) => (

                    <div
                      key={resource._id}
                      className="flex items-center justify-between rounded-xl border border-gray-200 px-4 py-3"
                    >

                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="min-w-0 text-sm font-medium text-gray-700 hover:underline"
                      >
                        <span className="block truncate">
                          {resource.name}
                        </span>

                        <span className="mt-1 block truncate text-xs text-gray-400">
                          {resource.url}
                        </span>
                      </a>

                      <button
                        type="button"
                        onClick={async () => {
                          try {
                            const updatedTask =
                              await updateTask(
                                task._id,
                                user._id,
                                {
                                  resources:
                                    (task.resources ?? []).filter(
                                      (current) =>
                                        current._id !==
                                        resource._id,
                                    ),
                                },
                              );

                            setTask(updatedTask);
                          } catch (error) {
                            console.error(error);
                            alert(
                              'Failed to remove resource',
                            );
                          }
                        }}
                        className="ml-4 rounded-lg px-2 py-1 text-gray-400 hover:bg-red-50 hover:text-red-500"
                        aria-label="Remove resource"
                      >
                        ×
                      </button>

                    </div>

                  ))}

                  {(task.resources ?? []).length === 0 &&
                    !showResourceForm && (
                      <div className="rounded-xl border border-dashed border-gray-200 px-5 py-8 text-center">
                        <p className="text-sm text-gray-400">
                          No resources attached.
                        </p>
                      </div>
                    )}

                </div>

              </section>

              {/* Subtasks */}

              <section className="rounded-2xl border border-gray-200 bg-white">

                <div className="flex items-center justify-between border-b border-gray-200 p-5">

                  <div>
                    <h2 className="text-lg font-semibold">
                      Subtasks
                    </h2>

                    <p className="mt-1 text-xs text-gray-400">
                      Break this task into smaller steps.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setShowSubtaskForm((current) => !current)
                    }
                    className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
                  >
                    + Add Subtask
                  </button>

                </div>

                {showSubtaskForm && (
                  <div className="border-b border-gray-200 bg-gray-50 p-5">

                    <div className="grid gap-3 sm:grid-cols-3">

                      <input
                        type="text"
                        value={subtaskTitle}
                        onChange={(e) =>
                          setSubtaskTitle(e.target.value)
                        }
                        placeholder="Subtask title"
                        autoFocus
                        className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-gray-400 sm:col-span-3"
                      />

                      <select
                        value={subtaskPriority}
                        onChange={(e) =>
                          setSubtaskPriority(
                            e.target.value as 'low' | 'medium' | 'high',
                          )
                        }
                        className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none"
                      >
                        <option value="low">Low priority</option>
                        <option value="medium">Medium priority</option>
                        <option value="high">High priority</option>
                      </select>

                      <input
                        type="datetime-local"
                        value={subtaskDueDate}
                        onChange={(e) =>
                          setSubtaskDueDate(e.target.value)
                        }
                        className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none"
                      />

                      <button
                        type="button"
                        onClick={handleCreateSubtask}
                        disabled={
                          subtaskSaving ||
                          !subtaskTitle.trim()
                        }
                        className="rounded-xl px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                        style={{
                          backgroundColor:
                            'var(--theme-primary)',
                        }}
                      >
                        {subtaskSaving
                          ? 'Adding...'
                          : 'Add Subtask'}
                      </button>

                    </div>

                  </div>
                )}

                <div className="overflow-x-auto">

                  <div className="min-w-[700px]">

                    <div className="grid grid-cols-[minmax(280px,1fr)_130px_150px_70px] border-b border-gray-200 px-5 py-3 text-xs font-semibold text-gray-500">

                      <div>Subtask</div>
                      <div>Priority</div>
                      <div>Due Date</div>
                      <div></div>

                    </div>

                    {(task.subtasks ?? []).map((subtask) => (

                      <div
                        key={subtask._id}
                        className="grid min-h-[60px] grid-cols-[minmax(280px,1fr)_130px_150px_70px] items-center border-b border-gray-100 px-5 py-3"
                      >

                        <div className="flex items-center gap-3">

                          <button
                            type="button"
                            onClick={async () => {
                              try {
                                const updated =
                                  await updateSubtask(
                                    task._id,
                                    subtask._id,
                                    user._id,
                                    {
                                      completed:
                                        !subtask.completed,
                                    },
                                  );

                                setTask({
                                  ...task,
                                  subtasks:
                                    task.subtasks.map(
                                      (current) =>
                                        current._id ===
                                        updated._id
                                          ? updated
                                          : current,
                                    ),
                                });
                              } catch (error) {
                                console.error(error);
                                alert(
                                  'Failed to update subtask',
                                );
                              }
                            }}
                            className={`flex h-5 w-5 items-center justify-center rounded border ${
                              subtask.completed
                                ? 'border-gray-900 bg-gray-900 text-white'
                                : 'border-gray-300 bg-white'
                            }`}
                          >
                            {subtask.completed && '✓'}
                          </button>

                          <span
                            className={`text-sm ${
                              subtask.completed
                                ? 'text-gray-400 line-through'
                                : 'text-gray-800'
                            }`}
                          >
                            {subtask.title}
                          </span>

                        </div>

                        <div>
                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-medium ${priorityColor(subtask.priority)}`}
                          >
                            {subtask.priority
                              .charAt(0)
                              .toUpperCase() +
                              subtask.priority.slice(1)}
                          </span>
                        </div>

                        <div>
                          {subtask.dueDate ? (
                            <span className="rounded-md bg-red-50 px-2.5 py-1 text-xs font-medium text-red-500">
                              {new Date(
                                subtask.dueDate,
                              ).toLocaleDateString(
                                'en-GB',
                                {
                                  day: '2-digit',
                                  month: 'short',
                                  year: 'numeric',
                                },
                              )}
                            </span>
                          ) : (
                            <span className="text-xs text-gray-400">
                              —
                            </span>
                          )}
                        </div>

                        <div className="flex justify-center">

                          <button
                            type="button"
                            onClick={async () => {
                              try {
                                await deleteSubtask(
                                  task._id,
                                  subtask._id,
                                  user._id,
                                );

                                setTask({
                                  ...task,
                                  subtasks:
                                    task.subtasks.filter(
                                      (current) =>
                                        current._id !==
                                        subtask._id,
                                    ),
                                });
                              } catch (error) {
                                console.error(error);
                                alert(
                                  'Failed to delete subtask',
                                );
                              }
                            }}
                            className="rounded-lg px-2 py-1 text-gray-400 hover:bg-red-50 hover:text-red-500"
                            aria-label="Delete subtask"
                          >
                            ⋯
                          </button>

                        </div>

                      </div>

                    ))}

                    {(task.subtasks ?? []).length === 0 && (
                      <div className="px-5 py-10 text-center">

                        <p className="text-sm text-gray-400">
                          No subtasks yet.
                        </p>

                        <p className="mt-1 text-xs text-gray-400">
                          Click + Add Subtask to create one.
                        </p>

                      </div>
                    )}

                  </div>

                </div>

              </section>

              {/* Updates */}

              <section className="rounded-2xl border border-gray-200 bg-white">

                <div className="border-b border-gray-200 p-5">

                  <h2 className="text-lg font-semibold">
                    Updates
                  </h2>

                  <p className="mt-1 text-xs text-gray-400">
                    Activity and comments
                  </p>

                </div>

                <div className="p-5">

                  {(task.updates ?? []).map((update) => (

                    <div
                      key={update._id}
                      className="mb-5 flex gap-3"
                    >

                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-200 text-xs font-semibold">
                        {update.userName
                          .charAt(0)
                          .toUpperCase()}
                      </div>

                      <div className="min-w-0">

                        <p className="text-sm font-medium">
                          {update.userName}
                        </p>

                        <p className="mt-1 text-sm text-gray-700">
                          {update.text}
                        </p>

                        <p className="mt-1 text-xs text-gray-400">
                          {new Date(
                            update.createdAt,
                          ).toLocaleString()}
                        </p>

                      </div>

                    </div>

                  ))}

                  {(task.updates ?? []).length === 0 && (
                    <p className="mb-5 text-sm text-gray-400">
                      No updates yet.
                    </p>
                  )}

                  <div className="flex gap-2">

                    <input
                      type="text"
                      value={updateText}
                      onChange={(e) =>
                        setUpdateText(e.target.value)
                      }
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleCreateUpdate();
                        }
                      }}
                      placeholder="Write an update..."
                      className="min-w-0 flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-gray-400"
                    />

                    <button
                      type="button"
                      onClick={handleCreateUpdate}
                      disabled={
                        updateSaving ||
                        !updateText.trim()
                      }
                      className="rounded-xl px-4 py-3 text-sm font-semibold text-white disabled:opacity-50"
                      style={{
                        backgroundColor:
                          'var(--theme-primary)',
                      }}
                    >
                      {updateSaving ? 'Posting...' : 'Post'}
                    </button>

                  </div>

                </div>

              </section>

            </div>


            {/* RIGHT DETAILS */}

            <aside className="h-fit overflow-hidden rounded-2xl border border-gray-200 bg-white">

              <div className="flex items-center justify-between border-b border-gray-200 p-5">

                <h2 className="font-semibold">
                  Details
                </h2>

                <button
                  type="button"
                  className="text-gray-400 hover:text-gray-700"
                >
                  ⚙
                </button>

              </div>

              <div className="divide-y divide-gray-100">

                <div className="flex items-center justify-between gap-4 p-5">
                  <span className="text-sm text-gray-500">
                    Status
                  </span>

                  <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${statusColor(task.status)}`}
                    >
                      {statusLabel(task.status)}
                    </span>
                </div>

                <div className="flex items-center justify-between gap-4 p-5">
                  <span className="text-sm text-gray-500">
                    Priority
                  </span>

                  <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${priorityColor(task.priority)}`}
                    >
                      {priorityLabel(task.priority)}
                    </span>
                </div>

                <div className="flex items-center justify-between gap-4 p-5">

                  <span className="text-sm text-gray-500">
                    Members
                  </span>

                  <span className="flex items-center gap-2 text-sm">

                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-200 text-xs font-semibold">
                      {user.name
                        .charAt(0)
                        .toUpperCase()}
                    </span>

                    {user.name}

                  </span>

                </div>

                <div className="flex items-center justify-between gap-4 p-5">

                  <span className="text-sm text-gray-500">
                    Due Date
                  </span>

                  <span
                      className={
                        task.dueDate
                          ? 'rounded-md bg-red-50 px-2.5 py-1 text-xs font-medium text-red-500'
                          : 'text-sm text-gray-400'
                      }
                    >
                      {task.dueDate
                        ? new Date(
                            task.dueDate,
                          ).toLocaleDateString(
                            'en-GB',
                            {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                            },
                          )
                        : '—'}
                    </span>

                </div>

                  <div className="flex items-center justify-between gap-4 p-5">

                    <span className="text-sm text-gray-500">
                      Labels
                    </span>

                    <span className="flex max-w-[180px] flex-wrap justify-end gap-1.5">
                      {(task.labels ?? []).length > 0
                        ? task.labels.map((label) => (
                            <span
                              key={label}
                              className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600"
                            >
                              {label}
                            </span>
                          ))
                        : (
                            <span className="text-sm text-gray-400">
                              —
                            </span>
                          )}
                    </span>

                  </div>

                <div className="flex items-center justify-between gap-4 p-5">

                  <span className="text-sm text-gray-500">
                    Teams
                  </span>

                  <span className="text-sm text-gray-400">
                    —
                  </span>

                </div>

                <div className="flex items-center justify-between gap-4 p-5">

                  <span className="text-sm text-gray-500">
                    Reporter
                  </span>

                  <span className="text-sm font-medium">
                    {user.name}
                  </span>

                </div>

              </div>

            </aside>

          </div>

        </div>

      </section>

    </main>
  );
}
