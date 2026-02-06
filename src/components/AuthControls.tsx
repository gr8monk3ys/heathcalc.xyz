'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function AuthControls() {
  const { user, isAuthenticated, signIn, signUp, signOut } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [showMenu, setShowMenu] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const resetForm = (): void => {
    setName('');
    setEmail('');
    setPassword('');
    setMessage('');
  };

  const openAuthModal = (nextMode: 'signin' | 'signup'): void => {
    setMode(nextMode);
    setShowModal(true);
    setShowMenu(false);
    resetForm();
  };

  const closeAuthModal = (): void => {
    setShowModal(false);
    resetForm();
  };

  const submitAuth = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    if (!email.trim() || !password.trim() || (mode === 'signup' && !name.trim())) {
      setMessage('Please complete all required fields.');
      return;
    }

    const result =
      mode === 'signin'
        ? signIn(email.trim(), password)
        : signUp(name.trim(), email.trim(), password);

    setMessage(result.message);

    if (result.success) {
      closeAuthModal();
    }
  };

  if (isAuthenticated && user) {
    return (
      <div className="relative">
        <button
          type="button"
          onClick={() => setShowMenu(prev => !prev)}
          className="flex items-center gap-2 rounded-full border border-accent/20 bg-white px-4 py-2 text-sm font-medium text-gray-800 transition-colors hover:bg-accent/5"
        >
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-accent text-xs font-semibold text-white">
            {user.name.slice(0, 1).toUpperCase()}
          </span>
          <span className="hidden sm:inline">{user.name}</span>
        </button>

        {showMenu && (
          <div className="absolute right-0 z-50 mt-2 w-56 rounded-xl border border-gray-200 bg-white p-2 shadow-lg">
            <div className="px-3 py-2 text-xs text-gray-500">Signed in as {user.email}</div>
            <Link
              href="/saved-results"
              className="block rounded-lg px-3 py-2 text-sm hover:bg-accent/5"
              onClick={() => setShowMenu(false)}
            >
              Saved results
            </Link>
            <button
              type="button"
              onClick={() => {
                signOut();
                setShowMenu(false);
              }}
              className="mt-1 w-full rounded-lg px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
            >
              Sign out
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => openAuthModal('signin')}
          className="rounded-full border border-accent/20 bg-white px-4 py-2 text-sm font-medium text-accent transition-colors hover:bg-accent/5"
        >
          Log in
        </button>
        <button
          type="button"
          onClick={() => openAuthModal('signup')}
          className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent-dark"
        >
          Sign up
        </button>
      </div>

      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          role="presentation"
        >
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold">
                {mode === 'signin' ? 'Sign in to save results' : 'Create your account'}
              </h2>
              <button
                type="button"
                onClick={closeAuthModal}
                className="rounded-full p-1 text-gray-500 hover:bg-gray-100"
                aria-label="Close authentication dialog"
              >
                ✕
              </button>
            </div>

            <div className="mb-4 flex rounded-full bg-gray-100 p-1">
              <button
                type="button"
                onClick={() => setMode('signin')}
                className={`flex-1 rounded-full px-3 py-2 text-sm font-medium ${
                  mode === 'signin' ? 'bg-white shadow' : 'text-gray-500'
                }`}
              >
                Sign in
              </button>
              <button
                type="button"
                onClick={() => setMode('signup')}
                className={`flex-1 rounded-full px-3 py-2 text-sm font-medium ${
                  mode === 'signup' ? 'bg-white shadow' : 'text-gray-500'
                }`}
              >
                Sign up
              </button>
            </div>

            <form className="space-y-3" onSubmit={submitAuth}>
              {mode === 'signup' && (
                <input
                  type="text"
                  value={name}
                  onChange={event => setName(event.target.value)}
                  placeholder="Name"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2"
                  autoComplete="name"
                />
              )}
              <input
                type="email"
                value={email}
                onChange={event => setEmail(event.target.value)}
                placeholder="Email"
                className="w-full rounded-lg border border-gray-200 px-3 py-2"
                autoComplete="email"
              />
              <input
                type="password"
                value={password}
                onChange={event => setPassword(event.target.value)}
                placeholder="Password"
                className="w-full rounded-lg border border-gray-200 px-3 py-2"
                autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
              />

              <p className="text-xs text-gray-500">
                Simple local auth: account data is stored in your browser on this device.
              </p>

              {message && <p className="text-sm text-red-600">{message}</p>}

              <button
                type="submit"
                className="w-full rounded-lg bg-accent px-4 py-2 font-semibold text-white hover:bg-accent-dark"
              >
                {mode === 'signin' ? 'Sign in' : 'Create account'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
