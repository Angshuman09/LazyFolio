import { prisma } from "@/lib/prisma";
import {NextResponse, NextRequest} from "next/server";
import { deleteFromCloudinary } from "../upload/route";

export async function POST(request: NextRequest){
    try {
    const {avatar, banner, userId} = (await request.json()) as {avatar?: string, banner?: string, userId?: string};

    if(!avatar && !banner){
        return NextResponse.json({error: 'No images provided'}, {status: 400});
    }

    const profile = await prisma.profile.findUnique({where: {userId: userId}, select: {avatar: true, banner: true}});
    if(!profile){
        return NextResponse.json({error: 'Profile not found'}, {status: 404});
    }

    if(avatar && profile.avatar) await deleteFromCloudinary(profile.avatar);
    if(banner && profile.banner) await deleteFromCloudinary(profile.banner);

    const updatedProfile = await prisma.profile.update({
        where: {userId: userId},
        data: {
            avatar: avatar ?? undefined,
            banner: banner ?? undefined,
        },
        select: {
            avatar: true,
            banner: true,
        }
    });

    return NextResponse.json({updatedProfile}, {status: 200});
}
catch(error){
    console.error('Error deleting images:', error);
    return NextResponse.json({error: 'Failed to delete images'}, {status: 500});
}}