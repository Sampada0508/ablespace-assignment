'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import CreateTaskModal from '@/components/CreateTaskModal';
import GuestLogin from '@/components/GuestLogin';
import TaskCard from '@/components/TaskCard';

import { getTasks } from '@/lib/api';
import type { Task } from '@/types/task';

interface User {
  _id: string;
  name: string;
  guestId: string;
}

type StatusFilter = 'all' | Task['status'];
type ViewMode = 'board' | 'list';

type VisibleFields = {
  status: boolean;
  priority: boolean;
  members: boolean;
  dueDate: boolean;
};
type Theme =
  | 'amber'
  | 'blue'
  | 'pink'
  | 'rose'
  | 'emerald'
  | 'black';

const themes: {
  id: Theme;
  label: string;
  color: string;
}[] = [
  { id: 'amber', label: 'Amber', color: '#f59e0b' },
  { id: 'blue', label: 'Blue', color: '#3b82f6' },
  { id: 'pink', label: 'Pink', color: '#ec4899' },
  { id: 'rose', label: 'Rose', color: '#f43f5e' },
  { id: 'emerald', label: 'Emerald', color: '#10b981' },
  { id: 'black', label: 'Black', color: '#111827' },
];

const kanbanColumns: {
  status: Task['status'];
  label: string;
}[] = [
  {
    status: 'todo',
    label: 'To Do',
  },
  {
    status: 'in-progress',
    label: 'Doing',
  },
  {
    status: 'completed',
    label: 'Completed',
  },
  {
    status: 'on-hold',
    label: 'On Hold',
  },
];

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);

  const [checkingUser, setCheckingUser] = useState(true);
  const [loadingTasks, setLoadingTasks] = useState(false);

  const [showCreateModal, setShowCreateModal] =
    useState(false);
    const [theme, setTheme] = useState<Theme>('blue');
const [showThemeMenu, setShowThemeMenu] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [showFields, setShowFields] = useState(false);
  const [showFilter, setShowFilter] = useState(false);

  const [visibleFields, setVisibleFields] = useState({
    priority: true,
    members: true,
    dueDate: true,
    status: true,
  });

  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>('all');
    const [viewMode, setViewMode] =
  useState<ViewMode>('board');



  // ==================================================
  // CHECK LOGGED-IN USER
  // ==================================================

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedAvatar = localStorage.getItem('profileAvatar');

    if (savedAvatar) {
      setAvatarUrl(savedAvatar);
    }

    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem('user');
      }
    }

    setCheckingUser(false);
  }, []);

  // ==================================================
// LOAD SAVED THEME
// ==================================================

useEffect(() => {
  const savedTheme = localStorage.getItem('theme');

  if (
    savedTheme &&
    themes.some(
      (currentTheme) => currentTheme.id === savedTheme,
    )
  ) {
    setTheme(savedTheme as Theme);
    document.documentElement.dataset.theme = savedTheme;
  } else {
    localStorage.setItem('theme', 'blue');
    document.documentElement.dataset.theme = 'blue';
  }
}, []);

  // ==================================================
  // LOAD TASKS
  // ==================================================

  useEffect(() => {
    if (!user) {
      return;
    }

    const userId = user._id;

    async function loadTasks() {
      try {
        setLoadingTasks(true);

        const data = await getTasks(userId);

        setTasks(data);
      } catch (error) {
        console.error(
          'Failed to load tasks:',
          error,
        );
      } finally {
        setLoadingTasks(false);
      }
    }

    loadTasks();
  }, [user]);

  // ==================================================
  // LOADING SCREEN
  // ==================================================

  if (checkingUser) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f8fa]">
        <p className="text-sm text-gray-500">
          Loading...
        </p>
      </main>
    );
  }

  // ==================================================
  // GUEST LOGIN
  // ==================================================

  if (!user) {
    return <GuestLogin onLogin={setUser} />;
  }

  // ==================================================
  // STATISTICS
  // ==================================================

  const totalTasks = tasks.length;

  const todoTasks = tasks.filter(
    (task) => task.status === 'todo',
  ).length;

  const inProgressTasks = tasks.filter(
    (task) => task.status === 'in-progress',
  ).length;

  const completedTasks = tasks.filter(
    (task) => task.status === 'completed',
  ).length;

  // ==================================================
  // SEARCH + FILTER
  // ==================================================

  const filteredTasks = tasks.filter((task) => {
    const query = searchQuery
      .toLowerCase()
      .trim();

    const matchesSearch =
      !query ||
      task.title
        .toLowerCase()
        .includes(query) ||
      task.description
        ?.toLowerCase()
        .includes(query);

    const matchesStatus =
      statusFilter === 'all' ||
      task.status === statusFilter;

    return (
      matchesSearch &&
      matchesStatus
    );
  });

  // ==================================================
  // UPDATE TASK IN STATE
  // ==================================================

  function handleTaskUpdated(
    updatedTask: Task,
  ) {
    setTasks((currentTasks) =>
      currentTasks.map((currentTask) =>
        currentTask._id === updatedTask._id
          ? updatedTask
          : currentTask,
      ),
    );
  }

  // ==================================================
  // DELETE TASK FROM STATE
  // ==================================================

  function handleTaskDeleted(
    taskId: string,
  ) {
    setTasks((currentTasks) =>
      currentTasks.filter(
        (currentTask) =>
          currentTask._id !== taskId,
      ),
    );
  }

  function handleThemeChange(newTheme: Theme) {

  setTheme(newTheme);

  localStorage.setItem('theme', newTheme);

  document.documentElement.dataset.theme = newTheme;

  setShowThemeMenu(false);

}

  // ==================================================
  // DASHBOARD
  // ==================================================

  return (
    <main className="min-h-screen bg-[#f7f8fa] text-[#111827]">

      {/* ==================================================
          SIDEBAR
      ================================================== */}

        {/* SIDEBAR */}

        <aside className="fixed left-0 top-0 hidden h-screen w-64 border-r border-gray-200 bg-white lg:block">

          <div className="flex h-full flex-col px-5 py-6">

            {/* USER */}

            <button
              type="button"
              onClick={() => router.push('/profile')}
              className="mb-8 flex w-full items-center gap-3 rounded-xl p-2 text-left transition hover:bg-gray-50"
            >

              <div
                className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full text-sm font-semibold text-white"
                style={{
                  backgroundColor: 'var(--theme-primary)',
                }}
              >
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="Profile avatar"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  user.name.charAt(0).toUpperCase()
                )}
              </div>

              <div className="min-w-0 flex-1">

                <p className="truncate text-sm font-semibold text-gray-900">
                  {user.name}
                </p>

                <p className="mt-1 truncate text-xs text-gray-400">
                  {user.guestId}
                </p>

              </div>

              <span className="text-gray-400">
                ⌃
              </span>

            </button>

            {/* WORKSPACE */}

            <div>

              <div className="mb-3 flex items-center justify-between px-2">

                <p className="text-sm font-semibold text-gray-700">
                  Workspace
                </p>

                <span className="text-gray-400">
                  ⌄
                </span>

              </div>

              <nav className="space-y-1">

                <button
                  type="button"
                  onClick={() => {
                    document
                      .getElementById('tasks-section')
                      ?.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start',
                      });
                  }}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold"
                  style={{
                    color: 'var(--theme-primary)',
                    backgroundColor: 'color-mix(in srgb, var(--theme-primary) 8%, white)',
                  }}
                >
                  <span>▦</span>
                  Tasks
                </button>

                <button
                  type="button"
                  onClick={() => router.push('/projects')}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm text-gray-600 transition hover:bg-gray-100"
                >
                  <span className="text-gray-400">▱</span>
                  Projects
                </button>

              </nav>

            </div>

            {/* BOTTOM */}

            <div className="mt-auto space-y-2 border-t border-gray-200 pt-5">

              <button
                type="button"
                onClick={() => router.push('/profile')}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm text-gray-600 transition hover:bg-gray-100"
              >
                <span>♙</span>
                Profile
              </button>

              <div className="relative">

                <button
                  type="button"
                  onClick={() =>
                    setShowThemeMenu((current) => !current)
                  }
                  className="flex w-full items-center justify-between rounded-xl border border-gray-200 px-3 py-3 text-sm font-medium transition hover:bg-gray-50"
                >

                  <span className="flex items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-900 text-xs text-white">
                      N
                    </span>

                    Change Theme
                  </span>

                  <span className="text-gray-400">
                    {showThemeMenu ? '⌃' : '›'}
                  </span>

                </button>

                {showThemeMenu && (
                  <div className="absolute bottom-full left-0 mb-2 w-full rounded-xl border border-gray-200 bg-white p-2 shadow-lg">

                    <p className="px-2 py-1.5 text-xs font-medium text-gray-400">
                      Color Mode
                    </p>

                    {themes.map((currentTheme) => (
                      <button
                        key={currentTheme.id}
                        type="button"
                        onClick={() =>
                          handleThemeChange(currentTheme.id)
                        }
                        className="flex w-full items-center justify-between rounded-lg px-2 py-2 text-sm transition hover:bg-gray-50"
                      >

                        <span className="flex items-center gap-2">

                          <span
                            className="h-3 w-3 rounded-full border border-gray-200"
                            style={{
                              backgroundColor:
                                currentTheme.color,
                            }}
                          />

                          {currentTheme.label}

                        </span>

                        {theme === currentTheme.id && (
                          <span className="font-semibold">
                            ✓
                          </span>
                        )}

                      </button>
                    ))}

                  </div>
                )}

              </div>

            </div>

          </div>

        </aside>
        {/* MAIN CONTENT */}

      <section className="lg:ml-64">

        <div className="mx-auto max-w-7xl px-6 py-8 sm:px-8 lg:px-10">


          {/* ==================================================
              TASK SECTION
          ================================================== */}

          <section
            id="tasks-section"
            className="mt-5 rounded-2xl border border-gray-200 bg-white"
          >

            {/* ==================================================
                TASK HEADER
            ================================================== */}

            <div className="border-b border-gray-200 p-5 sm:p-6">

              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                <div>

                  <h3 className="text-lg font-semibold">
                    Tasks
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    Manage your tasks and stay organized.
                  </p>

                </div>

                {/* Toolbar */}

                <div className="flex items-center gap-2">

                  {/* Search */}

                  <div className="relative">

                    <button
                      type="button"
                      onClick={() =>
                        setShowSearch((current) => !current)
                      }
                      className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-700 transition hover:bg-gray-50"
                      aria-label="Search"
                    >
                      ⌕
                    </button>

                    {showSearch && (
                      <input
                        autoFocus
                        type="text"
                        placeholder="Search tasks..."
                        value={searchQuery}
                        onChange={(e) =>
                          setSearchQuery(e.target.value)
                        }
                        className="absolute right-0 top-12 z-30 w-64 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm shadow-lg outline-none focus:border-gray-400"
                      />
                    )}

                  </div>

                  {/* Fields */}

                  <div className="relative">

                    <button
                      type="button"
                      onClick={() => {
                        setShowFields((current) => !current);
                        setShowFilter(false);
                      }}
                      className="flex h-10 items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                    >
                      ▥
                      <span>Fields</span>
                    </button>

                    {showFields && (
                      <div className="absolute right-0 top-12 z-40 w-64 rounded-xl border border-gray-200 bg-white p-3 shadow-xl">

                        {/* List / Board */}

                        <div className="mb-4 flex overflow-hidden rounded-lg border border-gray-200">

                          <button
                            type="button"
                            onClick={() => setViewMode('list')}
                            className={`flex-1 px-4 py-2 text-sm font-medium ${
                              viewMode === 'list'
                                ? 'bg-gray-100 text-gray-900'
                                : 'text-gray-500'
                            }`}
                          >
                            ☰ List
                          </button>

                          <button
                            type="button"
                            onClick={() => setViewMode('board')}
                            className={`flex-1 px-4 py-2 text-sm font-medium ${
                              viewMode === 'board'
                                ? 'bg-gray-100 text-gray-900'
                                : 'text-gray-500'
                            }`}
                          >
                            ▦ Board
                          </button>

                        </div>

                        <div className="space-y-1">

                          {[
                            ['priority', 'Priority'],
                            ['members', 'Members'],
                            ['dueDate', 'Due Date'],
                            ['status', 'Status'],
                          ].map(([field, label]) => {

                            const key =
                              field as keyof VisibleFields;

                            return (
                              <button
                                key={field}
                                type="button"
                                onClick={() =>
                                  setVisibleFields((current) => ({
                                    ...current,
                                    [key]: !current[key],
                                  }))
                                }
                                className="flex w-full items-center justify-between rounded-lg px-2 py-2 text-sm transition hover:bg-gray-50"
                              >

                                <span>
                                  {label}
                                </span>

                                {visibleFields[key] ? (
                                  <span className="flex h-4 w-4 items-center justify-center rounded bg-gray-900 text-[10px] text-white">
                                    ✓
                                  </span>
                                ) : (
                                  <span className="h-4 w-4 rounded bg-gray-200" />
                                )}

                              </button>
                            );
                          })}

                        </div>

                      </div>
                    )}

                  </div>

                  {/* Filter */}

                  <div className="relative">

                    <button
                      type="button"
                      onClick={() => {
                        setShowFilter((current) => !current);
                        setShowFields(false);
                      }}
                      className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-700 transition hover:bg-gray-50"
                      aria-label="Filter"
                    >
                      ▽
                    </button>

                    {showFilter && (
                      <div className="absolute right-0 top-12 z-40 w-48 rounded-xl border border-gray-200 bg-white p-2 shadow-xl">

                        {[
                          ['all', 'All tasks'],
                          ['todo', 'To Do'],
                          ['in-progress', 'Doing'],
                          ['completed', 'Completed'],
                          ['on-hold', 'On Hold'],
                        ].map(([value, label]) => (
                          <button
                            key={value}
                            type="button"
                            onClick={() => {
                              setStatusFilter(value as StatusFilter);
                              setShowFilter(false);
                            }}
                            className={`w-full rounded-lg px-3 py-2 text-left text-sm transition hover:bg-gray-50 ${
                              statusFilter === value
                                ? 'font-semibold bg-gray-100'
                                : ''
                            }`}
                          >
                            {label}
                          </button>
                        ))}

                      </div>
                    )}

                  </div>

                  {/* Add Task */}

                  <button
                    type="button"
                    onClick={() => setShowCreateModal(true)}
                    className="h-10 rounded-xl px-5 text-sm font-semibold text-white transition hover:opacity-90"
                    style={{
                      backgroundColor: 'var(--theme-primary)',
                    }}
                  >
                    + Add Task
                  </button>

                </div>

              </div>

            </div>
              {/* ONLY TASK CONTENT SCROLLS */}
              <div className="max-h-[calc(100vh-210px)] overflow-y-auto overflow-x-hidden">

            {/* ==================================================
                LOADING
            ================================================== */}

            {loadingTasks && (
              <div className="flex min-h-72 items-center justify-center">

                <p className="text-sm text-gray-500">
                  Loading tasks...
                </p>

              </div>
            )}

            {/* ==================================================
                NO TASKS
            ================================================== */}

            {!loadingTasks &&
              tasks.length === 0 && (

                <div className="flex min-h-72 flex-col items-center justify-center px-6 text-center">

                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-2xl">
                    ✓
                  </div>

                  <h4 className="mt-5 text-lg font-semibold">
                    No tasks yet
                  </h4>

                  <p className="mt-2 max-w-sm text-sm leading-6 text-gray-500">
                    Create your first task to start organizing your work.
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      setShowCreateModal(true)
                    }
                    className="mt-5 rounded-xl px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
style={{
  backgroundColor: 'var(--theme-primary)',
}}
                  >
                    Create your first task
                  </button>

                </div>

              )}

            {/* ==================================================
                NO MATCHING TASKS
            ================================================== */}

            {!loadingTasks &&
              tasks.length > 0 &&
              filteredTasks.length === 0 && (

                <div className="flex min-h-72 flex-col items-center justify-center px-6 text-center">

                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-2xl">
                    🔍
                  </div>

                  <h4 className="mt-5 text-lg font-semibold">
                    No matching tasks
                  </h4>

                  <p className="mt-2 max-w-sm text-sm leading-6 text-gray-500">
                    Try changing your search or status filter.
                  </p>

                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setStatusFilter('all');
                    }}
                    className="mt-5 rounded-xl px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
style={{
  backgroundColor: 'var(--theme-primary)',
}}
                  >
                    Clear filters
                  </button>

                </div>

              )}

            {/* ==================================================
                KANBAN BOARD
            ================================================== */}

            {!loadingTasks &&
              filteredTasks.length > 0 && (

                <div className="p-5 sm:p-6">

                  {/* Board View */}

                  {viewMode === 'board' && (

                    <div className="overflow-x-auto">

                      <div className="grid min-w-[1100px] grid-cols-4 gap-4">

                    {kanbanColumns.map(
                      (column) => {

                        const columnTasks =
                          filteredTasks.filter(
                            (task) =>
                              task.status ===
                              column.status,
                          );

                        return (
                          <div
                            key={column.status}
                            className="min-h-[400px] rounded-2xl bg-gray-50 p-3"
                          >

                            {/* Column Header */}

                            <div className="mb-4 flex items-center justify-between">

                              <h4 className="text-sm font-semibold">
                                {column.label}
                              </h4>

                              <span className="rounded-full bg-white px-2.5 py-1 text-xs font-medium text-gray-500">
                                {columnTasks.length}
                              </span>

                            </div>

                            {/* Column Tasks */}

                            <div className="space-y-3">

                              {columnTasks.map(
                                (task) => (

                                  <TaskCard
                                    key={task._id}
                                    task={task}
                                    userId={user._id}
                                    onUpdated={
                                      handleTaskUpdated
                                    }
                                    onDeleted={
                                      handleTaskDeleted
                                    }

                                    showStatus={
                                      visibleFields.status
                                    }

                                    showPriority={
                                      visibleFields.priority
                                    }

                                    showMembers={
                                      visibleFields.members
                                    }

                                    showDueDate={
                                      visibleFields.dueDate
                                    }

                                    memberName={user.name}
                                  />

                                ),
                              )}

                              {/* Empty column */}

                              {columnTasks.length === 0 && (

                                <div className="rounded-xl border border-dashed border-gray-200 bg-white px-4 py-8 text-center">

                                  <p className="text-xs text-gray-400">
                                    No tasks
                                  </p>

                                </div>

                              )}

                            </div>

                          </div>
                        );
                      },
                    )}

                      </div>

                    </div>

                  )}

                  {/* List View */}

                  {viewMode === 'list' && (

                    <div className="space-y-6">

                      {kanbanColumns.map((column) => {

                        const columnTasks =
                          filteredTasks.filter(
                            (task) =>
                              task.status === column.status,
                          );

                        const gridColumns = [
                          'minmax(280px, 2fr)',
                          visibleFields.priority ? '140px' : '',
                          visibleFields.members ? '150px' : '',
                          visibleFields.dueDate ? '150px' : '',
                          '70px',
                        ]
                          .filter(Boolean)
                          .join(' ');

                        return (

                          <section
                            key={column.status}
                            className="overflow-hidden rounded-xl border border-gray-200 bg-white"
                          >

                            {/* Section Header */}

                            <div className="flex items-center gap-2 border-b border-gray-200 bg-gray-50 px-4 py-3">

                              <span className="text-xs text-gray-500">
                                ▾
                              </span>

                              <h4 className="text-sm font-semibold text-gray-800">
                                {column.label}
                              </h4>

                              <span className="rounded-full bg-white px-2 py-0.5 text-xs font-medium text-gray-500">
                                {columnTasks.length}
                              </span>

                            </div>

                            <div className="overflow-x-auto">

                              <div className="min-w-[650px]">

                                {/* Table Header */}

                                <div
                                  className="grid items-center border-b border-gray-200 bg-white px-4 py-3 text-xs font-semibold text-gray-500"
                                  style={{
                                    gridTemplateColumns: gridColumns,
                                  }}
                                >

                                  <div>
                                    Task
                                  </div>

                                  {visibleFields.priority && (
                                    <div>
                                      Priority
                                    </div>
                                  )}

                                  {visibleFields.members && (
                                    <div>
                                      Members
                                    </div>
                                  )}

                                  {visibleFields.dueDate && (
                                    <div>
                                      Due Date
                                    </div>
                                  )}

                                  <div className="text-center">
                                    Actions
                                  </div>

                                </div>

                                {/* Rows */}

                                {columnTasks.map((task) => (

                                  <div
                                    key={task._id}
                                    className="grid min-h-[64px] items-center border-b border-gray-100 px-4 py-3 last:border-b-0 transition hover:bg-gray-50"
                                    style={{
                                      gridTemplateColumns: gridColumns,
                                    }}
                                  >

                                    {/* Task */}

                                    <div className="min-w-0 pr-4">

                                      <p className="truncate text-sm font-medium text-gray-800">
                                        {task.title}
                                      </p>

                                      {task.description && (
                                        <p className="mt-1 truncate text-xs text-gray-400">
                                          {task.description}
                                        </p>
                                      )}

                                    </div>

                                    {/* Priority */}

                                    {visibleFields.priority && (
                                      <div>

                                        <span
                                          className={`inline-flex items-center gap-1.5 text-xs font-medium ${
                                            task.priority === 'high'
                                              ? 'text-red-500'
                                              : task.priority === 'medium'
                                                ? 'text-orange-500'
                                                : 'text-gray-400'
                                          }`}
                                        >

                                          <span className="text-[10px]">
                                            ▂▅▇
                                          </span>

                                          {task.priority === 'high'
                                            ? 'High'
                                            : task.priority === 'medium'
                                              ? 'Medium'
                                              : 'Low'}

                                        </span>

                                      </div>
                                    )}

                                    {/* Members */}

                                    {visibleFields.members && (
                                      <div>

                                        <div className="flex items-center">

                                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-200 text-xs font-medium text-gray-600">
                                            {user.name
                                              .charAt(0)
                                              .toUpperCase()}
                                          </div>

                                        </div>

                                      </div>
                                    )}

                                    {/* Due Date */}

                                    {visibleFields.dueDate && (
                                      <div>

                                        {task.dueDate ? (

                                          <span
                                            className={`text-xs ${
                                              new Date(task.dueDate) <
                                              new Date()
                                                ? 'text-red-500'
                                                : 'text-gray-500'
                                            }`}
                                          >

                                            {new Date(
                                              task.dueDate,
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
                                    )}

                                    {/* Actions */}

                                    <div className="flex justify-center">

                                      <TaskCard
                                        task={task}
                                        userId={user._id}
                                        onUpdated={
                                          handleTaskUpdated
                                        }
                                        onDeleted={
                                          handleTaskDeleted
                                        }
                                        compact
                                      />

                                    </div>

                                  </div>

                                ))}

                                {/* Add Task */}

                                <button
                                  type="button"
                                  onClick={() =>
                                    setShowCreateModal(true)
                                  }
                                  className="flex w-full items-center gap-2 px-4 py-3 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
                                >

                                  <span className="text-lg leading-none">
                                    +
                                  </span>

                                  Add Task

                                </button>

                              </div>

                            </div>

                          </section>

                        );

                      })}

                    </div>

                  )}

                </div>

              )}

              </div>
          </section>

        </div>

      </section>

      {/* ==================================================
          CREATE TASK MODAL
      ================================================== */}

      {showCreateModal && (

        <CreateTaskModal
          userId={user._id}

          onClose={() => {
            setShowCreateModal(false);
          }}

          onTaskCreated={(newTask) => {

            setTasks((currentTasks) => [
              newTask,
              ...currentTasks,
            ]);

            setShowCreateModal(false);
          }}

        />

      )}

    </main>
  );
}
