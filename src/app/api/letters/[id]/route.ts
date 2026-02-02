import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { contentHtml } = await request.json();

        const letter = await prisma.letter.update({
            where: { id: id, userId: (session.user as any).id },
            data: {
                contentHtml,
                version: { increment: 1 }
            },
        });

        return NextResponse.json(letter);
    } catch (error: any) {
        console.error("LETTER_UPDATE_ERROR", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
