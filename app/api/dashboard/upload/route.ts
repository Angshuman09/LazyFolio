import { NextRequest } from 'next/server';
import { Readable } from 'stream';
import { cloudinary, deleteFromCloudinary, type UploadApiResponse } from '@/lib/cloudinary';

export async function POST(req: NextRequest){
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File | null;

        if(!file){
            return Response.json({error: 'No file uploaded'}, {status: 400});
        }

        const bytes = await file?.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const result = await new Promise<UploadApiResponse>((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: "lazyfolio",
                    resource_type: "auto"
                },
                (error, result) => {
                    if (error || !result) {
                        reject(error);
                    } else {
                        resolve(result);
                    }
                }
            );
            Readable.from(buffer).pipe(uploadStream);
        });

        return Response.json({url: result.url, publicId: result.public_id});
    } catch (error) {
        console.error('Error uploading image:', error);
        return Response.json({error: 'Failed to upload image'}, {status: 500});
    }
}

export async function DELETE(req: NextRequest) {
  try {
    const { publicId } = (await req.json()) as { publicId?: string };

    if (!publicId) {
      return Response.json({ error: 'Missing publicId' }, { status: 400 });
    }

    await deleteFromCloudinary(publicId);
    return Response.json({ message: 'Image deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting image:', error);
    return Response.json({ error: 'Failed to delete image' }, { status: 500 });
  }
}
