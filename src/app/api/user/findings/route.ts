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

        const userId = (session.user as any).id;

        const [findings, uploads] = await Promise.all([
            prisma.finding.findMany({
                where: { userId },
                orderBy: { createdAt: "desc" },
            }),
            prisma.upload.findMany({
                where: { userId },
                include: { reports: true },
                orderBy: { createdAt: "desc" },
            })
        ]);

        return NextResponse.json({ findings, uploads });
    } catch (error: any) {
        console.error("DATA_FETCH_ERROR", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function PATCH(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await request.json();
        const { findingId, isApproved } = body;

        const finding = await prisma.finding.update({
            where: { id: findingId, userId: (session.user as any).id },
            data: { isApproved },
        });

        return NextResponse.json(finding);
    } catch (error: any) {
        console.error("FINDING_UPDATE_ERROR", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
