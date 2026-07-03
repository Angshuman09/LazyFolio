import { NextResponse, NextRequest } from "next/server";
import { SingleExperience } from "@/lib/schemas/experience";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { profileId, experience } = await request.json() as {
      profileId?: string;
      experience?: SingleExperience;
    };

    if (!profileId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const data = {
      profileId: profileId,
      companyName: experience?.companyName || null,
      role: experience?.role || null,
      startdate: experience?.startdate ? new Date(experience.startdate) : null,
      enddate: experience?.enddate ? new Date(experience.enddate) : null,
      description: experience?.description || null,
      ...(typeof experience?.isenable === "boolean" ? { isenable: experience.isenable } : {}),
    };

    if (experience?.id) {
      const updatedExperience = await prisma.experience.update({
        where: { id: experience.id },
        data: data,
      });

      return NextResponse.json({ data: updatedExperience, message: "Experience updated successfully" }, { status: 200 });
    }

    const createdExperience = await prisma.experience.create({
      data: data,
    });

    return NextResponse.json({ data: createdExperience, message: "Experience created successfully" }, { status: 200 });
  } catch (error) {
    console.log("Error in experience route", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
