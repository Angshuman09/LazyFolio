import { NextResponse, NextRequest } from "next/server";
import { SingleExperience } from "@/lib/schemas/experience";
import {prisma} from "@/lib/prisma";

export async function POST(request: NextRequest){
    try{
        const { profileId, experience } = await request.json() as {
            profileId?: string;
            experience?: SingleExperience;
        };

        if(!profileId ){
            return NextResponse.json({error: "User ID is required"}, {status: 400});
        }

        const createdExperience = await prisma.experience.create({
            data: {
                profileId: profileId,
                companyName: experience?.companyName,
                role: experience?.role,
                startdate: experience?.startdate ? new Date(experience.startdate) : null,
                enddate: experience?.enddate ? new Date(experience.enddate) : null,
                description: experience?.description,
            }
        });

        return NextResponse.json(createdExperience, {status: 200});
    }catch(error){
        console.log("Error in experience route", error);
        return NextResponse.json({error: "Internal server error"}, {status: 500});
    }
}