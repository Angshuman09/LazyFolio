import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

type ProjectInput = {
  id?: string;
  title?: string;
  description?: string;
  githubLink?: string;
  projectLink?: string;
  techstack?: string;
  enddate?: string;
  isenable?: boolean;
};

function parseOptionalDate(value: string | null | undefined) {
  if (!value?.trim()) {
    return null;
  }

  const parsedDate = new Date(value);
  return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
}

export async function POST(request: NextRequest) {
  try {
    const { project, profileId } = (await request.json()) as {
      project?: ProjectInput;
      profileId?: string;
    };

    if (!project || !profileId) {
      return NextResponse.json(
        { error: "Missing project or profileId in request body." },
        { status: 400 }
      );
    }

    const techstackArray = project.techstack
      ? project.techstack
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean)
      : [];

    const projectData = {
      profileId,
      title: project.title?.trim() || null,
      description: project.description?.trim() || null,
      githubLink: project.githubLink?.trim() || null,
      projectLink: project.projectLink?.trim() || null,
      techstack: techstackArray,
      enddate: parseOptionalDate(project.enddate),
      ...(typeof project.isenable === "boolean" ? { isenable: project.isenable } : {}),
    };

    if (project.id) {
      const updatedProject = await prisma.project.update({
        where: {
          id: project.id,
        },
        data: projectData,
      });

      return NextResponse.json(
        { data: updatedProject, message: "Project updated successfully." },
        { status: 200 }
      );
    }

    const createdProject = await prisma.project.create({
      data: projectData,
    });

    return NextResponse.json(
      { data: createdProject, message: "Project created successfully." },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving project:", error);
    return NextResponse.json(
      { error: "An error occurred while saving the project." },
      { status: 500 }
    );
  }
}
