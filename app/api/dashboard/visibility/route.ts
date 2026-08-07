import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { verifySessionAndProfile } from "@/lib/auth/auth-api";
import { revalidateProfile } from "@/lib/cache/revalidate";
import { VisibilityPayload } from "@/lib/utils/utils";

export async function PATCH(request: NextRequest) {
  const { errorResponse, profile } = await verifySessionAndProfile();
  if (errorResponse) return errorResponse;

  try {
    const { target, id, isenable } = (await request.json()) as VisibilityPayload;

    if (!target || !id || typeof isenable !== "boolean") {
      return NextResponse.json(
        { error: "Missing target, id, or visibility value." },
        { status: 400 },
      );
    }

    if (target === "skills") {
      if (id !== profile!.id) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
      await prisma.profile.update({
        where: { id },
        data: { skillsIsenable: isenable },
      });
      revalidateProfile(profile!.username);
      return NextResponse.json(
        { data: { id, skillsIsenable: isenable } },
        { status: 200 },
      );
    }

    const data = { isenable };

    if (target === "link") {
      const link = await prisma.links.findFirst({ where: { id, profileId: profile!.id } });
      if (!link) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
      const result = await prisma.links.update({ where: { id }, data });
      return NextResponse.json({ data: result }, { status: 200 });
    } else if (target === "experience") {
      const exp = await prisma.experience.findFirst({ where: { id, profileId: profile!.id } });
      if (!exp) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
      const result = await prisma.experience.update({ where: { id }, data });
      return NextResponse.json({ data: result }, { status: 200 });
    } else if (target === "project") {
      const proj = await prisma.project.findFirst({ where: { id, profileId: profile!.id } });
      if (!proj) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
      const result = await prisma.project.update({ where: { id }, data });
      return NextResponse.json({ data: result }, { status: 200 });
    } else {
      const blog = await prisma.blog.findFirst({ where: { id, profileId: profile!.id } });
      if (!blog) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
      const result = await prisma.blog.update({ where: { id }, data });
      revalidateProfile(profile!.username);
      return NextResponse.json({ data: result }, { status: 200 });
    }
  } catch (error) {
    console.error("Failed to update visibility", error);
    return NextResponse.json(
      { error: "Failed to update visibility." },
      { status: 500 },
    );
  }
}
