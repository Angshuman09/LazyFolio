import {v2 as cloudinary} from 'cloudinary';
import { NextRequest } from 'next/server';
import { Readable } from 'stream';

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
    api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
})

export async function POST(req: NextRequest){
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File | null;

        if(!file){
            return Response.json({error: 'No file uploaded'}, {status: 400});
        }

        const bytes = await file?.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const result = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: "lazyfolio",
                    resource_type: "auto"
                },
                (error: any, result: any) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result);
                    }
                }
            );
            Readable.from(buffer).pipe(uploadStream);
        });

        return Response.json({url: (result as any).secure_url});
    } catch (error) {
        console.error('Error uploading image:', error);
        return Response.json({error: 'Failed to upload image'}, {status: 500});
    }
}

function extractPublicId(url: string): string | null {
  try {
    const match = url.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.[a-z]+)?$/i);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}

export async function deleteFromCloudinary(url: string) {
  const publicId = extractPublicId(url);
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    console.error("Failed to delete from Cloudinary:", err);
    throw new Error("Failed to delete from Cloudinary");
  }
}