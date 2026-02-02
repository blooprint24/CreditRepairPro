import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await request.json();
        const {
            fullName,
            phone,
            addressLine1,
            addressLine2,
            city,
            state,
            zipCode,
            identityApproved
        } = body;

        const profile = await prisma.profile.update({
            where: {
                userId: (session.user as any).id,
            },
            data: {
                fullName,
                phone,
                addressLine1,
                addressLine2,
                city,
                state,
                zipCode,
                identityApproved,
            },
        });

        return NextResponse.json(profile);
    } catch (error: any) {
        console.error("PROFILE_UPDATE_ERROR", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
