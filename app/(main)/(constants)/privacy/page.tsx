import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Privacy Policy | Lazyfolio",
  description: "Learn how Lazyfolio collects, uses, and protects your personal data when building your developer portfolio.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen py-16 sm:py-24 px-6 sm:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-(--lf-surface) border border-(--lf-border) rounded-full w-fit mb-10">
          <Link
            href="/terms"
            className="px-4 py-1.5 rounded-full text-xs font-medium text-(--lf-muted) hover:text-(--lf-ink) transition-colors"
          >
            Terms of Service
          </Link>
          <Link
            href="/privacy"
            className="px-4 py-1.5 rounded-full text-xs font-medium bg-(--lf-ink) text-(--lf-bg) transition-colors"
          >
            Privacy Policy
          </Link>
        </div>

        {/* Header */}
        <header className="border-b border-(--lf-border) pb-8 mb-12">
          <h1 className="font-serif-display text-4xl sm:text-5xl font-normal text-(--lf-ink) tracking-tight mb-3">
            Privacy Policy
          </h1>
          <p className="text-xs font-mono tracking-wider text-(--lf-sub) mb-6">
            Last updated: March 2025
          </p>
          <p className="text-base sm:text-lg text-(--lf-muted) leading-relaxed">
            At Lazyfolio, we believe building your portfolio shouldn't come at the cost of your privacy. We collect only what is necessary to run the platform and provide privacy-conscious analytics.
          </p>
        </header>

        {/* Document Content */}
        <main className="space-y-12 text-[0.95rem] text-(--lf-muted) leading-relaxed">
          <section className="space-y-3">
            <h2 className="font-serif-display text-2xl font-normal text-(--lf-ink)">
              1. Overview &amp; Philosophy
            </h2>
            <p>
              Lazyfolio operates the platform at <code className="bg-(--lf-surface) border border-(--lf-border) px-1.5 py-0.5 rounded font-mono text-xs text-(--lf-ink)">lazyfolio.in</code>, enabling developers and creators to publish portfolios, link trees, and technical blogs.
            </p>
            <p>
              Our philosophy is straightforward: your portfolio belongs to you. We do not sell your personal information to third parties, broker your data to advertisers, or track you across the web. The source code is open and verifiable on GitHub.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif-display text-2xl font-normal text-(--lf-ink)">
              2. Information We Collect
            </h2>
            <p>We collect information in three ways:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong className="text-(--lf-ink)">Account Details:</strong> When you sign up via OAuth (such as GitHub or Google), we receive your name, email address, third-party account ID, and avatar image. We do not receive or store your passwords.
              </li>
              <li>
                <strong className="text-(--lf-ink)">Profile Content:</strong> Content you voluntarily add to your portfolio, including your chosen username, bio, links, work history, projects, and articles.
              </li>
              <li>
                <strong className="text-(--lf-ink)">Aggregated Analytics:</strong> We use privacy-friendly analytics (via Umami) to calculate page views, geographic country data, and link clicks. This operates without tracking cookies and without logging individual IP addresses.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif-display text-2xl font-normal text-(--lf-ink)">
              3. How We Use Information
            </h2>
            <p>We use the data we collect solely to:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Host and render your public portfolio and published posts.</li>
              <li>Authenticate your identity and manage your dashboard session.</li>
              <li>Provide you with visitor statistics and metrics on your dashboard.</li>
              <li>Maintain platform integrity, prevent abuse, and fix technical issues.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif-display text-2xl font-normal text-(--lf-ink)">
              4. Third-Party Infrastructure
            </h2>
            <p>
              To maintain reliability and performance, we rely on trusted infrastructure providers:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong className="text-(--lf-ink)">Authentication:</strong> Better Auth with GitHub and Google OAuth for secure sign-in.</li>
              <li><strong className="text-(--lf-ink)">Media Storage:</strong> Cloudinary for hosting avatar and project images.</li>
              <li><strong className="text-(--lf-ink)">Database:</strong> Managed PostgreSQL for profile and content storage.</li>
              <li><strong className="text-(--lf-ink)">Analytics:</strong> Umami Analytics for cookieless, GDPR-compliant site metrics.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif-display text-2xl font-normal text-(--lf-ink)">
              5. Cookies &amp; Local Storage
            </h2>
            <p>We keep cookie usage to a minimum:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong className="text-(--lf-ink)">Essential Session Cookies:</strong> Required to keep you authenticated while using your dashboard.
              </li>
              <li>
                <strong className="text-(--lf-ink)">Preferences (Local Storage):</strong> Retains client-side preferences such as your dark/light theme setting.
              </li>
              <li>
                <strong className="text-(--lf-ink)">No Marketing Trackers:</strong> We do not use third-party advertising or retargeting cookies.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif-display text-2xl font-normal text-(--lf-ink)">
              6. Security &amp; Data Retention
            </h2>
            <p>
              We implement standard security controls, including HTTPS encryption in transit and secure database storage.
            </p>
            <p>
              Your data is retained as long as your account remains active. When you delete content or your account, it is immediately removed from public display and purged from our active database.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif-display text-2xl font-normal text-(--lf-ink)">
              7. Your Rights &amp; Deletion
            </h2>
            <p>
              You maintain complete ownership of your data. You can edit, update, or remove any portfolio content directly from your dashboard at any time. If you wish to delete your account entirely, you can do so from your settings or by contacting our maintainers.
            </p>
          </section>

          <section className="border-t border-(--lf-border) pt-8 space-y-3">
            <h2 className="font-serif-display text-2xl font-normal text-(--lf-ink)">
              8. Contact Us
            </h2>
            <p>
              If you have any questions or feedback regarding this Privacy Policy, please open an issue on our{' '}
              <Link
                href="https://github.com/Angshuman09/lazyfolio/issues"
                target="_blank"
                rel="noopener noreferrer"
                className="text-(--lf-ink) underline underline-offset-4 decoration-(--lf-border) hover:decoration-(--lf-ink) transition-colors"
              >
                GitHub Issues
              </Link>{' '}
              page or reach out on{' '}
              <Link
                href="https://x.com/angshuhere"
                target="_blank"
                rel="noopener noreferrer"
                className="text-(--lf-ink) underline underline-offset-4 decoration-(--lf-border) hover:decoration-(--lf-ink) transition-colors"
              >
                X (@angshuhere)
              </Link>.
            </p>
          </section>
        </main>
      </div>
    </div>
  );
}