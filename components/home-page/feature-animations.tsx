"use client";

export const TemplatesAnimation = () => (
  <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
    <style>{`
      .tpl-card {
        transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
      }
      .group:hover .tpl-top    { transform: translate(-6px, -6px); }
      .group:hover .tpl-mid    { transform: translate(0px, 0px); }
      .group:hover .tpl-bottom { transform: translate(6px, 6px); }
    `}</style>
   <svg viewBox="0 0 200 140" fill="none" preserveAspectRatio="xMidYMid meet" className="w-full h-full select-none">
      <rect className="tpl-card tpl-bottom" x="62" y="38" width="76" height="64" rx="6"
        fill="var(--lf-surface)" stroke="var(--lf-border)" strokeWidth="1.2" />
      <g className="tpl-card tpl-mid">
        <rect x="56" y="32" width="76" height="64" rx="6"
          fill="var(--lf-surface)" stroke="var(--lf-border)" strokeWidth="1.2" />
        <rect x="64" y="42" width="24" height="16" rx="2" className="fill-zinc-200/60 dark:fill-zinc-800/50" />
        <rect x="64" y="64" width="60" height="4" rx="1" className="fill-zinc-200/60 dark:fill-zinc-800/50" />
        <rect x="64" y="72" width="40" height="4" rx="1" className="fill-zinc-200/40 dark:fill-zinc-800/30" />
        <rect x="64" y="80" width="52" height="4" rx="1" className="fill-zinc-200/40 dark:fill-zinc-800/30" />
      </g>
      <g className="tpl-card tpl-top">
        <rect x="50" y="26" width="76" height="64" rx="6"
          fill="var(--lf-surface)" stroke="var(--lf-muted)" strokeWidth="1.2" />
        <circle cx="72" cy="46" r="10" className="fill-zinc-200/70 dark:fill-zinc-800/60" />
        <rect x="88" y="40" width="28" height="5" rx="1.5" className="fill-zinc-300/80 dark:fill-zinc-700" />
        <rect x="88" y="49" width="20" height="3" rx="1" className="fill-zinc-200/60 dark:fill-zinc-800/50" />
        <rect x="60" y="66" width="56" height="4" rx="1" className="fill-zinc-200/60 dark:fill-zinc-800/50" />
        <rect x="60" y="74" width="40" height="4" rx="1" className="fill-zinc-200/40 dark:fill-zinc-800/30" />
      </g>
    </svg>
  </div>
);

/* ─── 2. Built-in Analytics ─── */
export const AnalyticsAnimation = () => (
  <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
    <style>{`
      .bar-el {
        transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        transform-origin: bottom;
        transform: scaleY(0.5);
      }
      .group:hover .bar-el { transform: scaleY(1); }
      .chart-line-el {
        stroke-dasharray: 300;
        stroke-dashoffset: 300;
        transition: stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1);
      }
      .group:hover .chart-line-el { stroke-dashoffset: 0; }
      .chart-dot-el {
        opacity: 0;
        transition: opacity 0.6s ease 0.8s;
      }
      .group:hover .chart-dot-el { opacity: 1; }
    `}</style>
   <svg viewBox="0 0 200 140" fill="none" preserveAspectRatio="xMidYMid meet" className="w-full h-full select-none">
      <line x1="30" y1="40" x2="170" y2="40" className="stroke-zinc-200/50 dark:stroke-zinc-800/40" strokeWidth="0.8" />
      <line x1="30" y1="65" x2="170" y2="65" className="stroke-zinc-200/50 dark:stroke-zinc-800/40" strokeWidth="0.8" />
      <line x1="30" y1="90" x2="170" y2="90" className="stroke-zinc-200/50 dark:stroke-zinc-800/40" strokeWidth="0.8" />
      <line x1="30" y1="115" x2="170" y2="115" className="stroke-zinc-200/50 dark:stroke-zinc-800/40" strokeWidth="0.8" />
      <rect className="bar-el fill-zinc-300/70 dark:fill-zinc-700/60" style={{ transitionDelay: "0s" }}
        x="40" y="55" width="12" height="60" rx="2" />
      <rect className="bar-el fill-zinc-300/70 dark:fill-zinc-700/60" style={{ transitionDelay: "0.05s" }}
        x="60" y="45" width="12" height="70" rx="2" />
      <rect className="bar-el fill-zinc-300/70 dark:fill-zinc-700/60" style={{ transitionDelay: "0.1s" }}
        x="80" y="60" width="12" height="55" rx="2" />
      <rect className="bar-el fill-zinc-300/70 dark:fill-zinc-700/60" style={{ transitionDelay: "0.15s" }}
        x="100" y="35" width="12" height="80" rx="2" />
      <rect className="bar-el fill-zinc-300/70 dark:fill-zinc-700/60" style={{ transitionDelay: "0.2s" }}
        x="120" y="50" width="12" height="65" rx="2" />
      <rect className="bar-el fill-zinc-300/70 dark:fill-zinc-700/60" style={{ transitionDelay: "0.25s" }}
        x="140" y="30" width="12" height="85" rx="2" />
      <polyline
        points="46,55 66,45 86,60 106,35 126,50 146,30"
        className="chart-line-el"
        stroke="var(--lf-muted)"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <circle cx="146" cy="30" r="3.5" fill="var(--lf-surface)" stroke="var(--lf-muted)" strokeWidth="1.5" className="chart-dot-el" />
    </svg>
  </div>
);

/* ─── 3. Share Your Lazyfolio Anywhere ─── */
export const PublishAnimation = () => (
  <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
    <style>{`
      .share-ring-1, .share-ring-2, .share-ring-3 {
        opacity: 0;
        transform: scale(0.5);
        transition: opacity 0.5s ease, transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
      }
      .group:hover .share-ring-1 { opacity: 0.15; transform: scale(1); transition-delay: 0s; }
      .group:hover .share-ring-2 { opacity: 0.1; transform: scale(1); transition-delay: 0.15s; }
      .group:hover .share-ring-3 { opacity: 0.06; transform: scale(1); transition-delay: 0.3s; }
      .share-node {
        transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
      }
      .group:hover .share-n-1 { transform: translate(-18px, -14px); }
      .group:hover .share-n-2 { transform: translate(20px, -12px); }
      .group:hover .share-n-3 { transform: translate(-16px, 16px); }
      .group:hover .share-n-4 { transform: translate(18px, 14px); }
      .share-line-el {
        stroke-dasharray: 80;
        stroke-dashoffset: 80;
        transition: stroke-dashoffset 0.6s cubic-bezier(0.4, 0, 0.2, 1);
      }
      .group:hover .share-line-el { stroke-dashoffset: 0; }
    `}</style>
    <svg viewBox="0 0 200 140" fill="none" preserveAspectRatio="xMidYMid meet" className="w-full h-full select-none">
      <circle cx="100" cy="70" r="20" className="share-ring-1" stroke="var(--lf-muted)" strokeWidth="1" fill="none" style={{ transformOrigin: "100px 70px" }} />
      <circle cx="100" cy="70" r="35" className="share-ring-2" stroke="var(--lf-muted)" strokeWidth="1" fill="none" style={{ transformOrigin: "100px 70px" }} />
      <circle cx="100" cy="70" r="50" className="share-ring-3" stroke="var(--lf-muted)" strokeWidth="1" fill="none" style={{ transformOrigin: "100px 70px" }} />
      <line x1="100" y1="70" x2="68" y2="44" className="share-line-el" stroke="var(--lf-border)" strokeWidth="1" style={{ transitionDelay: "0.1s" }} />
      <line x1="100" y1="70" x2="132" y2="48" className="share-line-el" stroke="var(--lf-border)" strokeWidth="1" style={{ transitionDelay: "0.2s" }} />
      <line x1="100" y1="70" x2="72" y2="98" className="share-line-el" stroke="var(--lf-border)" strokeWidth="1" style={{ transitionDelay: "0.3s" }} />
      <line x1="100" y1="70" x2="128" y2="94" className="share-line-el" stroke="var(--lf-border)" strokeWidth="1" style={{ transitionDelay: "0.4s" }} />
      <circle cx="100" cy="70" r="10" fill="var(--lf-surface)" stroke="var(--lf-muted)" strokeWidth="1.5" />
      <path d="M96 68 L100 64 L104 68 M96 72 L100 76 L104 72" stroke="var(--lf-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <g className="share-node share-n-1" style={{ transformOrigin: "68px 44px" }}>
        <circle cx="68" cy="44" r="8" fill="var(--lf-surface)" stroke="var(--lf-border)" strokeWidth="1.2" />
        <text x="68" y="47" textAnchor="middle" className="fill-zinc-500 dark:fill-zinc-400" fontSize="8" fontWeight="600">𝕏</text>
      </g>
      <g className="share-node share-n-2" style={{ transformOrigin: "132px 48px" }}>
        <circle cx="132" cy="48" r="8" fill="var(--lf-surface)" stroke="var(--lf-border)" strokeWidth="1.2" />
        <text x="132" y="51" textAnchor="middle" className="fill-zinc-500 dark:fill-zinc-400" fontSize="7" fontWeight="700">in</text>
      </g>
      <g className="share-node share-n-3" style={{ transformOrigin: "72px 98px" }}>
        <circle cx="72" cy="98" r="8" fill="var(--lf-surface)" stroke="var(--lf-border)" strokeWidth="1.2" />
        <text x="72" y="101" textAnchor="middle" className="fill-zinc-500 dark:fill-zinc-400" fontSize="8">@</text>
      </g>
      <g className="share-node share-n-4" style={{ transformOrigin: "128px 94px" }}>
        <circle cx="128" cy="94" r="8" fill="var(--lf-surface)" stroke="var(--lf-border)" strokeWidth="1.2" />
        <path d="M124.5 91.5 L128 88.5 L131.5 91.5 M124.5 96.5 L128 99.5 L131.5 96.5" stroke="var(--lf-muted)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  </div>
);

/* ─── 4. Write and Share Blogs ─── */
export const DomainAnimation = () => (
  <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
    <style>{`
      .blog-line {
        transform: scaleX(0);
        transform-origin: left;
        transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
      }
      .group:hover .blog-line { transform: scaleX(1); }
      .blog-cursor-el {
        opacity: 0;
        transition: opacity 0.3s ease 0.4s;
      }
      .group:hover .blog-cursor-el {
        opacity: 1;
        animation: blog-blink 1s step-end infinite;
      }
      @keyframes blog-blink {
        50% { opacity: 0; }
      }
      .blog-img-el {
        transform: scale(0.9);
        opacity: 0.5;
        transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1) 0.2s, opacity 0.4s ease 0.2s;
      }
      .group:hover .blog-img-el { transform: scale(1); opacity: 1; }
    `}</style>
    <svg viewBox="0 0 200 140" fill="none" preserveAspectRatio="xMidYMid meet" className="w-full h-full select-none">
      <rect x="35" y="18" width="130" height="104" rx="6"
        fill="var(--lf-surface)" stroke="var(--lf-border)" strokeWidth="1.2" />
      <rect x="43" y="26" width="114" height="32" rx="3" className="blog-img-el fill-zinc-200/60 dark:fill-zinc-800/50" style={{ transformOrigin: "100px 42px" }} />
      <path d="M70 50 L80 38 L90 50 M85 50 L95 40 L108 50" className="blog-img-el stroke-zinc-400/50 dark:stroke-zinc-600/50" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none" style={{ transformOrigin: "100px 42px" }} />
      <rect x="43" y="66" width="80" height="6" rx="1.5" className="blog-line fill-zinc-400/80 dark:fill-zinc-600"
        style={{ transitionDelay: "0s", transformOrigin: "43px 69px" }} />
      <rect x="43" y="78" width="114" height="4" rx="1" className="blog-line fill-zinc-200/70 dark:fill-zinc-800/60"
        style={{ transitionDelay: "0.08s", transformOrigin: "43px 80px" }} />
      <rect x="43" y="86" width="100" height="4" rx="1" className="blog-line fill-zinc-200/70 dark:fill-zinc-800/60"
        style={{ transitionDelay: "0.16s", transformOrigin: "43px 88px" }} />
      <rect x="43" y="94" width="108" height="4" rx="1" className="blog-line fill-zinc-200/70 dark:fill-zinc-800/60"
        style={{ transitionDelay: "0.24s", transformOrigin: "43px 96px" }} />
      <rect x="43" y="102" width="70" height="4" rx="1" className="blog-line fill-zinc-200/70 dark:fill-zinc-800/60"
        style={{ transitionDelay: "0.32s", transformOrigin: "43px 104px" }} />
      <line x1="115" y1="101" x2="115" y2="107" stroke="var(--lf-muted)" strokeWidth="1.5" strokeLinecap="round" className="blog-cursor-el" />
    </svg>
  </div>
);