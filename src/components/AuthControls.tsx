'use client';

import React from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { clerkEnabled } from '@/utils/auth';

/**
 * Dynamically loaded Clerk auth controls - client-side only to avoid SSG issues.
 */
const ClerkAuthControls = clerkEnabled
  ? dynamic(() => import('@/components/ClerkAuthControls'), { ssr: false })
  : null;

function FallbackAuthControls(): React.JSX.Element {
  return (
    <div className="flex items-center gap-2">
      <Link
        href="/sign-in"
        className="rounded-full border border-accent/20 bg-white px-4 py-2 text-sm font-medium text-accent transition-colors hover:bg-accent/5"
      >
        Log in
      </Link>
      <Link
        href="/sign-up"
        className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent-dark"
      >
        Sign up
      </Link>
    </div>
  );
}

export default function AuthControls(): React.JSX.Element {
  if (ClerkAuthControls) {
    return <ClerkAuthControls />;
  }

  return <FallbackAuthControls />;
}
