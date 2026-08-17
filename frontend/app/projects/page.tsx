'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  createProject,
  deleteProject,
  getProjects,
  updateProject,
} from '@/lib/api';

interface User {
  _id: string;
  name: string;
  guestId: string;
}

type Priority = 'high' | 'medium' | 'low';

interface Project {
  id: string;
  name: string;
  priority: Priority;
  lead: string;
  dueDate: string;
}

const projects: Project[] = [
  {
    id: '1',
    name: 'Website Redesign',
    priority: 'high',
    lead: 'You',
    dueDate: '15 Aug 2026',
  },
  {
    id: '2',
    name: 'Mobile Application',
    priority: 'medium',
    lead: 'You',
    dueDate: '28 Aug 2026',
  },
  {
    id: '3',
    name: 'Marketing Campaign',
    priority: 'low',
    lead: 'You',
    dueDate: '05 Sep 2026',
  },
];

function priorityStyle(priority: Priority) {
  if (priority === 'high') {
    return 'bg-red-50 text-red-500';
  }

  if (priority === 'medium') {
    return 'bg-orange-50 text-orange-500';
  }

  return 'bg-gray-100 text-gray-500';
}

export default function ProjectsPage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [projectList, setProjectList] = useState<Project[]>([]);
  const [showAddProject, setShowAddProject] = useState(false);
  const [showEditProject, setShowEditProject] = useState(false);
  const [editingProject, setEditingProject] =
    useState<Project | null>(null);
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [openProjectMenu, setOpenProjectMenu] = useState<string | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedAvatar = localStorage.getItem('profileAvatar');

    if (savedAvatar) {
      setAvatarUrl(savedAvatar);
    }

    if (!savedUser) {
      router.push('/');
      return;
    }

    async function loadProjects(savedUserValue: string) {
      try {
        const parsedUser: User = JSON.parse(savedUserValue);

        setUser(parsedUser);

        const data = await getProjects(parsedUser._id);

        setProjectList(
          data.map((project: any) => ({
            id: project._id,
            name: project.name,
            priority: project.priority,
            lead: project.lead,
            dueDate: project.dueDate
              ? new Date(
                  project.dueDate,
                ).toLocaleDateString(
                  'en-GB',
                  {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  },
                )
              : '—',
          })),
        );
      } catch (error) {
        console.error(error);

        localStorage.removeItem('user');
        router.push('/');
      }
    }

    loadProjects(savedUser);
  }, [router]);

  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f8fa]">
        <p className="text-sm text-gray-500">
          Loading...
        </p>
      </main>
    );
  }

  const filteredProjects = projectList.filter((project) =>
    project.name
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  return (
    <main className="min-h-screen bg-[#f7f8fa] text-gray-900">

      {/* SIDEBAR */}

      <aside className="fixed left-0 top-0 hidden h-screen w-64 border-r border-gray-200 bg-white lg:block">

        <div className="flex h-full flex-col p-5">

          {/* Profile */}

            <button
              type="button"
              onClick={() => router.push('/profile')}
              className="mb-7 flex w-full items-center gap-3 rounded-xl p-2 text-left transition hover:bg-gray-50"
            >

              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full text-sm font-semibold text-white"
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

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">
                  {user.name}
                </p>

                <p className="truncate text-xs text-gray-400">
                  {user.guestId}
                </p>
              </div>

            </button>

          {/* Workspace */}

          <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
            Workspace
          </p>

          <nav className="space-y-1">

            <button
              type="button"
              onClick={() => router.push('/')}
              className="w-full rounded-lg px-3 py-2.5 text-left text-sm text-gray-600 transition hover:bg-gray-100"
            >
              Tasks
            </button>

            <button
              type="button"
              className="w-full rounded-lg bg-gray-100 px-3 py-2.5 text-left text-sm font-semibold text-gray-900"
            >
              Projects
            </button>

          </nav>

          {/* Bottom menu */}

          <div className="mt-auto space-y-1 border-t border-gray-200 pt-4">

            <button
              type="button"
              onClick={() => router.push('/profile')}
              className="w-full rounded-lg px-3 py-2.5 text-left text-sm text-gray-600 hover:bg-gray-100"
            >
              Settings
            </button>

          </div>

        </div>

      </aside>

      {/* MAIN */}

      <section className="lg:ml-64">

        <div className="mx-auto max-w-[1400px] px-6 py-7 sm:px-8 lg:px-10">

          {/* Header */}

          <div className="flex flex-wrap items-center justify-between gap-4">

            <div>

              <h1 className="text-2xl font-bold tracking-tight">
                Projects
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Manage your projects and priorities.
              </p>

            </div>

            <button
              type="button"
              onClick={() => setShowAddProject(true)}
              className="rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800"
            >
              + Add Project
            </button>

          </div>

          {/* Toolbar */}

          <div className="mt-7 flex flex-wrap items-center justify-between gap-3">

            <div className="relative min-w-[240px] flex-1 sm:max-w-md">

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search projects..."
                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-gray-400"
              />

            </div>

            <div className="flex gap-2">

              <button
                type="button"
                className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50"
              >
                Fields
              </button>

              <button
                type="button"
                className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50"
              >
                Filter
              </button>

            </div>

          </div>

          {/* TABLE */}

          <section className="mt-5 overflow-hidden rounded-xl border border-gray-200 bg-white">

            <div className="grid grid-cols-[minmax(260px,1fr)_150px_180px_180px_70px] border-b border-gray-200 px-5 py-3 text-xs font-semibold text-gray-500">

              <div>Projects</div>
              <div>Priority</div>
              <div>Lead</div>
              <div>Due Date</div>
              <div />

            </div>

            {filteredProjects.map((project) => (

              <div
                key={project.id}
                className="grid min-h-[64px] grid-cols-[minmax(260px,1fr)_150px_180px_180px_70px] items-center border-b border-gray-100 px-5 transition hover:bg-gray-50"
              >

                <div className="text-sm font-medium text-gray-900">
                  {project.name}
                </div>

                <div>
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${priorityStyle(project.priority)}`}
                  >
                    {project.priority.charAt(0).toUpperCase() +
                      project.priority.slice(1)}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600">

                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-200 text-xs font-semibold">
                    {project.lead.charAt(0)}
                  </span>

                  {project.lead}

                </div>

                <div className="text-sm text-gray-500">
                  {project.dueDate}
                </div>

                  <div className="relative flex justify-center">

                    <button
                      type="button"
                      onClick={() =>
                        setOpenProjectMenu(
                          openProjectMenu === project.id
                            ? null
                            : project.id,
                        )
                      }
                      className="rounded-lg px-2 py-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                      aria-label="Project actions"
                    >
                      ⋯
                    </button>

                    {openProjectMenu === project.id && (
                      <div className="absolute right-0 top-9 z-20 w-32 rounded-xl border border-gray-200 bg-white p-1 shadow-lg">

                        <button
                          type="button"
                          className="w-full rounded-lg px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                          onClick={() => {
                            setOpenProjectMenu(null);
                              setEditingProject(project);
                              setShowEditProject(true);
                          }}
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          className="w-full rounded-lg px-3 py-2 text-left text-sm text-red-500 hover:bg-red-50"
                          onClick={async () => {
                            setOpenProjectMenu(null);
                            if (!user) return;

                            const confirmed = window.confirm(
                              'Are you sure you want to delete this project?',
                            );

                            if (!confirmed) return;

                            try {
                              await deleteProject(
                                project.id,
                                user._id,
                              );

                              setProjectList((current) =>
                                current.filter(
                                  (item) =>
                                    item.id !== project.id,
                                ),
                              );
                            } catch (error) {
                              console.error(error);
                              alert('Failed to delete project');
                            }
                          }}
                        >
                          Delete
                        </button>

                      </div>
                    )}

                  </div>

              </div>

            ))}

            {filteredProjects.length === 0 && (
              <div className="px-5 py-12 text-center text-sm text-gray-400">
                No projects found.
              </div>
            )}

            {/* Add Projects row */}

            <button
              type="button"
              onClick={() => setShowAddProject(true)}
              className="flex w-full items-center gap-2 px-5 py-4 text-left text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              <span className="text-lg">+</span>
              Add Projects
            </button>

          </section>

        </div>

      </section>

      {/* EDIT PROJECT MODAL */}

      {showEditProject && editingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">

          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">

            <div className="flex items-center justify-between">

              <div>
                <h2 className="text-lg font-semibold">
                  Edit Project
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Update project details.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowEditProject(false);
                  setEditingProject(null);
                }}
                className="rounded-lg px-2 py-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
              >
                ×
              </button>

            </div>

            <div className="mt-6 space-y-4">

              <div>
                <label className="text-xs font-medium text-gray-500">
                  Project name
                </label>

                <input
                  id="edit-project-name"
                  type="text"
                  defaultValue={editingProject.name}
                  className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-gray-400"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500">
                  Priority
                </label>

                <select
                  id="edit-project-priority"
                  defaultValue={editingProject.priority}
                  className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-gray-400"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500">
                  Lead
                </label>

                <input
                  id="edit-project-lead"
                  type="text"
                  defaultValue={editingProject.lead}
                  className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-gray-400"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500">
                  Due date
                </label>

                <input
                  id="edit-project-due-date"
                  type="date"
                  className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-gray-400"
                />
              </div>

            </div>

            <div className="mt-6 flex justify-end gap-2">

              <button
                type="button"
                onClick={() => {
                  setShowEditProject(false);
                  setEditingProject(null);
                }}
                className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={async () => {
                  if (!user || !editingProject) return;

                  const nameInput =
                    document.getElementById(
                      'edit-project-name',
                    ) as HTMLInputElement;

                  const priorityInput =
                    document.getElementById(
                      'edit-project-priority',
                    ) as HTMLSelectElement;

                  const leadInput =
                    document.getElementById(
                      'edit-project-lead',
                    ) as HTMLInputElement;

                  const dueDateInput =
                    document.getElementById(
                      'edit-project-due-date',
                    ) as HTMLInputElement;

                  if (!nameInput.value.trim()) {
                    nameInput.focus();
                    return;
                  }

                  try {
                    const updated = await updateProject(
                      editingProject.id,
                      user._id,
                      {
                        name: nameInput.value.trim(),
                        priority: priorityInput.value,
                        lead: leadInput.value.trim(),
                        dueDate: dueDateInput.value
                          ? new Date(
                              dueDateInput.value,
                            ).toISOString()
                          : undefined,
                      },
                    );

                    const updatedProject: Project = {
                      id: updated._id,
                      name: updated.name,
                      priority: updated.priority,
                      lead: updated.lead,
                      dueDate: updated.dueDate
                        ? new Date(
                            updated.dueDate,
                          ).toLocaleDateString(
                            'en-GB',
                            {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                            },
                          )
                        : '—',
                    };

                    setProjectList((current) =>
                      current.map((item) =>
                        item.id === updatedProject.id
                          ? updatedProject
                          : item,
                      ),
                    );

                    setShowEditProject(false);
                    setEditingProject(null);
                  } catch (error) {
                    console.error(error);
                    alert('Failed to update project');
                  }
                }}
                className="rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-800"
              >
                Save Changes
              </button>

            </div>

          </div>

        </div>
      )}

      {/* ADD PROJECT MODAL */}

      {showAddProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">

          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">

            <div className="flex items-center justify-between">

              <div>
                <h2 className="text-lg font-semibold">
                  Add Project
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Create a new project.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowAddProject(false)}
                className="rounded-lg px-2 py-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
              >
                ×
              </button>

            </div>

            <div className="mt-6 space-y-4">

              <div>
                <label className="text-xs font-medium text-gray-500">
                  Project name
                </label>

                <input
                  id="project-name"
                  type="text"
                  placeholder="Project name"
                  className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-gray-400"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500">
                  Priority
                </label>

                <select
                  id="project-priority"
                  defaultValue="medium"
                  className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-gray-400"
                >
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500">
                  Due date
                </label>

                <input
                  id="project-due-date"
                  type="date"
                  className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-gray-400"
                />
              </div>

            </div>

            <div className="mt-6 flex justify-end gap-2">

              <button
                type="button"
                onClick={() => setShowAddProject(false)}
                className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={async () => {
                  const nameInput = document.getElementById(
                    'project-name',
                  ) as HTMLInputElement;

                  const priorityInput = document.getElementById(
                    'project-priority',
                  ) as HTMLSelectElement;

                  const dueDateInput = document.getElementById(
                    'project-due-date',
                  ) as HTMLInputElement;

                  if (!nameInput.value.trim() || !user) {
                    nameInput.focus();
                    return;
                  }

                  try {
                    const createdProject =
                      await createProject({
                        name: nameInput.value.trim(),
                        priority:
                          priorityInput.value as Priority,
                        lead: user.name,
                        dueDate: dueDateInput.value
                          ? new Date(
                              dueDateInput.value,
                            ).toISOString()
                          : undefined,
                        userId: user._id,
                      });

                    const project: Project = {
                      id: createdProject._id,
                      name: createdProject.name,
                      priority: createdProject.priority,
                      lead: createdProject.lead,
                      dueDate: createdProject.dueDate
                        ? new Date(
                            createdProject.dueDate,
                          ).toLocaleDateString(
                            'en-GB',
                            {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                            },
                          )
                        : '—',
                    };

                    setProjectList((current) => [
                      ...current,
                      project,
                    ]);

                    setShowAddProject(false);
                  } catch (error) {
                    console.error(error);
                    alert('Failed to create project');
                  }
                }}
                className="rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-800"
              >
                Create Project
              </button>

            </div>

          </div>

        </div>
      )}

    </main>
  );
}
