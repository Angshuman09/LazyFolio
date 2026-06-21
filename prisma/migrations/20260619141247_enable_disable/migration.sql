-- AlterTable
ALTER TABLE "Blog" ADD COLUMN     "isenable" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Experience" ADD COLUMN     "isenable" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "isenable" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "links" ADD COLUMN     "isenable" BOOLEAN NOT NULL DEFAULT true;
