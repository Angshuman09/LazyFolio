import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server"; 
import {SkillsSchema} from "@/schemas/skills";

export async function POST(req: NextRequest){
    try {
        const { userId, skills } = (await req.json()) as {
            userId?: string;
            skills?: SkillsSchema["skills"];
        };

        if(!userId || !skills){
            return NextResponse.json({error: "fields are missing in the skills form"}, {status:404});
        }

        const createskills = await prisma.profile.update({
            where:{
                id: userId
            },
            data:{
                skills: skills.map((skill) => skill.value ?? "")
            }
        })

        return NextResponse.json({dat: createskills}, {status: 200});
        
    } catch (error) {
    console.log("error in create skills api: ", error);
    return NextResponse.json({error: "error in create skills api"},{status: 500})
    }
}
