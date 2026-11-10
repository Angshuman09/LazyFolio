-- Add manual ordering to the reorderable portfolio sections so users can
-- arrange items (Linktree-style) instead of relying on insertion order.
-- Existing rows are backfilled with a per-owner sequence based on createdAt.

-- AlterTable
ALTER TABLE "links" ADD COLUMN "order" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "Experience" ADD COLUMN "order" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "Blog" ADD COLUMN "order" INTEGER NOT NULL DEFAULT 0;

-- Backfill: oldest first, per owner
WITH ranked AS (
  SELECT id,
         ROW_NUMBER() OVER (PARTITION BY "profileId" ORDER BY "createdAt" ASC, id ASC) - 1 AS rn
  FROM "links"
)
UPDATE "links" l SET "order" = ranked.rn FROM ranked WHERE l.id = ranked.id;

WITH ranked AS (
  SELECT id,
         ROW_NUMBER() OVER (PARTITION BY "profileId" ORDER BY "createdAt" ASC, id ASC) - 1 AS rn
  FROM "Experience"
)
UPDATE "Experience" e SET "order" = ranked.rn FROM ranked WHERE e.id = ranked.id;

-- Articles (INTERNAL) and external blogs (EXTERNAL) are ordered independently
WITH ranked AS (
  SELECT id,
         ROW_NUMBER() OVER (PARTITION BY "profileId", "type" ORDER BY "createdAt" ASC, id ASC) - 1 AS rn
  FROM "Blog"
)
UPDATE "Blog" b SET "order" = ranked.rn FROM ranked WHERE b.id = ranked.id;

-- Project.order goes from nullable to NOT NULL with a default; backfill nulls first
WITH ranked AS (
  SELECT id,
         ROW_NUMBER() OVER (PARTITION BY "profileId" ORDER BY "createdAt" ASC, id ASC) - 1 AS rn
  FROM "Project"
  WHERE "order" IS NULL
)
UPDATE "Project" p SET "order" = ranked.rn FROM ranked WHERE p.id = ranked.id;

ALTER TABLE "Project" ALTER COLUMN "order" SET NOT NULL, ALTER COLUMN "order" SET DEFAULT 0;
