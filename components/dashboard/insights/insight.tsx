"use client";

import { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Eye, Users, MousePointerClick } from "lucide-react";
import { useGetInsights, RangeKey } from "@/hooks/insights";

interface InsightsPageProps {
  profile?: { id?: string; username?: string | null } | null;
}

const RANGE_OPTIONS: { key: RangeKey; label: string }[] = [
  { key: "7d", label: "7 days" },
  { key: "30d", label: "30 days" },
  { key: "90d", label: "90 days" },
];

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[0.68rem] font-semibold tracking-widest text-(--lf-muted) font-mono mb-4">
      {children}
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
}) {
  return (
    <div className="border border-(--lf-border) rounded-xl px-4 py-3.5 bg-(--lf-surface) transition-colors duration-150 hover:border-(--lf-muted)">
      <div className="flex items-center gap-1.5 text-(--lf-muted) mb-2">
        {icon}
        <span className="text-[0.68rem] font-semibold tracking-widest font-mono">
          {label}
        </span>
      </div>
      <div className="text-[1.5rem] font-serif-display text-(--lf-ink)">{value}</div>
    </div>
  );
}

function MetricRow({ label, count, total }: { label: string; count: number; total: number }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="flex items-center justify-between gap-3 py-1.5">
      <span className="text-[0.8rem] text-(--lf-ink) truncate">{label}</span>
      <div className="flex items-center gap-2 shrink-0">
        <div className="w-16 h-1 rounded-full bg-(--lf-border-alpha) overflow-hidden">
          <div className="h-full bg-(--lf-ink) rounded-full" style={{ width: `${pct}%` }} />
        </div>
        <span className="text-[0.72rem] text-(--lf-muted) font-mono w-8 text-right">{pct}%</span>
      </div>
    </div>
  );
}

function MetricCard({
  title,
  rows,
  emptyLabel,
}: {
  title: string;
  rows: { label: string; count: number }[];
  emptyLabel: string;
}) {
  const total = rows.reduce((sum, r) => sum + r.count, 0);
  return (
    <div className="border border-(--lf-border) rounded-xl px-5 py-4 bg-(--lf-surface) transition-colors duration-150 hover:border-(--lf-muted)">
      <SectionLabel>{title}</SectionLabel>
      {rows.length === 0 ? (
        <p className="text-[0.78rem] text-(--lf-dimmed) italic">{emptyLabel}</p>
      ) : (
        <div className="flex flex-col divide-y divide-(--lf-border-alpha)">
          {rows.slice(0, 5).map((row) => (
            <MetricRow key={row.label} label={row.label} count={row.count} total={total} />
          ))}
        </div>
      )}
    </div>
  );
}

function InsightsSkeleton() {
  return (
    <div className="animate-pulse mt-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-20 rounded-xl bg-(--lf-border-alpha)" />
        ))}
      </div>
      <div className="h-56 rounded-xl bg-(--lf-border-alpha) mb-5" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-32 rounded-xl bg-(--lf-border-alpha)" />
        ))}
      </div>
    </div>
  );
}

export default function InsightsPage({ profile }: InsightsPageProps) {
  const [range, setRange] = useState<RangeKey>("30d");
  const { data, isLoading, isError } = useGetInsights(profile?.id, range);

  return (
    <div>
      <div className="flex items-start justify-between gap-4 mb-3 flex-wrap">
        <div>
          <h1 className="font-serif-display text-[1.4rem] font-medium tracking-tight text-(--lf-ink)">
            Insights
          </h1>
          <p className="text-[0.78rem] text-(--lf-muted)">
            How people are finding and using your portfolio
          </p>
        </div>

        {profile?.username && (
          <div className="flex items-center gap-1 rounded-lg border border-(--lf-border) p-1 bg-(--lf-bg)">
            {RANGE_OPTIONS.map((option) => (
              <button
                key={option.key}
                type="button"
                onClick={() => setRange(option.key)}
                className={`px-3 h-7 rounded-md text-[0.72rem] font-medium font-sans-body transition-all duration-150 cursor-pointer ${
                  range === option.key
                    ? "bg-(--lf-accent-soft) text-(--lf-ink) font-semibold"
                    : "text-(--lf-muted) hover:text-(--lf-ink)"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {!profile?.username ? (
        <div className="p-8 border border-(--lf-border) rounded-xl bg-(--lf-surface) text-center mt-4 flex flex-col items-center">
          <div className="text-[1.1rem] font-serif-display text-(--lf-ink) mb-1.5">
            Set your username first
          </div>
          <div className="text-[0.82rem] text-(--lf-muted) max-w-md leading-relaxed">
            Insights become available once your portfolio is live at a public link.
          </div>
        </div>
      ) : isLoading ? (
        <InsightsSkeleton />
      ) : isError || !data ? (
        <div className="p-8 border border-(--lf-border) rounded-xl bg-(--lf-surface) text-center mt-4">
          <div className="text-[0.85rem] text-(--lf-muted)">
            Couldn&apos;t load insights right now. Try again in a moment.
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">
            <StatCard icon={<Eye size={13} />} label="Views" value={data.pageviews} />
            <StatCard icon={<Users size={13} />} label="Visitors" value={data.uniqueVisitors} />
            <StatCard
              icon={<MousePointerClick size={13} />}
              label="Clicks"
              value={data.clicks.reduce((sum, c) => sum + c.count, 0)}
            />
          </div>

          <div className="border border-(--lf-border) rounded-xl px-5 py-4 bg-(--lf-surface) mb-5 transition-colors duration-150 hover:border-(--lf-muted)">
            <SectionLabel>Views over time</SectionLabel>
            {data.series.every((point) => point.views === 0) ? (
              <p className="text-[0.78rem] text-(--lf-dimmed) italic py-8 text-center">
                No visits yet — share your portfolio link to start seeing data here.
              </p>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={data.series} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="lf-views" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--lf-ink)" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="var(--lf-ink)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--lf-border-alpha)" vertical={false} />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 10, fill: "var(--lf-muted)" }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(value) =>
                      new Date(value).toLocaleDateString("en", { month: "short", day: "numeric" })
                    }
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: "var(--lf-muted)" }}
                    axisLine={false}
                    tickLine={false}
                    width={28}
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={{
                      fontSize: 12,
                      borderRadius: 8,
                      border: "1px solid var(--lf-border)",
                      background: "var(--lf-bg)",
                      color: "var(--lf-ink)",
                    }}
                    labelFormatter={(value) =>
                      new Date(value).toLocaleDateString("en", { month: "short", day: "numeric" })
                    }
                  />
                  <Area type="monotone" dataKey="views" stroke="var(--lf-ink)" fill="url(#lf-views)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <MetricCard
              title="Top Clicks"
              rows={data.clicks.map((c) => ({ label: c.label, count: c.count }))}
              emptyLabel="No link clicks yet"
            />
            <MetricCard
              title="Countries"
              rows={data.countries.map((c) => ({ label: c.country, count: c.count }))}
              emptyLabel="No visitors yet"
            />
            <MetricCard
              title="Devices"
              rows={data.devices.map((d) => ({ label: d.device, count: d.count }))}
              emptyLabel="No device data yet"
            />
          </div>
        </>
      )}
    </div>
  );
}