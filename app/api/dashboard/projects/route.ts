import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import {ProjectsSchema} from "@/lib/schemas/projects";
import { verifySessionAndProfile } from "@/lib/auth/auth-api";
import { revalidateProfile } from "@/lib/cache/revalidate";
import { parseOptionalDate } from "@/lib/utils/experience";
import { isBlankProject, validateProject } from "@/lib/utils/validate-dashboard";

export async function POST(req: NextRequest) {
  const { errorResponse, profile } = await verifySessionAndProfile();
  if (errorResponse) return errorResponse;

  try {
    const { projects } = (await req.json()) as {
        projects?: ProjectsSchema["projects"];
    };

    if(!projects){
        return NextResponse.json({error:"Fields are missing in project form"}, {status: 400});
    }

    const profileId = profile!.id;
    const nonBlankProjects = projects.filter((project) => !isBlankProject(project));

    for (const project of nonBlankProjects) {
      const validation = validateProject(project);
      if (!validation.ok) {
        return NextResponse.json({ error: validation.error }, { status: 400 });
      }
    }
    
    await prisma.project.deleteMany({
        where: { profileId }
    });

    const createProjects = await prisma.project.createMany({
        data: nonBlankProjects.map((project)=>({
            profileId: profileId,
            title: project.title!.trim(),
            description: project.description,
            enddate: parseOptionalDate(project.enddate),
            githubLink: project.githubLink,
            projectLink: project.projectLink,
            techstack: Array.isArray(project.techstack) ? project.techstack : [],
            isenable: project.isenable ?? true,
        }))
    });

    revalidateProfile(profile.username);

    return NextResponse.json({data: createProjects}, {status: 200});

  } catch (error) {
    console.log("error in create projects api: ", error);
    return NextResponse.json(
      { error: "error in create projects api" },
      { status: 500 },
    );
  }
}
