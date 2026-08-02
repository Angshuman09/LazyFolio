import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { LinkType } from "@/db/enums";
import { verifySessionAndProfile } from "@/lib/auth/auth-api";

type LinkInput = {
    id?: string;
    url: string;
    label: string;
    type: LinkType;
    isenable?: boolean;
}

type ProfileId = string;


export async function POST(request: NextRequest) {
    const { errorResponse, profile } = await verifySessionAndProfile();
    if (errorResponse) return errorResponse;

    try {
        const { link } = (await request.json()) as { link: LinkInput };

        if (!link) {
            return NextResponse.json({ error: "Missing link in request body." }, { status: 400 });
        }

        const profileId = profile!.id;

        const linkData = {
            url: link.url,
            label: link.label,
            type: link.type ?? LinkType.CUSTOM,
            profileId: profileId,
            ...(typeof link.isenable === "boolean" ? { isenable: link.isenable } : {}),
        };

        if (link.id) {
            const existingLink = await prisma.links.findFirst({
                where: {
                    id: link.id,
                    profileId: profileId,
                },
            });

            if (!existingLink) {
                return NextResponse.json({ error: "Link not found or unauthorized." }, { status: 403 });
            }

            const updatedLink = await prisma.links.update({
                where: {
                    id: link.id
                },
                data: linkData
            });

            return NextResponse.json({ data: updatedLink, message: "Link updated successfully." }, { status: 200 });
        }

        const existLink = await prisma.links.findFirst({
            where: {
                url: link.url,
                profileId
            }
        })

        if(existLink){
            const updatedLink = await prisma.links.update({
                where: {
                    id: existLink.id
                },
                data: linkData
            })
            return NextResponse.json({ data: updatedLink, message: "Link updated successfully." }, { status: 200 });
        }

        const createdLink = await prisma.links.create({
            data: linkData
        });

        return NextResponse.json({ data: createdLink, message: "Link created successfully." }, { status: 201 });
    } catch (error) {        
        console.error("Error creating link:", error);
        return NextResponse.json({ error: "An error occurred while creating the link." }, { status: 500 });
    }
}
