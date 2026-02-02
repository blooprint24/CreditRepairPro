import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { BUREAU_DISPUTE_TEMPLATE, generateLetterContent } from "@/lib/templates";

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const userId = (session.user as any).id;

        // 1. Fetch user profile and approved findings
        const [profile, approvedFindings] = await Promise.all([
            prisma.profile.findUnique({ where: { userId } }),
            prisma.finding.findMany({
                where: { userId, isApproved: true },
                orderBy: { bureau: 'asc' }
            })
        ]);

        if (!profile) {
            return new NextResponse("Profile not found", { status: 404 });
        }

        if (approvedFindings.length === 0) {
            return new NextResponse("No approved findings to dispute", { status: 400 });
        }

        // 2. Group findings by bureau
        const findingsByBureau: Record<string, any[]> = {};
        approvedFindings.forEach((f: any) => {
            if (!findingsByBureau[f.bureau]) findingsByBureau[f.bureau] = [];
            findingsByBureau[f.bureau].push(f);
        });

        const createdLetters = [];

        // 3. Generate a letter for each bureau
        for (const [bureau, items] of Object.entries(findingsByBureau)) {
            const content = generateLetterContent(BUREAU_DISPUTE_TEMPLATE, {
                fullName: profile.fullName || "User",
                address: `${profile.addressLine1}, ${profile.city}, ${profile.state} ${profile.zipCode}`,
                dob: profile.dob ? new Date(profile.dob).toLocaleDateString() : 'XX/XX/XXXX',
                bureauName: bureau,
                items: items.map((i: any) => ({ category: i.category, rationale: i.rationale }))
            });

            const letter = await prisma.letter.create({
                data: {
                    userId,
                    bureauOrCreditor: bureau,
                    contentHtml: content,
                    version: 1
                }
            });
            createdLetters.push(letter);
        }

        return NextResponse.json({ success: true, letterCount: createdLetters.length });

    } catch (error: any) {
        console.error("LETTER_GEN_ERROR", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
