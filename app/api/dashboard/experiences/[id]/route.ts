import {NextResponse, NextRequest} from 'next/server'
import { prisma } from '@/lib/prisma';
export async function DELETE(req: NextRequest){
    try {
        const {id} = (await req.json()) as {id: string};

        await prisma.experience.delete({
            where:{id},
            select:{id: true}
        })

        NextResponse.json({message: "experience deleted successfully"},{status: 200});
    } catch (error) {
        console.log("error in deleting an experience: ", error);
        NextResponse.json({message: `error in deleting an experience: ${error}`}, {status: 500});
    }
}