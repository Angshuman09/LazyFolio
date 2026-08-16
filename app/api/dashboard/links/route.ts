import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { LinkType } from "@/db/enums";
import { verifySessionAndProfile } from "@/lib/auth/auth-api";
import { revalidateProfile } from "@/lib/cache/revalidate";
import { LinkInput } from "@/lib/constants/apis";
import { isBlankLink, validateLink } from "@/lib/utils/validate-dashboard";

export async function POST(req: NextRequest){
  const { errorResponse, profile } = await verifySessionAndProfile();
  if (errorResponse) return errorResponse;

  try {
    const { links } = (await req.json()) as {
      links?: LinkInput[];
    };
    if(!links){
      return NextResponse.json({error: "field are missing in links form"}, {status: 400});
    }

    const profileId = profile!.id;
    const nonBlankLinks = links.filter((link) => !isBlankLink(link));

    for (const link of nonBlankLinks) {
      const validation = validateLink(link);
      if (!validation.ok) {
        return NextResponse.json({ error: validation.error }, { status: 400 });
      }
    }

    await prisma.links.deleteMany({
      where: {profileId}
    })

    const createLinks = await prisma.links.createMany({
      data: nonBlankLinks.map((link)=>({
        profileId: profileId,
        type: link.type ?? LinkType.CUSTOM,
        label: link.label.trim(),
        url: link.url.trim(),
        isenable: link.isenable ?? true,
      }))
    })

    revalidateProfile(profile.username);

    return NextResponse.json({data: createLinks}, {status: 200});
    
  } catch (error) {
    console.log("error in create links api: ", error);
    return NextResponse.json({error: "error in create link api"},{status: 500})
  }
}
