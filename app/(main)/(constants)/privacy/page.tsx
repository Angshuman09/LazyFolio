import Link from 'next/link';
import { Metadata } from 'next';
import { 
  ShieldCheck, 
  Database, 
  Eye, 
  Cookie, 
  Lock, 
  Server, 
  Trash2, 
  HelpCircle,
  ArrowUpRight,
  FileText
} from 'lucide-react';
import { SECTIONS } from '@/lib/constants/sections';

export const metadata: Metadata = {
  title: "Privacy Policy | Lazyfolio",
  description: "Learn how Lazyfolio collects, uses, and protects your personal data when building your developer portfolio.",
};

export default function PrivacyPage() {

  return (
    <div className="min-h-screen py-12 md:py-20 px-6 md:px-12 max-w-7xl mx-auto">
      <div className="relative mb-16 rounded-3xl border border-(--lf-border) bg-(--lf-surface) p-8 md:p-14 overflow-hidden shadow-sm">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-(--lf-border) bg-(--lf-bg) text-[0.75rem] font-semibold tracking-wider text-(--lf-muted) uppercase mb-6">
            Legal & Transparency
          </div>
          
          <h1 className="font-serif-display text-4xl md:text-6xl font-normal text-(--lf-ink) tracking-tight mb-6 leading-tight">
            Privacy Policy
          </h1>
          
          <p className="text-base md:text-lg text-(--lf-muted) font-sans-body leading-relaxed mb-6">
            At Lazyfolio, we believe building your portfolio shouldn't cost your privacy. We collect only what is strictly necessary to host your public profile and run privacy-conscious analytics.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <aside className="lg:col-span-4 hidden lg:block">
          <div className="sticky top-28 space-y-2 p-6 rounded-2xl border border-(--lf-border) bg-(--lf-surface)">
            <p className="text-xs font-semibold uppercase tracking-widest text-(--lf-sub) mb-4 px-2">
              On This Page
            </p>
            <nav className="flex flex-col space-y-1">
              {SECTIONS.map((sec) => {
                const Icon = sec.icon;
                return (
                  <a
                    key={sec.id}
                    href={`#${sec.id}`}
                    className="flex items-center gap-3 px-3 py-2.5 text-xs font-medium text-(--lf-muted) hover:text-(--lf-ink) hover:bg-(--lf-bg) rounded-xl transition-all group"
                  >
                    <Icon className="w-4 h-4 text-(--lf-sub) group-hover:text-(--lf-ink) transition-colors" />
                    <span>{sec.label}</span>
                  </a>
                );
              })}
            </nav>

            <div className="pt-6 mt-6 border-t border-(--lf-border) px-2">
              <p className="text-xs text-(--lf-sub) mb-3">Looking for terms of service?</p>
              <Link
                href="/terms"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-(--lf-ink) hover:underline underline-offset-4"
              >
                Read Terms of Service <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </aside>

        <main className="lg:col-span-8 space-y-12">
          <section id="overview" className="scroll-mt-28 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl border border-(--lf-border) bg-(--lf-surface) text-(--lf-ink)">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h2 className="font-serif-display text-2xl md:text-3xl font-normal text-(--lf-ink)">
                1. Overview &amp; Philosophy
              </h2>
            </div>
            <div className="p-6 md:p-8 rounded-2xl border border-(--lf-border) bg-(--lf-surface) space-y-4 text-sm text-(--lf-muted) leading-relaxed">
              <p>
                Lazyfolio (<strong className="text-(--lf-ink)">"we", "us", or "our"</strong>) operates the platform accessible at <code className="bg-(--lf-bg) px-2 py-0.5 rounded text-(--lf-ink) font-mono text-xs">lazyfolio.in</code> and related services. Lazyfolio allows creators, engineers, and designers to quickly publish developer portfolios, personal link pages, and blogs.
              </p>
              <p>
                Our core philosophy is simple: <strong className="text-(--lf-ink)">your portfolio belongs to you</strong>. We do not monetize your personal information, sell data to third-party ad brokers, or track you across the web. The code for Lazyfolio is open-source and transparently available for community audit on GitHub.
              </p>
            </div>
          </section>

          <section id="data-collection" className="scroll-mt-28 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl border border-(--lf-border) bg-(--lf-surface) text-(--lf-ink)">
                <Database className="w-5 h-5" />
              </div>
              <h2 className="font-serif-display text-2xl md:text-3xl font-normal text-(--lf-ink)">
                2. Information We Collect
              </h2>
            </div>
            <div className="p-6 md:p-8 rounded-2xl border border-(--lf-border) bg-(--lf-surface) space-y-6 text-sm text-(--lf-muted) leading-relaxed">
              <div>
                <h3 className="font-semibold text-(--lf-ink) text-base mb-2">A. Account &amp; Authentication Data</h3>
                <p>
                  When you sign up using OAuth providers (such as GitHub or Google), we receive basic authentication details: your name, primary email address, account ID, and profile picture avatar. We do not receive or store your third-party account passwords.
                </p>
              </div>

              <div className="pt-4 border-t border-(--lf-border)">
                <h3 className="font-semibold text-(--lf-ink) text-base mb-2">B. Profile &amp; Portfolio Content</h3>
                <p>
                  Information you voluntarily provide when creating your Lazyfolio profile, including:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1.5 pl-2 text-(--lf-muted)">
                  <li>Claimed username (e.g., <code className="bg-(--lf-bg) px-1.5 py-0.5 rounded font-mono text-xs text-(--lf-ink)">lazyfolio.in/yourname</code>)</li>
                  <li>Bio, job titles, location, and social links (GitHub, X/Twitter, LinkedIn, personal website)</li>
                  <li>Work experience, projects, skills, and code snippets</li>
                  <li>Blog articles, drafts, and published posts</li>
                  <li>Custom images and assets uploaded to your portfolio</li>
                </ul>
              </div>

              <div className="pt-4 border-t border-(--lf-border)">
                <h3 className="font-semibold text-(--lf-ink) text-base mb-2">C. Privacy-Preserving Public Analytics</h3>
                <p>
                  To provide you with visitor insights on your public portfolio, we use privacy-focused analytics (via Umami). We collect aggregated statistics such as page views, country-level geography, browser device types, and clicked external links. This data is collected without storing personal IP addresses or creating persistent user tracking profiles.
                </p>
              </div>
            </div>
          </section>

          <section id="data-usage" className="scroll-mt-28 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl border border-(--lf-border) bg-(--lf-surface) text-(--lf-ink)">
                <Eye className="w-5 h-5" />
              </div>
              <h2 className="font-serif-display text-2xl md:text-3xl font-normal text-(--lf-ink)">
                3. How We Use Your Data
              </h2>
            </div>
            <div className="p-6 md:p-8 rounded-2xl border border-(--lf-border) bg-(--lf-surface) space-y-4 text-sm text-(--lf-muted) leading-relaxed">
              <p>We use the collected information exclusively to:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-(--lf-bg) border border-(--lf-border) space-y-1">
                  <span className="font-semibold text-(--lf-ink) block">Host &amp; Deliver Profiles</span>
                  <span className="text-xs">Render your portfolio, blog posts, and public links across web browsers globally.</span>
                </div>
                <div className="p-4 rounded-xl bg-(--lf-bg) border border-(--lf-border) space-y-1">
                  <span className="font-semibold text-(--lf-ink) block">Authentication &amp; Security</span>
                  <span className="text-xs">Verify your legal identity and session when managing your account dashboard.</span>
                </div>
                <div className="p-4 rounded-xl bg-(--lf-bg) border border-(--lf-border) space-y-1">
                  <span className="font-semibold text-(--lf-ink) block">Dashboard Analytics</span>
                  <span className="text-xs">Show you total visitor counts, popular blog posts, and link click trends.</span>
                </div>
                <div className="p-4 rounded-xl bg-(--lf-bg) border border-(--lf-border) space-y-1">
                  <span className="font-semibold text-(--lf-ink) block">Platform Maintenance</span>
                  <span className="text-xs">Prevent platform abuse, spam, broken routes, and security vulnerabilities.</span>
                </div>
              </div>
            </div>
          </section>

          <section id="third-parties" className="scroll-mt-28 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl border border-(--lf-border) bg-(--lf-surface) text-(--lf-ink)">
                <Server className="w-5 h-5" />
              </div>
              <h2 className="font-serif-display text-2xl md:text-3xl font-normal text-(--lf-ink)">
                4. Third-Party Infrastructure &amp; Services
              </h2>
            </div>
            <div className="p-6 md:p-8 rounded-2xl border border-(--lf-border) bg-(--lf-surface) space-y-4 text-sm text-(--lf-muted) leading-relaxed">
              <p>
                To provide high availability and fast response times, Lazyfolio relies on trusted third-party service providers. Data processed by these providers is governed by their respective privacy commitments:
              </p>
              
              <div className="space-y-3 pt-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl bg-(--lf-bg) border border-(--lf-border) gap-2">
                  <div>
                    <strong className="text-(--lf-ink)">Better Auth / OAuth Providers</strong>
                    <p className="text-xs text-(--lf-sub)">GitHub and Google for secure identity verification.</p>
                  </div>
                  <span className="text-xs font-mono text-(--lf-muted) bg-(--lf-surface) px-2.5 py-1 rounded-md border border-(--lf-border) w-fit">Authentication</span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl bg-(--lf-bg) border border-(--lf-border) gap-2">
                  <div>
                    <strong className="text-(--lf-ink)">Cloudinary</strong>
                    <p className="text-xs text-(--lf-sub)">Secure media storage for user avatar images and uploaded project banners.</p>
                  </div>
                  <span className="text-xs font-mono text-(--lf-muted) bg-(--lf-surface) px-2.5 py-1 rounded-md border border-(--lf-border) w-fit">Media CDN</span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl bg-(--lf-bg) border border-(--lf-border) gap-2">
                  <div>
                    <strong className="text-(--lf-ink)">PostgreSQL Database Provider</strong>
                    <p className="text-xs text-(--lf-sub)">Encrypted storage for structured user profile data and blog posts.</p>
                  </div>
                  <span className="text-xs font-mono text-(--lf-muted) bg-(--lf-surface) px-2.5 py-1 rounded-md border border-(--lf-border) w-fit">Database</span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl bg-(--lf-bg) border border-(--lf-border) gap-2">
                  <div>
                    <strong className="text-(--lf-ink)">Umami Analytics</strong>
                    <p className="text-xs text-(--lf-sub)">Cookieless, GDPR-compliant site analytics for visitor metrics.</p>
                  </div>
                  <span className="text-xs font-mono text-(--lf-muted) bg-(--lf-surface) px-2.5 py-1 rounded-md border border-(--lf-border) w-fit">Analytics</span>
                </div>
              </div>
            </div>
          </section>

          <section id="cookies" className="scroll-mt-28 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl border border-(--lf-border) bg-(--lf-surface) text-(--lf-ink)">
                <Cookie className="w-5 h-5" />
              </div>
              <h2 className="font-serif-display text-2xl md:text-3xl font-normal text-(--lf-ink)">
                5. Cookies &amp; Local Storage
              </h2>
            </div>
            <div className="p-6 md:p-8 rounded-2xl border border-(--lf-border) bg-(--lf-surface) space-y-4 text-sm text-(--lf-muted) leading-relaxed">
              <p>
                We keep cookie usage to an absolute minimum.
              </p>
              <ul className="list-disc list-inside space-y-2 pl-2">
                <li><strong className="text-(--lf-ink)">Strictly Necessary Session Cookies:</strong> Used exclusively to maintain your logged-in session state when you navigate the dashboard.</li>
                <li><strong className="text-(--lf-ink)">Preferences (Local Storage):</strong> Stores client-side UI choices such as your light/dark theme preference.</li>
                <li><strong className="text-(--lf-ink)">No Marketing/Ad Trackers:</strong> We do not place third-party advertising cookies or cross-site tracking scripts on your device.</li>
              </ul>
            </div>
          </section>

          <section id="data-security" className="scroll-mt-28 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl border border-(--lf-border) bg-(--lf-surface) text-(--lf-ink)">
                <Lock className="w-5 h-5" />
              </div>
              <h2 className="font-serif-display text-2xl md:text-3xl font-normal text-(--lf-ink)">
                6. Security &amp; Data Retention
              </h2>
            </div>
            <div className="p-6 md:p-8 rounded-2xl border border-(--lf-border) bg-(--lf-surface) space-y-4 text-sm text-(--lf-muted) leading-relaxed">
              <p>
                We implement modern industry-standard security controls including HTTPS transport layer encryption, secure database queries, and tokenized session authorization.
              </p>
              <p>
                We retain your account data and portfolio content for as long as your account remains active. If you delete content or your account, it is immediately unlinked from public access and removed from our active database.
              </p>
            </div>
          </section>

          <section id="user-rights" className="scroll-mt-28 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl border border-(--lf-border) bg-(--lf-surface) text-(--lf-ink)">
                <Trash2 className="w-5 h-5" />
              </div>
              <h2 className="font-serif-display text-2xl md:text-3xl font-normal text-(--lf-ink)">
                7. Your Rights &amp; Account Deletion
              </h2>
            </div>
            <div className="p-6 md:p-8 rounded-2xl border border-(--lf-border) bg-(--lf-surface) space-y-4 text-sm text-(--lf-muted) leading-relaxed">
              <p>You maintain full authority over your data:</p>
              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-(--lf-bg) border border-(--lf-border)">
                  <strong className="text-(--lf-ink) block mb-1">Access &amp; Edit</strong>
                  <span>You can update your username, bio, projects, links, and blog posts at any time directly through your dashboard.</span>
                </div>
                <div className="p-4 rounded-xl bg-(--lf-bg) border border-(--lf-border)">
                  <strong className="text-(--lf-ink) block mb-1">Account &amp; Content Erasure</strong>
                  <span>If you wish to permanently delete your Lazyfolio profile and all associated data, you can initiate account deletion within your profile settings or reach out directly to our repository maintainer.</span>
                </div>
              </div>
            </div>
          </section>

          <section id="contact" className="scroll-mt-28 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl border border-(--lf-border) bg-(--lf-surface) text-(--lf-ink)">
                <HelpCircle className="w-5 h-5" />
              </div>
              <h2 className="font-serif-display text-2xl md:text-3xl font-normal text-(--lf-ink)">
                8. Contact Us &amp; Open Source
              </h2>
            </div>
            <div className="p-6 md:p-8 rounded-2xl border border-(--lf-border) bg-(--lf-surface) space-y-4 text-sm text-(--lf-muted) leading-relaxed">
              <p>
                As an open-source project, we welcome community feedback, questions, and auditing. If you have privacy questions or wish to report an issue:
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <Link
                  href="https://github.com/Angshuman09/lazyfolio/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-(--lf-ink) text-(--lf-bg) text-xs font-semibold hover:opacity-90 transition-opacity"
                >
                  <FileText className="w-4 h-4" /> Open GitHub Issue
                </Link>
                <Link
                  href="https://x.com/angshuhere"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-(--lf-border) bg-(--lf-bg) text-(--lf-ink) text-xs font-semibold hover:bg-(--lf-border) transition-colors"
                >
                  Contact Maintainer (@angshuhere)
                </Link>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}