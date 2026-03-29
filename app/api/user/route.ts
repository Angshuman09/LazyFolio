import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { clerkId, email } = await req.json();
    if (!clerkId || !email) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
    const user = await prisma.user.findUnique({
      where: {
        clerkId,
      },
    });
    if (user) {
      return NextResponse.json({ user }, { status: 200 });
    }
    const newUser = await prisma.user.create({
      data: {
        clerkId,
        email,
      },
    });
    return NextResponse.json({ user: newUser }, { status: 200 });
  } catch (error) {
    console.log("error in user route", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request){
    try {
    const { searchParams } = new URL(req.url);
    const clerkId = searchParams.get('clerkId');
    if (!clerkId) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
    const user = await prisma.user.findUnique({
      where: {
        clerkId,
      },
    });
    if (!user) {
      return NextResponse.json({error:"user not found"},{status: 404});
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.log("error in user route", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}