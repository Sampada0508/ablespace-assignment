'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  _id: string;
  name: string;
  guestId: string;
}

export default function ProfilePage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [theme, setTheme] = useState('blue');
  const [editingEmail, setEditingEmail] = useState(false);
  const [email, setEmail] = useState('');
  const [editingName, setEditingName] = useState(false);
  const [name, setName] = useState('');
  const [editingUsername, setEditingUsername] = useState(false);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');

    const themeColors: Record<string, string> = {
      amber: '#f59e0b',
      blue: '#3b82f6',
      pink: '#ec4899',
      rose: '#f43f5e',
      emerald: '#10b981',
      black: '#111827',
    };

    if (savedTheme && themeColors[savedTheme]) {
      setTheme(savedTheme);
      document.documentElement.style.setProperty(
        '--theme-primary',
        themeColors[savedTheme],
      );
    }

    const savedUser = localStorage.getItem('user');

    if (!savedUser) {
      router.push('/');
      return;
    }

    try {
      const parsedUser: User = JSON.parse(savedUser);
      setUser(parsedUser);
      setEmail(parsedUser.guestId);
      setName(parsedUser.name);
      setUsername(
        localStorage.getItem('username') || parsedUser.guestId,
      );

      const savedAvatar = localStorage.getItem('profileAvatar');

      if (savedAvatar) {
        setAvatarUrl(savedAvatar);
      }
    } catch {
      localStorage.removeItem('user');
      router.push('/');
    }
  }, [router]);

  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f8fa]">
        <p className="text-sm text-gray-500">Loading...</p>
      </main>
    );
  }

  const avatar = user.name.charAt(0).toUpperCase();

  function handleAvatarChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file.');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert('Please choose an image smaller than 2MB.');
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const result = reader.result;

      if (typeof result === 'string') {
        setAvatarUrl(result);
        localStorage.setItem('profileAvatar', result);
      }
    };

    reader.readAsDataURL(file);
  }

  return (
    <main className="min-h-screen bg-[#f7f8fa] text-gray-900">

      {/* SIDEBAR */}

      <aside className="fixed left-0 top-0 hidden h-screen w-64 border-r border-gray-200 bg-white lg:block">

        <div className="flex h-full flex-col px-5 py-6">

          {/* Back */}

          <button
            type="button"
            onClick={() => router.push('/')}
            className="mb-8 flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100 hover:text-gray-900"
          >
            <span className="text-base">←</span>
            Back to app
          </button>

          {/* Search */}

          <div className="relative mb-6">

            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              ⌕
            </span>

            <input
              type="text"
              placeholder="Search"
              className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-gray-400"
            />

          </div>

          {/* Settings navigation */}

          <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
            Settings
          </p>

          <nav className="space-y-1">

            <button
              type="button"
              className="flex w-full items-center gap-3 rounded-lg bg-gray-100 px-3 py-2.5 text-left text-sm font-semibold text-gray-900"
            >
              <span className="text-gray-500">♙</span>
              Profile
            </button>

              <button
                type="button"
                onClick={() => setShowThemeMenu((current) => !current)}
                className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm text-gray-600 transition hover:bg-gray-100"
              >
                <span className="flex items-center gap-3">
                  <span className="text-gray-400">☼</span>
                  Theme
                </span>

                <span className="text-gray-400">
                  {showThemeMenu ? '⌃' : '›'}
                </span>
              </button>

              {showThemeMenu && (
                <div className="mt-1 rounded-lg border border-gray-200 bg-white p-2 shadow-lg">

                  {[
                    ['amber', 'Amber', '#f59e0b'],
                    ['blue', 'Blue', '#3b82f6'],
                    ['pink', 'Pink', '#ec4899'],
                    ['rose', 'Rose', '#f43f5e'],
                    ['emerald', 'Emerald', '#10b981'],
                    ['black', 'Black', '#111827'],
                  ].map(([id, label, color]) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => {
                        setTheme(id);
                        localStorage.setItem('theme', id);
                        document.documentElement.style.setProperty(
                          '--theme-primary',
                          color,
                        );
                        setShowThemeMenu(false);
                      }}
                      className="flex w-full items-center justify-between rounded-lg px-2 py-2 text-sm text-gray-600 hover:bg-gray-50"
                    >
                      <span className="flex items-center gap-2">
                        <span
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: color }}
                        />
                        {label}
                      </span>

                      {theme === id && (
                        <span className="font-semibold">✓</span>
                      )}
                    </button>
                  ))}

                </div>
              )}

              <button
                type="button"
                onClick={() => {
                  const colors = [
                    '#3b82f6',
                    '#10b981',
                    '#f59e0b',
                    '#ec4899',
                    '#f43f5e',
                    '#8b5cf6',
                    '#111827',
                  ];

                  const current =
                    localStorage.getItem('accentColor') ||
                    '#3b82f6';

                  const currentIndex =
                    colors.indexOf(current);

                  const nextColor =
                    colors[
                      (currentIndex + 1) % colors.length
                    ];

                  localStorage.setItem(
                    'accentColor',
                    nextColor,
                  );

                  document.documentElement.style.setProperty(
                    '--theme-primary',
                    nextColor,
                  );
                }}
                className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm text-gray-600 transition hover:bg-gray-100"
              >
                <span className="flex items-center gap-3">
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{
                      backgroundColor:
                        'var(--theme-primary)',
                    }}
                  />
                  Color
                </span>

                <span className="text-xs text-gray-400">
                  Change
                </span>
              </button>

          </nav>


        </div>

      </aside>

      {/* MAIN */}

      <section className="lg:ml-64">

        <div className="mx-auto max-w-5xl px-6 py-6 sm:px-10 lg:px-14">

          {/* HEADER */}

          <div className="mb-8">

            <p className="mb-2 text-sm text-gray-400">
              Settings
            </p>

            <div className="flex items-center gap-5">

              <label
                htmlFor="profile-avatar-upload"
                className="group relative flex h-20 w-20 cursor-pointer items-center justify-center overflow-hidden rounded-full text-2xl font-semibold text-white shadow-sm"
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
                  avatar
                )}

                <span className="absolute inset-0 flex items-center justify-center bg-black/40 text-xs font-medium text-white opacity-0 transition group-hover:opacity-100">
                  Change
                </span>

                <input
                  id="profile-avatar-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />

              </label>

              <div>
                <h1 className="text-3xl font-bold tracking-tight">
                  Profile
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                  Manage your personal information and workspace access.
                </p>
              </div>

            </div>

          </div>

          {/* PROFILE */}

          <section>

            <h2 className="mb-4 text-lg font-semibold">
              Personal information
            </h2>

            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">

              {/* Profile picture */}

              <div className="flex min-h-[82px] items-center justify-between border-b border-gray-100 px-6 py-5 sm:px-8">

                <div>
                  <p className="text-sm font-medium">
                    Profile picture
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    Your workspace avatar
                  </p>
                </div>

                <div
                  className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full text-sm font-semibold text-white"
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
                    avatar
                  )}
                </div>

              </div>

                {/* Email */}

                <div className="flex min-h-[82px] items-center justify-between border-b border-gray-100 px-6 py-5 sm:px-8">

                  <div>
                    <p className="text-sm font-medium">
                      Email
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      Your account email
                    </p>
                  </div>

                  <div className="flex items-center gap-2">

                    {editingEmail ? (
                      <>
                        <input
                          type="text"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          autoFocus
                          className="w-48 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none focus:border-gray-400"
                        />

                        <button
                          type="button"
                          onClick={() => {
                            const updatedUser = {
                              ...user,
                              guestId: email,
                            };

                            setUser(updatedUser);
                            localStorage.setItem(
                              'user',
                              JSON.stringify(updatedUser),
                            );
                            setEditingEmail(false);
                          }}
                          className="rounded-lg px-3 py-2 text-sm font-medium text-white"
                          style={{
                            backgroundColor: 'var(--theme-primary)',
                          }}
                        >
                          Save
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setEmail(user.guestId);
                            setEditingEmail(false);
                          }}
                          className="rounded-lg px-3 py-2 text-sm text-gray-500 hover:bg-gray-100"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <span className="rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-600">
                          {user.guestId}
                        </span>

                        <button
                          type="button"
                          onClick={() => setEditingEmail(true)}
                          className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                          aria-label="Edit email"
                        >
                          ✎
                        </button>
                      </>
                    )}

                  </div>

                </div>

                {/* Full name */}

                <div className="flex min-h-[82px] items-center justify-between border-b border-gray-100 px-6 py-5 sm:px-8">

                  <div>
                    <p className="text-sm font-medium">
                      Full name
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      Your display name
                    </p>
                  </div>

                  <div className="flex items-center gap-2">

                    {editingName ? (
                      <>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          autoFocus
                          className="w-56 rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-700 outline-none focus:border-gray-400"
                        />

                        <button
                          type="button"
                          onClick={() => {
                            const updatedUser = {
                              ...user,
                              name: name.trim() || user.name,
                            };

                            setUser(updatedUser);
                            localStorage.setItem(
                              'user',
                              JSON.stringify(updatedUser),
                            );
                            setName(updatedUser.name);
                            setEditingName(false);
                          }}
                          className="rounded-lg px-3 py-2 text-sm font-medium text-white"
                          style={{
                            backgroundColor: 'var(--theme-primary)',
                          }}
                        >
                          Save
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setName(user.name);
                            setEditingName(false);
                          }}
                          className="rounded-lg px-3 py-2 text-sm text-gray-500 hover:bg-gray-100"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="w-56 rounded-lg border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-600">
                          {user.name}
                        </div>

                        <button
                          type="button"
                          onClick={() => setEditingName(true)}
                          className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                          aria-label="Edit full name"
                        >
                          ✎
                        </button>
                      </>
                    )}

                  </div>

                </div>

              {/* Title */}

              <div className="flex min-h-[82px] items-center justify-between border-b border-gray-100 px-6 py-5 sm:px-8">

                <div>
                  <p className="text-sm font-medium">
                    Title
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    Your job title or role
                  </p>
                </div>

                <div className="w-56 rounded-lg border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-500">
                  Designer
                </div>

              </div>

                {/* Username */}

                <div className="flex min-h-[82px] items-center justify-between px-6 py-5 sm:px-8">

                  <div>
                    <p className="text-sm font-medium">
                      Username
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      One word, like a nickname or first name
                    </p>
                  </div>

                  <div className="flex items-center gap-2">

                    {editingUsername ? (
                      <>
                        <input
                          type="text"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          autoFocus
                          className="w-56 rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-700 outline-none focus:border-gray-400"
                        />

                        <button
                          type="button"
                          onClick={() => {
                            const newUsername =
                              username.trim() || user.guestId;

                            setUsername(newUsername);
                            localStorage.setItem(
                              'username',
                              newUsername,
                            );
                            setEditingUsername(false);
                          }}
                          className="rounded-lg px-3 py-2 text-sm font-medium text-white"
                          style={{
                            backgroundColor: 'var(--theme-primary)',
                          }}
                        >
                          Save
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setUsername(
                              localStorage.getItem('username') ||
                                user.guestId,
                            );
                            setEditingUsername(false);
                          }}
                          className="rounded-lg px-3 py-2 text-sm text-gray-500 hover:bg-gray-100"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="w-56 rounded-lg border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-500">
                          {username}
                        </div>

                        <button
                          type="button"
                          onClick={() => setEditingUsername(true)}
                          className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                          aria-label="Edit username"
                        >
                          ✎
                        </button>
                      </>
                    )}

                  </div>

                </div>

            </div>

          </section>

          {/* WORKSPACE ACCESS */}

          <section className="mt-10">

            <h2 className="mb-4 text-lg font-semibold">
              Workspace access
            </h2>

            <div className="flex flex-col gap-5 rounded-2xl border border-gray-200 bg-white px-6 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-8">

              <div>

                <p className="text-sm font-medium">
                  Leave workspace
                </p>

                <p className="mt-1 text-sm text-gray-400">
                  Remove yourself from the workspace.
                </p>

              </div>

              <button
                type="button"
                className="rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-500 transition hover:bg-red-100"
                onClick={() => {
                  const confirmed = window.confirm(
                    'Are you sure you want to leave the workspace?',
                  );

                  if (confirmed) {
                    localStorage.removeItem('user');
                    router.push('/');
                  }
                }}
              >
                Leave Workspace
              </button>

            </div>

          </section>

        </div>

      </section>

    </main>
  );
}
