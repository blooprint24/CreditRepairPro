import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { v4 as uuidv4 } from "uuid";
import { authOptions } from "@/lib/auth";
import { s3Client } from "@/lib/s3";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { filename, contentType, size } = await request.json();

        if (!filename || !contentType || !size) {
            return new NextResponse("Missing file details", { status: 400 });
        }

        // Limit to 10MB per file
        if (size > 10 * 1024 * 1024) {
            return new NextResponse("File too large (max 10MB)", { status: 400 });
        }

        const fileId = uuidv4();
        const storageKey = `uploads/${(session.user as any).id}/${fileId}-${filename}`;

        const { url, fields } = await createPresignedPost(s3Client, {
            Bucket: process.env.S3_BUCKET || "credit-reports",
            Key: storageKey,
            Conditions: [
                ["content-length-range", 0, 10485760], // up to 10MB
                ["starts-with", "$Content-Type", ""],
            ],
            Fields: {
                "Content-Type": contentType,
            },
            Expires: 600, // 10 minutes
        });

        // Create a pending upload record
        const upload = await prisma.upload.create({
            data: {
                userId: (session.user as any).id,
                filename,
                mimeType: contentType,
                size,
                storageKey,
                status: "PENDING",
            },
        });

        return NextResponse.json({ url, fields, uploadId: upload.id });
    } catch (error: any) {
        console.error("UPLOAD_INIT_ERROR", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
