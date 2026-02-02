import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password } = body;

        if (!email || !password) {
            return new NextResponse("Missing email or password", { status: 400 });
        }

        const userExists = await prisma.user.findUnique({
            where: { email },
        });

        if (userExists) {
            return new NextResponse("User already exists", { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email,
                hashedPassword,
            },
        });

        // Create an empty profile for the user
        await prisma.profile.create({
            data: {
                userId: user.id,
            },
        });

        return NextResponse.json(user);
    } catch (error: any) {
        console.error("REGISTRATION_ERROR", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
