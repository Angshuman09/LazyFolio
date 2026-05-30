import { NextResponse, NextRequest } from "next/server";


export async function POST(request: NextRequest) {
  try{
    const {profileId, project} = await request.json();

    if(!profileId || !project){
        return NextResponse.json({error:"Fields are missing in project form"}, {status: 404});
    }

    
  }catch(error){
    console.error("Error in POST /api/project:", error);
    return NextResponse.json({ error: "Internal Server Error in POST /api/project" }, { status: 500 });
  }
}