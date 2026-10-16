"use client";

import { useMemo, useState } from "react";
import * as topojson from "topojson-client";
import worldData from "world-atlas/countries-110m.json";
import type { FeatureCollection, Geometry } from "geojson";
import {
  ChoroplethChart,
  ChoroplethFeatureComponent,
  ChoroplethGraticule,
  ChoroplethTooltip,
  type ChoroplethFeature,
  type ChoroplethFeatureProperties,
} from "@/components/charts/choropleth";
import { BarChart2, Globe, ZoomIn, RotateCcw } from "lucide-react";

// ISO 3166-1 alpha-2 to numeric code (used by world-atlas)
const ISO2_TO_NUMERIC: Record<string, string> = {
  AF: "004", AL: "008", DZ: "012", AS: "016", AD: "020", AO: "024", AI: "660", AQ: "010", AG: "028", AR: "032",
  AM: "051", AW: "533", AU: "036", AT: "040", AZ: "031", BS: "044", BH: "048", BD: "050", BB: "052", BY: "112",
  BE: "056", BZ: "084", BJ: "204", BM: "060", BT: "064", BO: "068", BA: "070", BW: "072", BR: "076", BN: "096",
  BG: "100", BF: "854", BI: "108", KH: "116", CM: "120", CA: "124", CV: "132", KY: "136", CF: "140", TD: "148",
  CL: "152", CN: "156", CO: "170", KM: "174", CG: "178", CD: "180", CR: "188", CI: "384", HR: "191", CU: "192",
  CY: "196", CZ: "203", DK: "208", DJ: "262", DM: "212", DO: "214", EC: "218", EG: "818", SV: "222", GQ: "226",
  ER: "232", EE: "233", ET: "231", FJ: "242", FI: "246", FR: "250", GA: "266", GM: "270", GE: "268", DE: "276",
  GH: "288", GR: "300", GL: "304", GD: "308", GT: "320", GN: "324", GW: "624", GY: "328", HT: "332", HN: "340",
  HK: "344", HU: "348", IS: "352", IN: "356", ID: "360", IR: "364", IQ: "368", IE: "372", IL: "376", IT: "380",
  JM: "388", JP: "392", JO: "400", KZ: "398", KE: "404", KP: "408", KR: "410", KW: "414", KG: "417", LA: "418",
  LV: "428", LB: "422", LS: "426", LR: "430", LY: "434", LT: "440", LU: "442", MK: "807", MG: "450", MW: "454",
  MY: "458", MV: "462", ML: "466", MT: "470", MR: "478", MU: "480", MX: "484", MD: "498", MN: "496", ME: "499",
  MA: "504", MZ: "508", MM: "104", NA: "516", NP: "524", NL: "528", NZ: "554", NI: "558", NE: "562", NG: "566",
  NO: "578", OM: "512", PK: "586", PA: "591", PG: "598", PY: "600", PE: "604", PH: "608", PL: "616", PT: "620",
  PR: "630", QA: "634", RO: "642", RU: "643", RW: "646", SA: "682", SN: "686", RS: "688", SL: "694", SG: "702",
  SK: "703", SI: "705", SO: "706", ZA: "710", ES: "724", LK: "144", SD: "729", SR: "740", SE: "752", CH: "756",
  SY: "760", TW: "158", TJ: "762", TZ: "834", TH: "764", TL: "626", TG: "768", TT: "780", TN: "788", TR: "792",
  TM: "795", UG: "800", UA: "804", AE: "784", GB: "826", US: "840", UY: "858", UZ: "860", VE: "862", VN: "704",
  YE: "887", ZM: "894", ZW: "716"
};

// Numeric code to ISO-2
const NUMERIC_TO_ISO2: Record<string, string> = Object.entries(ISO2_TO_NUMERIC).reduce(
  (acc, [iso, num]) => {
    acc[String(num).padStart(3, "0")] = iso;
    return acc;
  },
  {} as Record<string, string>
);

function getCountryFlag(isoCode: string): string {
  if (!isoCode || isoCode.length !== 2) return "";
  const code = isoCode.toUpperCase();
  if (!/^[A-Z]{2}$/.test(code)) return "";
  return String.fromCodePoint(...[...code].map((c) => 127397 + c.charCodeAt(0)));
}

const displayNames =
  typeof Intl !== "undefined" && Intl.DisplayNames
    ? new Intl.DisplayNames(["en"], { type: "region" })
    : null;

function formatCountryName(codeOrName: string): string {
  if (!codeOrName) return "Unknown";
  if (codeOrName.length === 2 && displayNames) {
    try {
      return displayNames.of(codeOrName.toUpperCase()) || codeOrName;
    } catch {
      return codeOrName;
    }
  }
  return codeOrName;
}

export interface CountriesInsightProps {
  countries: { country: string; count: number }[];
}

export function CountriesInsight({ countries }: CountriesInsightProps) {
  const [viewMode, setViewMode] = useState<"graph" | "bar">("graph");

  // Pre-process GeoJSON features once
  const geojson = useMemo(() => {
    const raw = topojson.feature(
      worldData as unknown as Parameters<typeof topojson.feature>[0],
      (worldData as unknown as { objects: { countries: Parameters<typeof topojson.feature>[1] } }).objects.countries
    ) as unknown as FeatureCollection<Geometry, ChoroplethFeatureProperties>;

    return raw;
  }, []);

  // Map of numeric ID -> visitor count, and ISO-2 -> visitor count
  const { countsByNumericId, countsByIso, maxCount, totalCount } = useMemo(() => {
    const byNum = new Map<string, number>();
    const byIso = new Map<string, number>();
    let max = 0;
    let total = 0;

    for (const item of countries) {
      if (!item.country) continue;
      const upper = item.country.toUpperCase().trim();
      const num = ISO2_TO_NUMERIC[upper] || upper;
      const padNum = num.padStart(3, "0");

      byNum.set(padNum, (byNum.get(padNum) || 0) + item.count);
      byIso.set(upper, (byIso.get(upper) || 0) + item.count);
      total += item.count;
      if (item.count > max) max = item.count;
    }

    return { countsByNumericId: byNum, countsByIso: byIso, maxCount: max, totalCount: total };
  }, [countries]);

  // Lookup count for a given feature
  const getFeatureCount = (feature: ChoroplethFeature): number => {
    const numId = String(feature.id).padStart(3, "0");
    const count = countsByNumericId.get(numId);
    if (typeof count === "number") return count;

    // Fallback: match by name
    const featureName = (feature.properties?.name || "").toLowerCase();
    for (const item of countries) {
      if (item.country.toLowerCase() === featureName) {
        return item.count;
      }
    }
    return 0;
  };

  // Color mapper based on visitor density
  const getFeatureColor = (feature: ChoroplethFeature): string => {
    const count = getFeatureCount(feature);
    if (!count || maxCount <= 0) {
      // Unvisited country: subtle transparent neutral
      return "var(--lf-border-alpha)";
    }
    const ratio = count / maxCount;
    if (ratio > 0.75) return "var(--lf-ink)";
    if (ratio > 0.4) return "color-mix(in srgb, var(--lf-ink) 75%, transparent)";
    if (ratio > 0.15) return "color-mix(in srgb, var(--lf-ink) 50%, transparent)";
    return "color-mix(in srgb, var(--lf-ink) 25%, transparent)";
  };

  const getFeatureDisplayName = (feature: ChoroplethFeature): string => {
    const numId = String(feature.id).padStart(3, "0");
    const iso = NUMERIC_TO_ISO2[numId];
    const flag = iso ? getCountryFlag(iso) : "";
    const name = feature.properties?.name || (iso ? formatCountryName(iso) : `Region ${feature.id}`);
    return flag ? `${flag} ${name}` : name;
  };

  return (
    <div className="border border-(--lf-border) rounded-xl px-5 py-4 bg-(--lf-surface) transition-colors duration-150 hover:border-(--lf-muted)">
      {/* Header with Title and View Switcher */}
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="text-[0.68rem] font-semibold tracking-widest text-(--lf-muted) font-mono">
          Countries
          {totalCount > 0 && (
            <span className="ml-2 px-1.5 py-0.5 rounded-full bg-(--lf-border-alpha) text-(--lf-ink) font-normal text-[0.62rem]">
              {countries.length} {countries.length === 1 ? "country" : "countries"}
            </span>
          )}
        </div>

        {/* View Toggle Option: Bar vs Graph */}
        <div className="flex items-center gap-0.5 p-0.5 rounded-lg border border-(--lf-border) bg-(--lf-bg)">
          <button
            type="button"
            onClick={() => setViewMode("bar")}
            className={`inline-flex items-center gap-1.5 px-2.5 h-6 rounded-md text-[0.7rem] font-medium font-sans-body transition-all duration-150 cursor-pointer ${
              viewMode === "bar"
                ? "bg-(--lf-accent-soft) text-(--lf-ink) font-semibold shadow-xs"
                : "text-(--lf-muted) hover:text-(--lf-ink)"
            }`}
            title="Bar view"
          >
            <BarChart2 size={12} />
            <span>Bar</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode("graph")}
            className={`inline-flex items-center gap-1.5 px-2.5 h-6 rounded-md text-[0.7rem] font-medium font-sans-body transition-all duration-150 cursor-pointer ${
              viewMode === "graph"
                ? "bg-(--lf-accent-soft) text-(--lf-ink) font-semibold shadow-xs"
                : "text-(--lf-muted) hover:text-(--lf-ink)"
            }`}
            title="Graph view (Choropleth Map)"
          >
            <Globe size={12} />
            <span>Graph</span>
          </button>
        </div>
      </div>

      {countries.length === 0 ? (
        <p className="text-[0.78rem] text-(--lf-dimmed) italic py-6 text-center">
          No visitors yet
        </p>
      ) : viewMode === "graph" ? (
        /* Choropleth Chart (Graph View) */
        <div className="space-y-3">
          <div className="relative rounded-lg overflow-hidden border border-(--lf-border-alpha) bg-(--lf-bg)/40 p-2">
            <ChoroplethChart
              data={geojson}
              aspectRatio="16 / 9"
              zoomEnabled={true}
              zoomMin={0.8}
              zoomMax={5}
              className="w-full"
            >
              <ChoroplethGraticule
                stroke="var(--lf-border-alpha)"
                strokeWidth={0.5}
                step={[20, 20]}
              />
              <ChoroplethFeatureComponent
                stroke="var(--lf-border)"
                strokeWidth={0.5}
                getFeatureColor={getFeatureColor}
              />
              <ChoroplethTooltip
                getFeatureName={getFeatureDisplayName}
                getFeatureValue={(feature) => getFeatureCount(feature)}
                valueLabel="Visitors"
                className="bg-(--lf-bg) border border-(--lf-border) text-(--lf-ink) shadow-md rounded-lg text-xs"
              />
            </ChoroplethChart>
          </div>

          {/* Quick stats chips for top countries */}
          <div className="flex items-center justify-between gap-2 pt-1 text-[0.7rem] text-(--lf-muted)">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-mono text-[0.65rem] uppercase tracking-wider text-(--lf-dimmed)">
                Top:
              </span>
              {countries.slice(0, 4).map((c) => {
                const flag = getCountryFlag(c.country);
                const name = formatCountryName(c.country);
                return (
                  <span
                    key={c.country}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-(--lf-border) bg-(--lf-bg) text-(--lf-ink) font-sans"
                  >
                    <span>{flag}</span>
                    <span className="truncate max-w-[90px]">{name}</span>
                    <span className="font-mono text-[0.65rem] text-(--lf-muted)">
                      {c.count}
                    </span>
                  </span>
                );
              })}
            </div>
            <div className="hidden sm:flex items-center gap-1 text-[0.65rem] text-(--lf-dimmed) shrink-0">
              <ZoomIn size={11} />
              <span>Scroll to zoom</span>
            </div>
          </div>
        </div>
      ) : (
        /* Bar List View */
        <div className="flex flex-col divide-y divide-(--lf-border-alpha)">
          {countries.slice(0, 8).map((row) => {
            const flag = getCountryFlag(row.country);
            const name = formatCountryName(row.country);
            const pct = totalCount > 0 ? Math.round((row.count / totalCount) * 100) : 0;

            return (
              <div key={row.country} className="flex items-center justify-between gap-3 py-1.5">
                <div className="flex items-center gap-2 min-w-0">
                  {flag && <span className="text-[0.9rem] leading-none shrink-0">{flag}</span>}
                  <span className="text-[0.8rem] text-(--lf-ink) truncate">{name}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <div className="w-20 h-1.5 rounded-full bg-(--lf-border-alpha) overflow-hidden">
                    <div
                      className="h-full bg-(--lf-ink) rounded-full transition-all duration-300"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-[0.72rem] text-(--lf-muted) font-mono w-10 text-right">
                    {row.count} ({pct}%)
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
