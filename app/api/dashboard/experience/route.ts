import { NextResponse, NextRequest } from "next/server";
import { SingleExperience } from "@/lib/schemas/experience";
import { prisma } from "@/lib/prisma";
import { verifySessionAndProfile } from "@/lib/auth-api";

export async function POST(request: NextRequest) {
  const { errorResponse, profile } = await verifySessionAndProfile();
  if (errorResponse) return errorResponse;

  try {
    const { experience } = await request.json() as {
      experience?: SingleExperience;
    };

    const profileId = profile!.id;

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
      const existingExp = await prisma.experience.findFirst({
        where: { id: experience.id, profileId },
      });

      if (!existingExp) {
        return NextResponse.json({ error: "Experience not found or unauthorized." }, { status: 403 });
      }

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
