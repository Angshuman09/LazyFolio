import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const {profileId, projects} = await req.json();

    if(!profileId || !projects){
        return NextResponse.json({error:"Fields are missing in project form"}, {status: 404});
    }
    
    await prisma.project.deleteMany({
        where: { profileId }
    });

    const createProjects = await prisma.project.createMany({
        data: projects.map((project:any)=>({
            profileId: profileId,
            title: project.title,
            description: project.description,
            enddate: project.enddate ? new Date(project.enddate) : null,
            githubLink: project.githubLink,
            projectLink: project.projectLink,
            techstack: project.techstack
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
