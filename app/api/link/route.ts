import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { LinkType } from "@/db/enums";
import { Link } from "lucide-react";

type LinkInput = {
    url: string;
    label: string;
    type: LinkType
}

type ProfileId = string;


export async function POST(request: NextRequest) {
    try {
        const { link, profileId } = (await request.json()) as { link: LinkInput; profileId: ProfileId };

        if (!link || !profileId) {
            return NextResponse.json({ error: "Missing link or profileId in request body." }, { status: 400 });
        }

        const existLink = await prisma.links.findFirst({
            where: {
                url: link.url,
                profileId
            }
        })

        if(existLink){
            existLink.label = link.label;
            existLink.type = link.type ?? LinkType.CUSTOM;
            await prisma.links.update({
                where: {
                    id: existLink.id
                },
                data: existLink
            })
            return NextResponse.json({ message: "Link updated successfully." }, { status: 200 });
        }

        await prisma.links.create({
            data: {
                url: link.url,
                label: link.label,
                type: link.type ?? LinkType.CUSTOM,
                profileId: profileId
            }
        });

        return NextResponse.json({ message: "Link created successfully." }, { status: 201 });
    } catch (error) {        
        console.error("Error creating link:", error);
        return NextResponse.json({ error: "An error occurred while creating the link." }, { status: 500 });
    }
}