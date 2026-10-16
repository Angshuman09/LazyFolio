"use client";

import { useMemo, useState } from "react";
import {
  AreaChart as RechartsAreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { BarChart } from "@/components/charts/bar-chart";
import { Bar } from "@/components/charts/bar";
import { Grid } from "@/components/charts/grid";
import { BarXAxis } from "@/components/charts/bar-x-axis";
import { ChartTooltip } from "@/components/charts/tooltip/chart-tooltip";
import { BarChart2, TrendingUp } from "lucide-react";
import type { RangeKey } from "@/hooks/insights";

interface ViewsChartProps {
  series: { date: string; views: number }[];
  range: RangeKey;
}

export function ViewsChart({ series, range }: ViewsChartProps) {
  // Default to bar view as requested by user
  const [chartType, setChartType] = useState<"bar" | "graph">("bar");

  // Format data for both charts
  const chartData = useMemo(() => {
    return (series || []).map((point) => {
      const d = new Date(point.date);
      const formatted = !isNaN(d.getTime())
        ? d.toLocaleDateString("en", { month: "short", day: "numeric" })
        : point.date;

      return {
        ...point,
        displayDate: formatted,
      };
    });
  }, [series]);

  const isEmpty = series.length === 0 || series.every((point) => point.views === 0);

  return (
    <div className="border border-(--lf-border) rounded-xl px-5 py-4 bg-(--lf-surface) mb-5 transition-colors duration-150 hover:border-(--lf-muted)">
      {/* Header with Title and Mode Switcher */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="text-[0.68rem] font-semibold tracking-widest text-(--lf-muted)">
          Views over time
        </div>

        {/* View Switcher: Bar vs Graph */}
        <div className="flex items-center gap-0.5 p-0.5 rounded-lg border border-(--lf-border) bg-(--lf-bg)">
          <button
            type="button"
            onClick={() => setChartType("bar")}
            className={`inline-flex items-center gap-1.5 px-2.5 h-6 rounded-md text-[0.7rem] font-medium font-sans-body transition-all duration-150 cursor-pointer ${
              chartType === "bar"
                ? "bg-(--lf-accent-soft) text-(--lf-ink) font-semibold shadow-xs"
                : "text-(--lf-muted) hover:text-(--lf-ink)"
            }`}
            title="Bar chart view"
          >
            <BarChart2 size={12} />
            <span>Bar</span>
          </button>

          <button
            type="button"
            onClick={() => setChartType("graph")}
            className={`inline-flex items-center gap-1.5 px-2.5 h-6 rounded-md text-[0.7rem] font-medium font-sans-body transition-all duration-150 cursor-pointer ${
              chartType === "graph"
                ? "bg-(--lf-accent-soft) text-(--lf-ink) font-semibold shadow-xs"
                : "text-(--lf-muted) hover:text-(--lf-ink)"
            }`}
            title="Graph (Area) view"
          >
            <TrendingUp size={12} />
            <span>Graph</span>
          </button>
        </div>
      </div>

      {isEmpty ? (
        <p className="text-[0.78rem] text-(--lf-dimmed) italic py-8 text-center">
          No visits yet, share your portfolio link to start seeing data here.
        </p>
      ) : chartType === "bar" ? (
        /* bklit BarChart Component */
        <div className="w-full pt-1 pb-2">
          <BarChart
            data={chartData}
            xDataKey="displayDate"
            aspectRatio="16 / 7"
            barGap={0.25}
            margin={{ top: 20, right: 12, bottom: 28, left: 12 }}
            className="w-full"
          >
            <Grid horizontal stroke="var(--lf-border-alpha)" strokeDasharray="3 3" />
            <Bar
              dataKey="views"
              fill="var(--lf-accent-text)"
              lineCap={4}
              minBarHeight={2}
            />
            <BarXAxis
              maxLabels={range === "7d" ? 7 : range === "30d" ? 8 : 10}
            />
            <ChartTooltip
              showDots={false}
              showCrosshair={true}
              indicatorColor="var(--lf-border)"
              className="bg-(--lf-bg) border border-(--lf-border) text-(--lf-ink) shadow-md rounded-lg text-xs"
            />
          </BarChart>
        </div>
      ) : (
        /* Recharts Smooth Area Chart */
        <ResponsiveContainer width="100%" height={200}>
          <RechartsAreaChart data={series} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="lf-views" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--lf-accent-text)" stopOpacity={0.35} />
                <stop offset="95%" stopColor="var(--lf-accent-text)" stopOpacity={0} />
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
            <RechartsTooltip
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
            <Area
              type="monotone"
              dataKey="views"
              stroke="var(--lf-accent-text)"
              fill="url(#lf-views)"
              strokeWidth={2}
            />
          </RechartsAreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
