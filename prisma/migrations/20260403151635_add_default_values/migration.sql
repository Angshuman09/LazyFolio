/*
  Warnings:

  - You are about to drop the column `skils` on the `Profile` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[username]` on the table `Profile` will be added. If there are existing duplicate values, this will fail.
  - Made the column `themeId` on table `Profile` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Blog" ALTER COLUMN "title" SET DEFAULT 'Blog Title',
ALTER COLUMN "description" SET DEFAULT 'Blog Description',
ALTER COLUMN "date" SET DEFAULT 'Date',
ALTER COLUMN "blogLink" SET DEFAULT 'https://medium.com/@angshumankashyap69yap69/what-really-happens-inside-a-database-531256185ddf';

-- AlterTable
ALTER TABLE "Experience" ALTER COLUMN "companyName" SET DEFAULT 'Company Name',
ALTER COLUMN "role" SET DEFAULT 'Role',
ALTER COLUMN "date" SET DEFAULT 'Date',
ALTER COLUMN "description" SET DEFAULT 'Description';

-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "skils",
ADD COLUMN     "skills" TEXT[] DEFAULT ARRAY['JavaScript', 'TypeScript', 'React', 'Node.js', 'Python']::TEXT[],
ALTER COLUMN "bio" SET DEFAULT 'I am a software developer with a passion for creating innovative solutions. I have experience in various programming languages and frameworks, and I enjoy working on both frontend and backend development. In my free time, I like to contribute to open source projects and write technical blogs.',
ALTER COLUMN "github" SET DEFAULT 'https://github.com/Angshuman09',
ALTER COLUMN "twitter" SET DEFAULT 'https://x.com/angshuhere',
ALTER COLUMN "linkedin" SET DEFAULT 'https://www.linkedin.com/in/angshuman-kashyap-65a573379/',
ALTER COLUMN "age" SET DEFAULT 21,
ALTER COLUMN "avatar" SET DEFAULT 'https://i.pinimg.com/736x/dc/92/1e/dc921ec2e07f9437dc51f2a10694578d.jpg',
ALTER COLUMN "banner" SET DEFAULT 'https://images.unsplash.com/photo-1503264116251-35a269479413',
ALTER COLUMN "location" SET DEFAULT 'India',
ALTER COLUMN "name" SET DEFAULT 'Wamiqa Gabbi',
ALTER COLUMN "themeId" SET NOT NULL,
ALTER COLUMN "themeId" SET DEFAULT '1',
ALTER COLUMN "username" SET DEFAULT 'angshuman69',
ALTER COLUMN "email" SET DEFAULT 'angshumankashyap69yap69@gmail.com';

-- AlterTable
ALTER TABLE "Project" ALTER COLUMN "title" SET DEFAULT 'Project Title',
ALTER COLUMN "description" SET DEFAULT 'Project Description',
ALTER COLUMN "date" SET DEFAULT 'Date',
ALTER COLUMN "githubLink" SET DEFAULT 'https://github.com/Angshuman09/LazyFolio',
ALTER COLUMN "projectLink" SET DEFAULT 'https://github.com/Angshuman09/LazyFolio',
ALTER COLUMN "techstack" SET DEFAULT ARRAY['JavaScript', 'TypeScript', 'React', 'Node.js', 'Python']::TEXT[];

-- CreateIndex
CREATE UNIQUE INDEX "Profile_username_key" ON "Profile"("username");
