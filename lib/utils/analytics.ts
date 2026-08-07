import "server-only";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";

function hashVisitor(ip: string) {
  const day = new Date().toISOString().slice(0, 10);
  return crypto
    .createHash("sha256")
    .update(`${ip}-${day}-${process.env.VISITOR_HASH_SALT}`)
    .digest("hex");
}

function getDeviceType(userAgent: string): "mobile" | "tablet" | "desktop" {
  const ua = userAgent.toLowerCase();
  if (/ipad|tablet|playbook|silk/.test(ua) && !ua.includes("mobile")) return "tablet";
  if (/mobile|iphone|ipod|blackberry|windows phone|android/.test(ua)) return "mobile";
  return "desktop";
}

export async function trackPageView({
  profileId,
  country,
  userAgent,
  ip,
}: {
  profileId: string;
  country?: string | null;
  userAgent?: string | null;
  ip?: string | null;
}) {
  try {
    await prisma.pageView.create({
      data: {
        profileId,
        country: country || null,
        device: userAgent ? getDeviceType(userAgent) : null,
        visitorHash: ip ? hashVisitor(ip) : "unknown",
      },
    });
  } catch (err) {
    console.error("Failed to track page view", err); 
  }
}

export async function trackLinkClick(profileId: string, label: string) {
  try {
    await prisma.linkClick.create({ data: { profileId, label } });
  } catch (err) {
    console.error("Failed to track link click", err);
  }
}

export async function getInsightSummary(
  profileId: string,
  range: { startAt: Date; endAt: Date }
) {
  const where = { profileId, createdAt: { gte: range.startAt, lte: range.endAt } };

  const [pageviews, visitorRows, clicks, countries, devices] = await Promise.all([
    prisma.pageView.count({ where }),
    prisma.pageView.findMany({ where, select: { visitorHash: true }, distinct: ["visitorHash"] }),
    prisma.linkClick.groupBy({
      by: ["label"],
      where,
      _count: { label: true },
      orderBy: { _count: { label: "desc" } },
    }),
    prisma.pageView.groupBy({
      by: ["country"],
      where: { ...where, country: { not: null } },
      _count: { country: true },
      orderBy: { _count: { country: "desc" } },
      take: 5,
    }),
    prisma.pageView.groupBy({
      by: ["device"],
      where: { ...where, device: { not: null } },
      _count: { device: true },
    }),
  ]);

  return {
    pageviews,
    uniqueVisitors: visitorRows.length,
    clicks: clicks.map((c) => ({ label: c.label, count: c._count.label })),
    countries: countries.map((c) => ({ country: c.country!, count: c._count.country })),
    devices: devices.map((d) => ({ device: d.device!, count: d._count.device })),
  };
}

export function presetRange(key: "7d" | "30d" | "90d") {
  const days = key === "7d" ? 7 : key === "30d" ? 30 : 90;
  const endAt = new Date();
  const startAt = new Date(endAt.getTime() - days * 24 * 60 * 60 * 1000);
  return { startAt, endAt };
}

async function getPageviewSeries(
  profileId: string,
  range: { startAt: Date; endAt: Date }
) {
  const rows = await prisma.pageView.findMany({
    where: { profileId, createdAt: { gte: range.startAt, lte: range.endAt } },
    select: { createdAt: true },
  });

  const buckets = new Map<string, number>();
  for (const row of rows) {
    const day = row.createdAt.toISOString().slice(0, 10);
    buckets.set(day, (buckets.get(day) || 0) + 1);
  }

  const series: { date: string; views: number }[] = [];
  const cursor = new Date(range.startAt);
  while (cursor <= range.endAt) {
    const key = cursor.toISOString().slice(0, 10);
    series.push({ date: key, views: buckets.get(key) || 0 });
    cursor.setDate(cursor.getDate() + 1);
  }
  return series;
}

export async function getInsightData(
  profileId: string,
  range: { startAt: Date; endAt: Date }
) {
  const where = { profileId, createdAt: { gte: range.startAt, lte: range.endAt } };

  const [pageviews, visitorRows, clicks, countries, devices, series] = await Promise.all([
    prisma.pageView.count({ where }),
    prisma.pageView.findMany({ where, select: { visitorHash: true }, distinct: ["visitorHash"] }),
    prisma.linkClick.groupBy({
      by: ["label"],
      where,
      _count: { label: true },
      orderBy: { _count: { label: "desc" } },
    }),
    prisma.pageView.groupBy({
      by: ["country"],
      where: { ...where, country: { not: null } },
      _count: { country: true },
      orderBy: { _count: { country: "desc" } },
      take: 5,
    }),
    prisma.pageView.groupBy({
      by: ["device"],
      where: { ...where, device: { not: null } },
      _count: { device: true },
    }),
    getPageviewSeries(profileId, range),
  ]);

  return {
    pageviews,
    uniqueVisitors: visitorRows.length,
    clicks: clicks.map((c) => ({ label: c.label, count: c._count.label })),
    countries: countries.map((c) => ({ country: c.country!, count: c._count.country })),
    devices: devices.map((d) => ({ device: d.device!, count: d._count.device })),
    series,
  };
}