import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { verifySessionAndProfile } from "@/lib/auth/auth-api";
import { parseOptionalDate } from "@/lib/utils/experience";

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


export async function POST(request: NextRequest) {
  const { errorResponse, profile } = await verifySessionAndProfile();
  if (errorResponse) return errorResponse;

  try {
    const { project } = (await request.json()) as {
      project?: ProjectInput;
    };

    if (!project) {
      return NextResponse.json(
        { error: "Missing project in request body." },
        { status: 400 }
      );
    }

    const profileId = profile!.id;

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
      const existingProject = await prisma.project.findFirst({
        where: {
          id: project.id,
          profileId: profileId,
        },
      });

      if (!existingProject) {
        return NextResponse.json(
          { error: "Project not found or unauthorized." },
          { status: 403 }
        );
      }

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
