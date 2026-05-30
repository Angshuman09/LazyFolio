import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { LinkType } from "@/db/enums";

type LinkInput = {
  type?: LinkType;
  label?: string;
  url?: string;
};

export async function POST(req: NextRequest){
  try {
    const { profileId, links } = (await req.json()) as {
      profileId?: string;
      links?: LinkInput[];
    };
    if(!profileId || !links){
      return NextResponse.json({error: "field are missing in links form"}, {status: 400});
    }

    await prisma.links.deleteMany({
      where: {profileId}
    })

    const createLinks = await prisma.links.createMany({
      data: links.map((link)=>({
        profileId: profileId,
        type: link.type ?? LinkType.CUSTOM,
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
