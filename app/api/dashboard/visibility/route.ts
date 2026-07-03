import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

type VisibilityTarget = "link" | "experience" | "project" | "blog" | "skills";

type VisibilityPayload = {
  target?: VisibilityTarget;
  id?: string;
  isenable?: boolean;
};

export async function PATCH(request: NextRequest) {
  try {
    const { target, id, isenable } = (await request.json()) as VisibilityPayload;

    if (!target || !id || typeof isenable !== "boolean") {
      return NextResponse.json(
        { error: "Missing target, id, or visibility value." },
        { status: 400 },
      );
    }

    if (target === "skills") {
      await prisma.profile.update({
        where: { id },
        data: { skillsIsenable: isenable },
      });
      return NextResponse.json(
        { data: { id, skillsIsenable: isenable } },
        { status: 200 },
      );
    }

    const data = { isenable };
    const result =
      target === "link"
        ? await prisma.links.update({ where: { id }, data })
        : target === "experience"
          ? await prisma.experience.update({ where: { id }, data })
          : target === "project"
            ? await prisma.project.update({ where: { id }, data })
            : await prisma.blog.update({ where: { id }, data });

    return NextResponse.json({ data: result }, { status: 200 });
  } catch (error) {
    console.error("Failed to update visibility", error);
    return NextResponse.json(
      { error: "Failed to update visibility." },
      { status: 500 },
    );
  }
}
