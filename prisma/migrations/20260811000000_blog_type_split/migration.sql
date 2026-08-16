-- CreateEnum
CREATE TYPE "BlogType" AS ENUM ('INTERNAL', 'EXTERNAL');

-- AlterTable
ALTER TABLE "Blog" ADD COLUMN "type" "BlogType";

UPDATE "Blog"
SET "type" = CASE
    WHEN "content" IS NULL THEN 'EXTERNAL'::"BlogType"
    ELSE 'INTERNAL'::"BlogType"
END;

ALTER TABLE "Blog" ALTER COLUMN "type" SET NOT NULL;
ALTER TABLE "Blog" ALTER COLUMN "type" SET DEFAULT 'INTERNAL';

ALTER TABLE "Blog" RENAME COLUMN "isenable" TO "isEnabled";

UPDATE "Blog" SET "title" = 'Untitled' WHERE "title" IS NULL OR btrim("title") = '';
ALTER TABLE "Blog" ALTER COLUMN "title" SET NOT NULL;

DELETE FROM "Blog" WHERE "profileId" IS NULL;
ALTER TABLE "Blog" DROP CONSTRAINT "Blog_profileId_fkey";
ALTER TABLE "Blog" ALTER COLUMN "profileId" SET NOT NULL;
ALTER TABLE "Blog" ADD CONSTRAINT "Blog_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Blog" DROP COLUMN "enddate";
