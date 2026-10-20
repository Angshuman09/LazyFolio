import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import { ProjectsSchema } from "@/lib/schemas/projects";
import { verifySessionAndProfile } from "@/lib/auth/auth-api";
import { revalidateProfile } from "@/lib/cache/revalidate";
import { handleApiError } from "@/lib/errors/api";
import { diffCollection } from "@/lib/utils/collection-sync";
import { parseOptionalDate } from "@/lib/utils/date";
import { isBlankProject, validateProject } from "@/lib/utils/validate-dashboard";

type ProjectInput = NonNullable<ProjectsSchema["projects"]>[number];

function toProjectData(project: ProjectInput) {
  return {
    title: project.title!.trim(),
    description: project.description?.trim() || null,
    enddate: parseOptionalDate(project.enddate),
    githubLink: project.githubLink?.trim() || null,
    projectLink: project.projectLink?.trim() || null,
    techstack: Array.isArray(project.techstack) ? project.techstack : [],
    isenable: project.isenable ?? true,
  };
}

function sameDate(a: Date | null, b: Date | null) {
  return (a?.getTime() ?? null) === (b?.getTime() ?? null);
}

function sameTechstack(a: string[], b: string[]) {
  return a.length === b.length && a.every((value, index) => value === b[index]);
}

export async function POST(req: NextRequest) {
  const { errorResponse, profile } = await verifySessionAndProfile();
  if (errorResponse) return errorResponse;

  try {
    const { projects } = (await req.json()) as {
      projects?: ProjectsSchema["projects"];
    };

    if (!projects) {
      return NextResponse.json(
        { error: "Fields are missing in project form" },
        { status: 400 },
      );
    }

    const profileId = profile!.id;
    const nonBlankProjects = projects.filter(
      (project) => !isBlankProject(project),
    );

    for (const project of nonBlankProjects) {
      const validation = validateProject(project);
      if (!validation.ok) {
        return NextResponse.json({ error: validation.error }, { status: 400 });
      }
    }

    const existingProjects = await prisma.project.findMany({
      where: { profileId },
    });

    const { creates, updates, removedIds } = diffCollection(
      existingProjects,
      nonBlankProjects,
      (existing, project) => {
        const next = toProjectData(project);
        return (
          existing.title === next.title &&
          existing.description === next.description &&
          sameDate(existing.enddate, next.enddate) &&
          existing.githubLink === next.githubLink &&
          existing.projectLink === next.projectLink &&
          sameTechstack(existing.techstack, next.techstack) &&
          existing.isenable === next.isenable
        );
      },
    );

    const operations = [
      ...(removedIds.length
        ? [
            prisma.project.deleteMany({
              where: { profileId, id: { in: removedIds } },
            }),
          ]
        : []),
      ...updates.map((project) =>
        prisma.project.update({
          where: { id: project.id! },
          data: toProjectData(project),
        }),
      ),
      ...(creates.length
        ? [
            prisma.project.createMany({
              data: creates.map((project) => ({
                profileId,
                ...toProjectData(project),
              })),
            }),
          ]
        : []),
    ];

    if (operations.length) {
      await prisma.$transaction(operations);
    }

    revalidateProfile(profile.username);

    return NextResponse.json(
      {
        data: {
          created: creates.length,
          updated: updates.length,
          deleted: removedIds.length,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    return handleApiError(error, "projects/save");
  }
}
