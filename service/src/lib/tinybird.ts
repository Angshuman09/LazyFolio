import {
  defineDatasource,
  defineEndpoint,
  Tinybird,
  node,
  t,
  p,
  engine,
} from "@tinybirdco/sdk";

export const events = defineDatasource("events", {
  description: "Events tracking data",
  schema: {
    timestamp: t.dateTime(),
    profile_id: t.string().lowCardinality(),
    event_type: t.string().lowCardinality(),
    label: t.string().nullable(),
    country: t.string().lowCardinality().nullable(),
    device: t.string().lowCardinality().nullable(),
    visitor_hash: t.string(),
  },
  engine: engine.mergeTree({
    sortingKey: ["profile_id", "timestamp", "event_type"],
  }),
});

export const getPageviews = defineEndpoint("get_pageviews", {
  description: "Get pageviews and unique visitors",
  params: {
    profile_id: p.string().describe("Profile ID"),
    start_date: p.dateTime().describe("Start date"),
    end_date: p.dateTime().describe("End date"),
  },
  nodes: [
    node({
      name: "endpoint",
      sql: `
        SELECT
          countIf(event_type = 'pageview') AS pageviews,
          uniqIf(visitor_hash, event_type = 'pageview') AS unique_visitors
        FROM events
        WHERE profile_id = {{String(profile_id)}}
          AND timestamp >= {{DateTime(start_date)}}
          AND timestamp <= {{DateTime(end_date)}}
      `,
    }),
  ],
  output: {
    pageviews: t.uint64(),
    unique_visitors: t.uint64(),
  },
});

export const getTopClicks = defineEndpoint("get_top_clicks", {
  description: "Get top link clicks",
  params: {
    profile_id: p.string().describe("Profile ID"),
    start_date: p.dateTime().describe("Start date"),
    end_date: p.dateTime().describe("End date"),
  },
  nodes: [
    node({
      name: "endpoint",
      sql: `
        SELECT label, count() AS count
        FROM events
        WHERE event_type = 'click'
          AND label IS NOT NULL
          AND profile_id = {{String(profile_id)}}
          AND timestamp >= {{DateTime(start_date)}}
          AND timestamp <= {{DateTime(end_date)}}
        GROUP BY label
        ORDER BY count DESC
      `,
    }),
  ],
  output: {
    label: t.string(),
    count: t.uint64(),
  },
});

export const getTopCountries = defineEndpoint("get_top_countries", {
  description: "Get top countries",
  params: {
    profile_id: p.string().describe("Profile ID"),
    start_date: p.dateTime().describe("Start date"),
    end_date: p.dateTime().describe("End date"),
  },
  nodes: [
    node({
      name: "endpoint",
      sql: `
        SELECT country, count() AS count
        FROM events
        WHERE event_type = 'pageview'
          AND country IS NOT NULL
          AND profile_id = {{String(profile_id)}}
          AND timestamp >= {{DateTime(start_date)}}
          AND timestamp <= {{DateTime(end_date)}}
        GROUP BY country
        ORDER BY count DESC
        LIMIT 5
      `,
    }),
  ],
  output: {
    country: t.string(),
    count: t.uint64(),
  },
});

export const getTopDevices = defineEndpoint("get_top_devices", {
  description: "Get top devices",
  params: {
    profile_id: p.string().describe("Profile ID"),
    start_date: p.dateTime().describe("Start date"),
    end_date: p.dateTime().describe("End date"),
  },
  nodes: [
    node({
      name: "endpoint",
      sql: `
        SELECT device, count() AS count
        FROM events
        WHERE event_type = 'pageview'
          AND device IS NOT NULL
          AND profile_id = {{String(profile_id)}}
          AND timestamp >= {{DateTime(start_date)}}
          AND timestamp <= {{DateTime(end_date)}}
        GROUP BY device
        ORDER BY count DESC
      `,
    }),
  ],
  output: {
    device: t.string(),
    count: t.uint64(),
  },
});

export const getPageviewSeries = defineEndpoint("get_pageview_series", {
  description: "Get daily pageviews series",
  params: {
    profile_id: p.string().describe("Profile ID"),
    start_date: p.dateTime().describe("Start date"),
    end_date: p.dateTime().describe("End date"),
  },
  nodes: [
    node({
      name: "endpoint",
      sql: `
        SELECT toString(toDate(timestamp)) AS date, count() AS views
        FROM events
        WHERE event_type = 'pageview'
          AND profile_id = {{String(profile_id)}}
          AND timestamp >= {{DateTime(start_date)}}
          AND timestamp <= {{DateTime(end_date)}}
        GROUP BY date
        ORDER BY date ASC
      `,
    }),
  ],
  output: {
    date: t.string(),
    views: t.uint64(),
  },
});

export const tinybird = new Tinybird({
  datasources: { events },
  pipes: {
    getPageviews,
    getTopClicks,
    getTopCountries,
    getTopDevices,
    getPageviewSeries,
  },
});
