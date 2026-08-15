'use client';

import { useEffect, useState } from 'react';

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
  const [user, setUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);

  const [checkingUser, setCheckingUser] = useState(true);
  const [loadingTasks, setLoadingTasks] = useState(false);

  const [showCreateModal, setShowCreateModal] =
    useState(false);

  const [searchQuery, setSearchQuery] = useState('');

  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>('all');

  // ==================================================
  // CHECK LOGGED-IN USER
  // ==================================================

  useEffect(() => {
    const savedUser = localStorage.getItem('user');

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

  // ==================================================
  // DASHBOARD
  // ==================================================

  return (
    <main className="min-h-screen bg-[#f7f8fa] text-[#111827]">

      {/* ==================================================
          SIDEBAR
      ================================================== */}

      <aside className="fixed left-0 top-0 hidden h-screen w-64 border-r border-gray-200 bg-white lg:block">
        <div className="flex h-full flex-col p-6">

          {/* Logo */}

          <div className="mb-10">
            <h1 className="text-2xl font-bold tracking-tight">
              AbleSpace
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Task management
            </p>
          </div>

          {/* Navigation */}

          <nav className="space-y-2">

            <button
              type="button"
              className="w-full rounded-xl bg-black px-4 py-3 text-left text-sm font-medium text-white"
            >
              Dashboard
            </button>

            <button
              type="button"
              className="w-full rounded-xl px-4 py-3 text-left text-sm font-medium text-gray-600 transition hover:bg-gray-100"
            >
              Tasks
            </button>

            <button
              type="button"
              className="w-full rounded-xl px-4 py-3 text-left text-sm font-medium text-gray-600 transition hover:bg-gray-100"
            >
              Projects
            </button>

          </nav>

          {/* User */}

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

      {/* ==================================================
          MAIN CONTENT
      ================================================== */}

      <section className="lg:ml-64">

        <div className="mx-auto max-w-7xl px-6 py-8 sm:px-8 lg:px-10">

          {/* ==================================================
              HEADER
          ================================================== */}

          <header className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <p className="text-sm font-medium text-gray-500">
                Welcome back, {user.name}
              </p>

              <h2 className="mt-1 text-3xl font-bold tracking-tight">
                Your tasks
              </h2>

            </div>

            <button
              type="button"
              onClick={() =>
                setShowCreateModal(true)
              }
              className="rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
            >
              + New Task
            </button>

          </header>

          {/* ==================================================
              STATISTICS
          ================================================== */}

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

            {/* Total */}

            <div className="rounded-2xl border border-gray-200 bg-white p-5">

              <p className="text-sm text-gray-500">
                Total tasks
              </p>

              <p className="mt-2 text-3xl font-bold">
                {loadingTasks
                  ? '...'
                  : totalTasks}
              </p>

            </div>

            {/* To Do */}

            <div className="rounded-2xl border border-gray-200 bg-white p-5">

              <p className="text-sm text-gray-500">
                To do
              </p>

              <p className="mt-2 text-3xl font-bold">
                {loadingTasks
                  ? '...'
                  : todoTasks}
              </p>

            </div>

            {/* Doing */}

            <div className="rounded-2xl border border-gray-200 bg-white p-5">

              <p className="text-sm text-gray-500">
                Doing
              </p>

              <p className="mt-2 text-3xl font-bold">
                {loadingTasks
                  ? '...'
                  : inProgressTasks}
              </p>

            </div>

            {/* Completed */}

            <div className="rounded-2xl border border-gray-200 bg-white p-5">

              <p className="text-sm text-gray-500">
                Completed
              </p>

              <p className="mt-2 text-3xl font-bold">
                {loadingTasks
                  ? '...'
                  : completedTasks}
              </p>

            </div>

          </div>

          {/* ==================================================
              TASK SECTION
          ================================================== */}

          <section className="mt-8 rounded-2xl border border-gray-200 bg-white">

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

                {/* Search + Filter */}

                <div className="flex flex-col gap-3 sm:flex-row">

                  <input
                    type="text"
                    placeholder="Search tasks..."
                    value={searchQuery}
                    onChange={(e) =>
                      setSearchQuery(
                        e.target.value,
                      )
                    }
                    className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition focus:border-gray-400"
                  />

                  <select
                    value={statusFilter}
                    onChange={(e) =>
                      setStatusFilter(
                        e.target.value as StatusFilter,
                      )
                    }
                    className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none"
                  >

                    <option value="all">
                      All tasks
                    </option>

                    <option value="todo">
                      To Do
                    </option>

                    <option value="in-progress">
                      Doing
                    </option>

                    <option value="completed">
                      Completed
                    </option>

                    <option value="on-hold">
                      On Hold
                    </option>

                  </select>

                </div>

              </div>

            </div>

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
                    className="mt-5 rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
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
                    className="mt-5 rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
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

                <div className="overflow-x-auto p-5 sm:p-6">

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