'use client';

import { useState } from 'react';
import { createGuest } from '@/lib/api';

interface GuestLoginProps {
  onLogin: (user: {
    _id: string;
    name: string;
    guestId: string;
  }) => void;
}

export default function GuestLogin({ onLogin }: GuestLoginProps) {
  const [guestId, setGuestId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleLogin() {
    if (!guestId.trim()) {
      setError('Please enter a guest ID.');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const user = await createGuest(guestId.trim());

      localStorage.setItem('user', JSON.stringify(user));

      onLogin(user);
    } catch {
      setError('Unable to sign in. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7f8fa] px-6">
      <div className="w-full max-w-md rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            AbleSpace
          </h1>

          <p className="mt-2 text-gray-500">
            Your simple task management workspace.
          </p>
        </div>

        <div>
          <label
            htmlFor="guestId"
            className="text-sm font-medium text-gray-700"
          >
            Guest ID
          </label>

          <input
            id="guestId"
            value={guestId}
            onChange={(event) => setGuestId(event.target.value)}
            placeholder="Enter your guest ID"
            className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-gray-400"
          />

          {error && (
            <p className="mt-2 text-sm text-red-500">
              {error}
            </p>
          )}

          <button
            onClick={handleLogin}
            disabled={loading}
            className="mt-5 w-full rounded-xl bg-black px-5 py-3 font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Continue as Guest'}
          </button>
        </div>
      </div>
    </main>
  );
}