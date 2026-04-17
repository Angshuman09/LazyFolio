import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest){
  try {
    const {profileId, links} = await req.json();
    if(!profileId || !links){
      return NextResponse.json({error: "field is missing in links form"}, {status: 400});
    }

    await prisma.links.deleteMany({
      where: {profileId}
    })

    const createLinks = await prisma.links.createMany({
      data: links.map((link: any)=>({
        profileId: profileId,
        type: link.type,
        label: link.label,
        url: link.url
      }))
    })

    return NextResponse.json({data: createLinks}, {status: 200});
    
  } catch (error) {
    console.log("error in create links api: ", error);
    return NextResponse.json({error: "error in create link api"},{status: 500})
  }
}