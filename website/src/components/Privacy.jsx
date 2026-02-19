import React, { useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const Privacy = () => {
  useEffect(() => {
    document.title = "Privacy Policy — DoomScrollingFix";
    return () => {
      document.title = "DoomScrollingFix — How to Stop Doomscrolling | Free Chrome Extension";
    };
  }, []);

  return (
    <div className="min-h-screen bg-background text-white">
      <div className="max-w-2xl mx-auto px-6 py-20">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors mb-12"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>

        <h1 className="text-3xl font-bold mb-2 tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-sm text-gray-500 mb-12">
          Last updated: February 16, 2026
        </p>

        <div className="space-y-10 text-gray-300 leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">
              The short version
            </h2>
            <p>
              DoomScrollingFix does not collect, store, transmit, or share any
              personal data. Everything stays on your device. There are no
              accounts, no analytics, no tracking, and no cloud sync. We have no
              servers that receive your data because there is nothing to receive.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">
              What data is stored
            </h2>
            <p className="mb-3">
              DoomScrollingFix stores the following data locally on your device
              using Chrome's <code className="text-sm bg-white/5 px-1.5 py-0.5 rounded">chrome.storage.local</code> API:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-400">
              <li>Your list of monitored websites (default: Twitter, Reddit, Instagram, TikTok, YouTube, Facebook)</li>
              <li>Re-prompt timer interval setting</li>
              <li>Optional password (stored locally, never transmitted)</li>
              <li>Time spent on each monitored site (in seconds)</li>
              <li>Number of interventions shown</li>
              <li>Timestamps of recent unlock events</li>
              <li>Intention log — what you typed when asked "What are you looking for?" (last 50 entries)</li>
            </ul>
            <p className="mt-3">
              All of this data lives exclusively in your browser's local storage.
              It is never sent anywhere. You can delete all of it at any time
              using the "Reset all settings" button in the extension dashboard.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">
              What data is NOT collected
            </h2>
            <ul className="list-disc list-inside space-y-2 text-gray-400">
              <li>Browsing history or page content</li>
              <li>Personal information (name, email, location)</li>
              <li>Cookies or tracking identifiers</li>
              <li>Analytics or usage telemetry</li>
              <li>Any data sent to external servers</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">
              Permissions explained
            </h2>
            <p className="mb-3">
              The extension requests the following Chrome permissions:
            </p>
            <ul className="space-y-3 text-gray-400">
              <li>
                <strong className="text-gray-200">storage</strong> — To save
                your settings and usage stats locally on your device.
              </li>
              <li>
                <strong className="text-gray-200">activeTab</strong> — To detect
                which site you're on and show the intervention overlay.
              </li>
              <li>
                <strong className="text-gray-200">alarms</strong> — To run
                periodic checks for the re-prompt timer.
              </li>
              <li>
                <strong className="text-gray-200">tabs</strong> — To update the
                extension badge with time-spent information.
              </li>
              <li>
                <strong className="text-gray-200">scripting</strong> — To
                dynamically register content scripts for custom domains you add
                beyond the defaults.
              </li>
              <li>
                <strong className="text-gray-200">host_permissions</strong> — Scoped
                to specific domains (Twitter, Reddit, Instagram, TikTok, YouTube,
                Facebook) so the content script can inject the intervention
                overlay on those sites only. Additional domains you add are
                covered by optional permissions granted on demand.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">
              Third-party services
            </h2>
            <p>
              DoomScrollingFix uses no third-party services, SDKs, analytics
              platforms, or external APIs. The extension operates entirely
              offline after installation.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">
              Changes to this policy
            </h2>
            <p>
              If this policy is ever updated, the changes will be posted on this
              page with an updated date. Given that we collect no data, material
              changes are unlikely.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Contact</h2>
            <p>
              Questions about this policy? Reach out at{" "}
              <a
                href="mailto:privacy@doomscrollingfix.com"
                className="text-white underline underline-offset-2 decoration-gray-600 hover:decoration-white transition-colors"
              >
                privacy@doomscrollingfix.com
              </a>
            </p>
          </section>
        </div>

        <div className="mt-16 pt-8 border-t border-white/[0.06] text-sm text-gray-600">
          DoomScrollingFix is made by Buffalo WebProducts.
        </div>
      </div>
    </div>
  );
};

export default Privacy;
