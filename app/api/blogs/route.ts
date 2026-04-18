import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server"; 

export async function POST(req: NextRequest){
    try {
        const {profileId, blogs} = await req.json();

        if(!profileId || !blogs){
            return NextResponse.json({error: "fields are missing in the blog form"}, {status:400});
        }

        await prisma.blog.deleteMany({
            where:{
                profileId
            }
        });

        const createBlogs = await prisma.blog.createMany({
            data: blogs.map((blog:any)=>({
                profileId: profileId,
                title: blog.title,
                description: blog.description,
                enddate: blog.enddate ? new Date(blog.enddate) : null,
                blogLink: blog.blogLink
            }))
        });

        return NextResponse.json({dat: createBlogs}, {status: 200});
        
    } catch (error) {
        console.log("error in create blogs api: ", error);
        return NextResponse.json({error: "error in create blogs api"},{status: 500});
    }
}