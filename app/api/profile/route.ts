import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export async function GET(request: NextRequest){
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
        return NextResponse.json({ error: "Missing userId parameter" }, { status: 400 });
    }

    try {
        const profile = await prisma.profile.findUnique({
            where: { userId },
            include: {
                experiences: true,
                projects: true,
                blogs: true,
            },
        });
        return NextResponse.json(profile, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    const { userId, name, bio } = await request.json();

    if (!userId || !name) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    try {
        const existingProfile = await prisma.profile.findUnique({ where: { userId } });
        if (existingProfile) {
            return NextResponse.json({ error: "Profile already exists for this user" }, { status: 400 });
        }
        
        const profile = await prisma.profile.create({
            data: {
                userId,
                name,
                bio,
            },
        });
        return NextResponse.json(profile, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to create profile" }, { status: 500 });
    }
}