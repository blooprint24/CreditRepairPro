import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const letters = await prisma.letter.findMany({
            where: { userId: (session.user as any).id },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json(letters);
    } catch (error: any) {
        console.error("LETTERS_FETCH_ERROR", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
