```txt
pnpm install
pnpm dev
```

```txt
pnpm deploy
```

## Tinybird

Tinybird resources (datasources and endpoints) are defined in `src/lib/tinybird.ts`
with the `@tinybirdco/sdk`. The `tinybird` CLI ships with that dependency.

```txt
pnpm tinybird:dev      # watch + sync to a Tinybird branch
pnpm tinybird:build    # build + push to a Tinybird branch
pnpm tinybird:deploy   # deploy to the production workspace
pnpm tinybird:preview  # create/replace the CI preview branch
```

Set `TINYBIRD_TOKEN` in `.env.local` (created by `pnpm exec tinybird login`) for local
use, and as a repository secret for CI/CD.

[For generating/synchronizing types based on your Worker configuration run](https://developers.cloudflare.com/workers/wrangler/commands/#types):

```txt
pnpm cf-typegen
```

Pass the `CloudflareBindings` as generics when instantiating `Hono`:

```ts
// src/index.ts
const app = new Hono<{ Bindings: CloudflareBindings }>()
```
