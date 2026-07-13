import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server"; 
import { SkillsSchema } from "@/lib/schemas/skills";
import { verifySessionAndProfile } from "@/lib/auth-api";
import { revalidateProfile } from "@/lib/cache/revalidate";

export async function POST(req: NextRequest){
    const { errorResponse, profile } = await verifySessionAndProfile();
    if (errorResponse) return errorResponse;

    try {
        const { skills } = (await req.json()) as {
            skills?: SkillsSchema["skills"];
        };

        if(!skills){
            return NextResponse.json({error: "fields are missing in the skills form"}, {status:400});
        }

        const createskills = await prisma.profile.update({
            where:{
                id: profile!.id
            },
            data:{
                skills: skills.map((skill) => JSON.stringify({ value: skill.value ?? "", isenable: skill.isenable ?? true }))
            },
            select:{
                id: true,
                skills: true
            }
        })

        revalidateProfile(profile.username);

        return NextResponse.json({dat: createskills}, {status: 200});
        
    } catch (error) {
    console.log("error in create skills api: ", error);
    return NextResponse.json({error: "error in create skills api"},{status: 500})
    }
}
