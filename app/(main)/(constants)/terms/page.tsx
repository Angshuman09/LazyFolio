import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Terms of Service | Lazyfolio",
  description: "Read the Terms of Service governing your use of the Lazyfolio platform, username claiming, and content publishing.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen py-16 sm:py-24 px-6 sm:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-(--lf-surface) border border-(--lf-border) rounded-full w-fit mb-10">
          <Link
            href="/terms"
            className="px-4 py-1.5 rounded-full text-xs font-medium bg-(--lf-ink) text-(--lf-bg) transition-colors"
          >
            Terms of Service
          </Link>
          <Link
            href="/privacy"
            className="px-4 py-1.5 rounded-full text-xs font-medium text-(--lf-muted) hover:text-(--lf-ink) transition-colors"
          >
            Privacy Policy
          </Link>
        </div>

        {/* Header */}
        <header className="border-b border-(--lf-border) pb-8 mb-12">
          <h1 className="font-serif-display text-4xl sm:text-5xl font-normal text-(--lf-ink) tracking-tight mb-3">
            Terms of Service
          </h1>
          <p className="text-xs font-mono tracking-wider text-(--lf-sub) mb-6">
            Last updated: March 2025
          </p>
          <p className="text-base sm:text-lg text-(--lf-muted) leading-relaxed">
            These terms govern your access to and use of Lazyfolio. By accessing or using the platform, you agree to be bound by these terms. If you do not agree to these terms, you may not access or use the hosted service.
          </p>
        </header>

        {/* Document Content */}
        <main className="space-y-12 text-[0.95rem] text-(--lf-muted) leading-relaxed">
          <section className="space-y-3">
            <h2 className="font-serif-display text-2xl font-normal text-(--lf-ink)">
              1. Agreement to Terms
            </h2>
            <p>
              By accessing or using Lazyfolio (<strong className="text-(--lf-ink)">"the Service"</strong>), hosted at <code className="bg-(--lf-surface) border border-(--lf-border) px-1.5 py-0.5 rounded font-mono text-xs text-(--lf-ink)">lazyfolio.in</code>, you agree to these Terms of Service.
            </p>
            <p>
              Lazyfolio is both a hosted application and an open-source project. While the source code is made available under open-source terms, these Terms apply specifically to your access and use of our hosted cloud service.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif-display text-2xl font-normal text-(--lf-ink)">
              2. Accounts &amp; Username Rules
            </h2>
            <p>
              You register an account on Lazyfolio through supported third-party OAuth providers (such as GitHub or Google). You are responsible for safeguarding your credentials and maintaining the security of your account.
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong className="text-(--lf-ink)">First-Come, First-Served:</strong> Username handles are claimed on a first-come, first-served basis.
              </li>
              <li>
                <strong className="text-(--lf-ink)">Reserved Handles:</strong> Core platform routes such as <code className="bg-(--lf-surface) border border-(--lf-border) px-1.5 py-0.5 rounded font-mono text-xs text-(--lf-ink)">/dashboard</code>, <code className="bg-(--lf-surface) border border-(--lf-border) px-1.5 py-0.5 rounded font-mono text-xs text-(--lf-ink)">/templates</code>, <code className="bg-(--lf-surface) border border-(--lf-border) px-1.5 py-0.5 rounded font-mono text-xs text-(--lf-ink)">/terms</code>, and <code className="bg-(--lf-surface) border border-(--lf-border) px-1.5 py-0.5 rounded font-mono text-xs text-(--lf-ink)">/privacy</code> are reserved for platform functionality.
              </li>
              <li>
                <strong className="text-(--lf-ink)">Squatting &amp; Impersonation:</strong> Registering handles for trademark squatting, resale, or impersonating individuals or brands is prohibited. We reserve the right to reclaim or reassign infringing handles.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif-display text-2xl font-normal text-(--lf-ink)">
              3. User Content &amp; Ownership
            </h2>
            <p>
              You retain full ownership and copyright of all text, projects, articles, code snippets, logos, and images you publish on your profile.
            </p>
            <p>
              By publishing content on Lazyfolio, you grant us a worldwide, non-exclusive, royalty-free license to host, render, cache, and publicly display that content solely to operate and deliver the service to you and your visitors.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif-display text-2xl font-normal text-(--lf-ink)">
              4. Acceptable Use
            </h2>
            <p>
              You agree not to use Lazyfolio to engage in or facilitate any of the following activities:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Publishing malware, phishing pages, deceptive redirects, or unsolicited automated spam.</li>
              <li>Uploading unlawful content, hate speech, harassment, doxxing, or defamatory materials.</li>
              <li>Infringing on copyright, trademark, or other intellectual property rights of third parties.</li>
              <li>Attempting to compromise, exploit, excessively scrape, or interfere with platform infrastructure.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif-display text-2xl font-normal text-(--lf-ink)">
              5. Public Portfolio Visibility
            </h2>
            <p>
              Lazyfolio is designed to showcase your work publicly. Any profile data, projects, or blog posts marked as published are accessible to anyone on the internet, including search engines and web crawlers.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif-display text-2xl font-normal text-(--lf-ink)">
              6. Disclaimers &amp; Availability
            </h2>
            <p>
              The hosted Lazyfolio service is provided on an "as is" and "as available" basis, without warranties of any kind, whether express or implied.
            </p>
            <p>
              While we strive for high uptime and performance, we do not guarantee uninterrupted operation. Because Lazyfolio is open-source, you are always free to self-host the software on your own infrastructure.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif-display text-2xl font-normal text-(--lf-ink)">
              7. Limitation of Liability
            </h2>
            <p>
              To the maximum extent permitted by law, Lazyfolio, its maintainers, and contributors shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of or inability to use the service.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif-display text-2xl font-normal text-(--lf-ink)">
              8. Changes to These Terms
            </h2>
            <p>
              We may update these terms from time to time. Any changes will be reflected on this page with an updated date. Continued use of the platform after changes are posted constitutes acceptance of the revised terms.
            </p>
          </section>

          <section className="border-t border-(--lf-border) pt-8 space-y-3">
            <h2 className="font-serif-display text-2xl font-normal text-(--lf-ink)">
              9. Contact &amp; Questions
            </h2>
            <p>
              If you have any questions about these terms, please open an issue on our{' '}
              <Link
                href="https://github.com/Angshuman09/lazyfolio"
                target="_blank"
                rel="noopener noreferrer"
                className="text-(--lf-ink) underline underline-offset-4 decoration-(--lf-border) hover:decoration-(--lf-ink) transition-colors"
              >
                GitHub repository
              </Link>{' '}
              or review our{' '}
              <Link
                href="https://github.com/Angshuman09/lazyfolio/blob/main/CODE_OF_CONDUCT.md"
                target="_blank"
                rel="noopener noreferrer"
                className="text-(--lf-ink) underline underline-offset-4 decoration-(--lf-border) hover:decoration-(--lf-ink) transition-colors"
              >
                Code of Conduct
              </Link>.
            </p>
          </section>
        </main>
      </div>
    </div>
  );
}