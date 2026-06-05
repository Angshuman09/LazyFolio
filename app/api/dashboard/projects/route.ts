import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import {ProjectsSchema} from "@/lib/schemas/projects";

function parseOptionalDate(value: string | null | undefined) {
    if (!value?.trim()) {
        return null;
    }

    const parsedDate = new Date(value);
    return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
}

export async function POST(req: NextRequest) {
  try {
    const { profileId, projects } = (await req.json()) as {
        profileId?: string;
        projects?: ProjectsSchema["projects"];
    };

    if(!profileId || !projects){
        return NextResponse.json({error:"Fields are missing in project form"}, {status: 404});
    }
    
    await prisma.project.deleteMany({
        where: { profileId }
    });

    const createProjects = await prisma.project.createMany({
        data: projects.map((project)=>({
            profileId: profileId,
            title: project.title,
            description: project.description,
            enddate: parseOptionalDate(project.enddate),
            githubLink: project.githubLink,
            projectLink: project.projectLink,
            techstack: Array.isArray(project.techstack) ? project.techstack : []
        }))
    });

    return NextResponse.json({data: createProjects}, {status: 200});

  } catch (error) {
    console.log("error in create projects api: ", error);
    return NextResponse.json(
      { error: "error in create projects api" },
      { status: 500 },
    );
  }
}
