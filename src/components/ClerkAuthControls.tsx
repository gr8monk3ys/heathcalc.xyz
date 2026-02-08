'use client';

import React from 'react';
import Link from 'next/link';
import { SignInButton, SignUpButton, UserButton, SignedIn, SignedOut } from '@clerk/nextjs';

/**
 * Auth controls that use Clerk components directly.
 * Must be rendered inside <ClerkProvider> and only on the client.
 */
export default function ClerkAuthControls(): React.JSX.Element {
  return (
    <>
      <SignedOut>
        <div className="flex items-center gap-2">
          <SignInButton mode="redirect">
            <button
              type="button"
              className="rounded-full border border-accent/20 bg-white px-4 py-2 text-sm font-medium text-accent transition-colors hover:bg-accent/5"
            >
              Log in
            </button>
          </SignInButton>
          <SignUpButton mode="redirect">
            <button
              type="button"
              className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent-dark"
            >
              Sign up
            </button>
          </SignUpButton>
        </div>
      </SignedOut>

      <SignedIn>
        <div className="flex items-center gap-2">
          <Link
            href="/saved-results"
            className="rounded-full border border-accent/20 bg-white px-4 py-2 text-sm font-medium text-accent transition-colors hover:bg-accent/5"
          >
            Saved results
          </Link>
          <UserButton afterSignOutUrl="/" />
        </div>
      </SignedIn>
    </>
  );
}
