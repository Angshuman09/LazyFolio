import Link from 'next/link';
import { Metadata } from 'next';
import { 
  FileText, 
  UserCheck, 
  ShieldAlert, 
  Copyright, 
  Globe, 
  Scale, 
  AlertTriangle, 
  HelpCircle,
  ArrowUpRight,
} from 'lucide-react';
import { SECTIONSTerms } from '@/lib/constants/sections';

export const metadata: Metadata = {
  title: "Terms of Service | Lazyfolio",
  description: "Read the Terms of Service governing your use of Lazyfolio platform, username claiming, and content publishing.",
};

export default function TermsPage() {

  return (
    <div className="min-h-screen py-12 md:py-20 px-6 md:px-12 max-w-7xl mx-auto">
      <div className="relative mb-16 rounded-3xl border border-(--lf-border) bg-(--lf-surface) p-8 md:p-14 overflow-hidden shadow-sm">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-(--lf-border) bg-(--lf-bg) text-[0.75rem] font-semibold tracking-wider text-(--lf-muted) uppercase mb-6">
            Terms &amp; Platform Guidelines
          </div>
          
          <h1 className="font-serif-display text-4xl md:text-6xl font-normal text-(--lf-ink) tracking-tight mb-6 leading-tight">
            Terms of Service
          </h1>
          
          <p className="text-base md:text-lg text-(--lf-muted) font-sans-body leading-relaxed mb-6">
            These terms set the standard rules for claiming your username, publishing your developer portfolio, and using Lazyfolio. Keep it clean, respect others, and share your best work.
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
              {SECTIONSTerms.map((sec) => {
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
              <p className="text-xs text-(--lf-sub) mb-3">Looking for privacy policy?</p>
              <Link
                href="/privacy"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-(--lf-ink) hover:underline underline-offset-4"
              >
                Read Privacy Policy <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </aside>

        <main className="lg:col-span-8 space-y-12">
          <section id="acceptance" className="scroll-mt-28 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl border border-(--lf-border) bg-(--lf-surface) text-(--lf-ink)">
                <FileText className="w-5 h-5" />
              </div>
              <h2 className="font-serif-display text-2xl md:text-3xl font-normal text-(--lf-ink)">
                1. Agreement to Terms
              </h2>
            </div>
            <div className="p-6 md:p-8 rounded-2xl border border-(--lf-border) bg-(--lf-surface) space-y-4 text-sm text-(--lf-muted) leading-relaxed">
              <p>
                By accessing or using Lazyfolio (<strong className="text-(--lf-ink)">"the Service"</strong>), hosted at <code className="bg-(--lf-bg) px-2 py-0.5 rounded text-(--lf-ink) font-mono text-xs">lazyfolio.in</code>, you agree to be bound by these Terms of Service (<strong className="text-(--lf-ink)">"Terms"</strong>). If you do not agree to all terms, you may not access or use the hosted service.
              </p>
              <p>
                Lazyfolio is both a hosted application and an open-source software project. While the codebase is licensed under open-source terms, these Terms apply specifically to your access and use of our hosted cloud service at <code className="bg-(--lf-bg) px-2 py-0.5 rounded text-(--lf-ink) font-mono text-xs">lazyfolio.com</code>.
              </p>
            </div>
          </section>

          <section id="user-accounts" className="scroll-mt-28 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl border border-(--lf-border) bg-(--lf-surface) text-(--lf-ink)">
                <UserCheck className="w-5 h-5" />
              </div>
              <h2 className="font-serif-display text-2xl md:text-3xl font-normal text-(--lf-ink)">
                2. User Accounts &amp; Username Rules
              </h2>
            </div>
            <div className="p-6 md:p-8 rounded-2xl border border-(--lf-border) bg-(--lf-surface) space-y-5 text-sm text-(--lf-muted) leading-relaxed">
              <p>
                You register an account on Lazyfolio via supported OAuth providers (such as GitHub or Google). You are responsible for safeguarding your third-party account credentials.
              </p>

              <div className="p-4 rounded-xl bg-(--lf-bg) border border-(--lf-border) space-y-3">
                <strong className="text-(--lf-ink) block text-base">Username Claiming Policy</strong>
                <ul className="list-disc list-inside space-y-2 text-xs">
                  <li><strong className="text-(--lf-ink)">First-Come, First-Served:</strong> Username handles (<code className="font-mono text-xs">lazyfolio.com/username</code>) are claimed on a fair first-come basis.</li>
                  <li><strong className="text-(--lf-ink)">System Reserved Handles:</strong> System routes such as <code className="font-mono text-xs text-(--lf-ink)">/dashboard</code>, <code className="font-mono text-xs text-(--lf-ink)">/templates</code>, <code className="font-mono text-xs text-(--lf-ink)">/terms</code>, and <code className="font-mono text-xs text-(--lf-ink)">/privacy</code> are reserved for platform functionality.</li>
                  <li><strong className="text-(--lf-ink)">Impersonation &amp; Squatting:</strong> Registering handles solely for trademark squatting, domain resale, or impersonating individuals or brands without permission is strictly prohibited. We reserve the right to reclaim or rename infringing handles.</li>
                </ul>
              </div>
            </div>
          </section>
          <section id="user-content" className="scroll-mt-28 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl border border-(--lf-border) bg-(--lf-surface) text-(--lf-ink)">
                <Copyright className="w-5 h-5" />
              </div>
              <h2 className="font-serif-display text-2xl md:text-3xl font-normal text-(--lf-ink)">
                3. User Content &amp; Intellectual Property
              </h2>
            </div>
            <div className="p-6 md:p-8 rounded-2xl border border-(--lf-border) bg-(--lf-surface) space-y-4 text-sm text-(--lf-muted) leading-relaxed">
              <div className="p-4 rounded-xl bg-(--lf-bg) border border-(--lf-border) space-y-1">
                <strong className="text-(--lf-ink) block">You Retain 100% Content Ownership</strong>
                <span>You retain full copyright and ownership rights to all text, blog posts, project writeups, logos, and images you publish on your profile.</span>
              </div>
              <p>
                By publishing content on Lazyfolio, you grant us a worldwide, non-exclusive, royalty-free license to host, render, cache, and publicly display your profile content on <code className="bg-(--lf-bg) px-2 py-0.5 rounded text-(--lf-ink) font-mono text-xs">lazyfolio.com</code> to fulfill the purpose of the platform.
              </p>
            </div>
          </section>

          <section id="acceptable-use" className="scroll-mt-28 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl border border-(--lf-border) bg-(--lf-surface) text-(--lf-ink)">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <h2 className="font-serif-display text-2xl md:text-3xl font-normal text-(--lf-ink)">
                4. Acceptable Use Policy
              </h2>
            </div>
            <div className="p-6 md:p-8 rounded-2xl border border-(--lf-border) bg-(--lf-surface) space-y-4 text-sm text-(--lf-muted) leading-relaxed">
              <p>You agree not to use Lazyfolio to engage in or encourage any of the following activities:</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 rounded-xl bg-(--lf-bg) border border-(--lf-border) space-y-1">
                  <strong className="text-(--lf-ink) block text-xs">Spam &amp; Malware</strong>
                  <span className="text-xs">Publishing malicious links, drive-by downloads, phishing pages, or automated SEO spam.</span>
                </div>
                <div className="p-3.5 rounded-xl bg-(--lf-bg) border border-(--lf-border) space-y-1">
                  <strong className="text-(--lf-ink) block text-xs">Illegal Content</strong>
                  <span className="text-xs">Uploading content that violates local or international copyright, privacy, or civil laws.</span>
                </div>
                <div className="p-3.5 rounded-xl bg-(--lf-bg) border border-(--lf-border) space-y-1">
                  <strong className="text-(--lf-ink) block text-xs">Abuse &amp; Harassment</strong>
                  <span className="text-xs">Publishing hate speech, targeted harassment, doxxing, or defamatory statements.</span>
                </div>
                <div className="p-3.5 rounded-xl bg-(--lf-bg) border border-(--lf-border) space-y-1">
                  <strong className="text-(--lf-ink) block text-xs">Service Interference</strong>
                  <span className="text-xs">Attempting to overload, scrape excessively, or breach platform infrastructure.</span>
                </div>
              </div>
            </div>
          </section>

          <section id="public-nature" className="scroll-mt-28 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl border border-(--lf-border) bg-(--lf-surface) text-(--lf-ink)">
                <Globe className="w-5 h-5" />
              </div>
              <h2 className="font-serif-display text-2xl md:text-3xl font-normal text-(--lf-ink)">
                5. Public Portfolio Visibility
              </h2>
            </div>
            <div className="p-6 md:p-8 rounded-2xl border border-(--lf-border) bg-(--lf-surface) space-y-4 text-sm text-(--lf-muted) leading-relaxed">
              <p>
                Lazyfolio is built specifically to showcase your work to the world. Any profile content or blog posts marked as published are public by design and accessible to anyone on the internet, including search engines and web crawlers.
              </p>
            </div>
          </section>

          <section id="disclaimers" className="scroll-mt-28 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl border border-(--lf-border) bg-(--lf-surface) text-(--lf-ink)">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h2 className="font-serif-display text-2xl md:text-3xl font-normal text-(--lf-ink)">
                6. Disclaimers &amp; Service Availability
              </h2>
            </div>
            <div className="p-6 md:p-8 rounded-2xl border border-(--lf-border) bg-(--lf-surface) space-y-4 text-sm text-(--lf-muted) leading-relaxed">
              <p>
                The hosted Lazyfolio service is provided on an <strong className="text-(--lf-ink)">"AS IS"</strong> and <strong className="text-(--lf-ink)">"AS AVAILABLE"</strong> basis without warranties of any kind, whether express or implied.
              </p>
              <p>
                While we strive for maximum uptime and reliability, we do not guarantee uninterrupted availability. As an open-source project, you are also free to self-host Lazyfolio on your own server infrastructure at any time.
              </p>
            </div>
          </section>

          <section id="liability" className="scroll-mt-28 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl border border-(--lf-border) bg-(--lf-surface) text-(--lf-ink)">
                <Scale className="w-5 h-5" />
              </div>
              <h2 className="font-serif-display text-2xl md:text-3xl font-normal text-(--lf-ink)">
                7. Limitation of Liability
              </h2>
            </div>
            <div className="p-6 md:p-8 rounded-2xl border border-(--lf-border) bg-(--lf-surface) space-y-4 text-sm text-(--lf-muted) leading-relaxed">
              <p>
                To the maximum extent permitted by applicable law, Lazyfolio, its maintainers, and contributors shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use or inability to use the service.
              </p>
            </div>
          </section>

          <section id="contact" className="scroll-mt-28 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl border border-(--lf-border) bg-(--lf-surface) text-(--lf-ink)">
                <HelpCircle className="w-5 h-5" />
              </div>
              <h2 className="font-serif-display text-2xl md:text-3xl font-normal text-(--lf-ink)">
                8. Modifications &amp; Community Contact
              </h2>
            </div>
            <div className="p-6 md:p-8 rounded-2xl border border-(--lf-border) bg-(--lf-surface) space-y-4 text-sm text-(--lf-muted) leading-relaxed">
              <p>
                We may revise these Terms from time to time. Continued use of the platform following any modifications constitutes acceptance of the updated Terms.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <Link
                  href="https://github.com/Angshuman09/lazyfolio"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-(--lf-ink) text-(--lf-bg) text-xs font-semibold hover:opacity-90 transition-opacity"
                >
                  View Code on GitHub
                </Link>
                <Link
                  href="https://github.com/Angshuman09/lazyfolio/blob/main/CODE_OF_CONDUCT.md"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-(--lf-border) bg-(--lf-bg) text-(--lf-ink) text-xs font-semibold hover:bg-(--lf-border) transition-colors"
                >
                  Code of Conduct
                </Link>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}