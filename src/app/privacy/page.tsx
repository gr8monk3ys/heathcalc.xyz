import React from 'react';

export const metadata = {
  title: 'Privacy Policy | HealthCheck',
  description: 'HealthCheck privacy policy - how we handle your data and protect your privacy.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="mb-6 text-3xl font-bold">Privacy Policy</h1>

      <div className="neumorph mb-8 rounded-lg p-6">
        <p className="mb-4">
          <strong>Last Updated:</strong> February 6, 2026
        </p>
        <p>
          HealthCheck is designed to minimize personal data collection. Most calculator
          functionality runs directly in your browser.
        </p>
      </div>

      <div className="neumorph mb-8 rounded-lg p-6">
        <h2 className="mb-4 text-2xl font-semibold">What We Collect</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li>
            <strong>Calculator inputs/results:</strong> processed client-side in your browser.
          </li>
          <li>
            <strong>Optional account data:</strong> if you use our simple sign-in feature, your
            name, email, and password are stored in your browser&apos;s local storage on that
            device.
          </li>
          <li>
            <strong>Usage analytics:</strong> we may collect aggregate site usage data (e.g., page
            views, browser type, approximate location by IP) through analytics providers.
          </li>
        </ul>
      </div>

      <div className="neumorph mb-8 rounded-lg p-6">
        <h2 className="mb-4 text-2xl font-semibold">How We Use Information</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li>To provide calculators and show results.</li>
          <li>To allow signed-in users to save calculator results for later.</li>
          <li>To improve website reliability, performance, and content quality.</li>
        </ul>
      </div>

      <div className="neumorph mb-8 rounded-lg p-6">
        <h2 className="mb-4 text-2xl font-semibold">Storage and Security</h2>
        <p className="mb-3">
          Saved results and simple account credentials are currently stored locally in your browser.
          This is a lightweight authentication approach and should not be treated like
          enterprise-grade account security.
        </p>
        <p>
          If you share a device, other users of that browser profile may access locally stored
          account and saved result data.
        </p>
      </div>

      <div className="neumorph mb-8 rounded-lg p-6">
        <h2 className="mb-4 text-2xl font-semibold">Third-Party Services</h2>
        <p>
          We may use third-party analytics and advertising tools. Their handling of data is governed
          by their own privacy policies.
        </p>
      </div>

      <div className="neumorph rounded-lg p-6">
        <h2 className="mb-4 text-2xl font-semibold">Contact</h2>
        <p>Questions about this policy: info@heathcheck.info</p>
      </div>
    </div>
  );
}
