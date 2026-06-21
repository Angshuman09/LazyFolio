import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import { deleteFromCloudinary } from "../upload/route";

export async function POST(request: NextRequest) {
    try {
        const { avatar, avatarPublicId, banner, bannerPublicId, userId } = (await request.json()) as { 
            avatar?: string | null, 
            avatarPublicId?: string | null,
            banner?: string | null, 
            bannerPublicId?: string | null,
            userId?: string 
        };

        if (!userId) {
            return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
        }

        if (avatar === undefined && banner === undefined) {
            return NextResponse.json({ error: 'No images provided' }, { status: 400 });
        }

        const currentprofile = await prisma.profile.findUnique({
            where: { userId: userId },
            select:
            {
                avatar: true,
                avatarPublicId: true,
                banner: true,
                bannerPublicId: true
            }
        });
        if (!currentprofile) {
            return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
        }

        if (avatar !== undefined && currentprofile.avatar && currentprofile.avatar !== avatar) {
            if (currentprofile.avatarPublicId) {
                await deleteFromCloudinary(currentprofile.avatarPublicId);
            }
        }

        if (banner !== undefined && currentprofile.banner && currentprofile.banner !== banner) {
            if (currentprofile.bannerPublicId) {
                await deleteFromCloudinary(currentprofile.bannerPublicId);
            }
        }

        const updatedProfile = await prisma.profile.update({
            where: { userId: userId },
            data: {
                avatar,
                avatarPublicId,
                banner,
                bannerPublicId
            },
            select: {
                avatar: true,
                avatarPublicId: true,
                banner: true,
                bannerPublicId: true
            }
        });

        return NextResponse.json({ currentprofile: updatedProfile }, { status: 200 });
    }
    catch (error) {
        console.error('Error updating images:', error);
        return NextResponse.json({ error: 'Failed to update images' }, { status: 500 });
    }
}