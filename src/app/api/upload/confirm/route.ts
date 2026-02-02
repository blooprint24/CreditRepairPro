import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getFileBuffer, extractAndRedactText, parseReportText } from "@/lib/parser";
import { analyzeDisputeCandidates } from "@/lib/rules-engine";
// Local types to avoid Prisma client generation issues during build
type Bureau = 'EXPERIAN' | 'EQUIFAX' | 'TRANSUNION' | 'OTHER';

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { uploadId, bureau } = await request.json();

        if (!uploadId || !bureau) {
            return new NextResponse("Missing uploadId or bureau", { status: 400 });
        }

        // 1. Fetch upload record
        const upload = await prisma.upload.findUnique({
            where: { id: uploadId, userId: (session.user as any).id },
        });

        if (!upload) {
            return new NextResponse("Upload not found", { status: 404 });
        }

        // Update status to processing
        await prisma.upload.update({
            where: { id: uploadId },
            data: { status: "PROCESSING" },
        });

        // 2. Process file
        const buffer = await getFileBuffer(upload.storageKey);
        const redactedText = await extractAndRedactText(buffer);
        const parsedData = parseReportText(redactedText);

        // 3. Create Report in DB
        const report = await prisma.report.create({
            data: {
                uploadId: upload.id,
                bureau: bureau.toUpperCase() as Bureau,
                rawTextRedacted: redactedText,
                metadata: {
                    originalFilename: upload.filename,
                    processedAt: new Date().toISOString(),
                }
            }
        });

        // 4. Save parsed items (Tradelines, Collections, Inquiries)
        // For demo purposes, we'll use the heuristic results
        // In production, we'd map these carefully

        // 5. Run Rules Engine
        const candidates = analyzeDisputeCandidates(bureau.toUpperCase() as Bureau, parsedData);

        // 6. Save Findings
        for (const cand of candidates) {
            await prisma.finding.create({
                data: {
                    userId: (session.user as any).id,
                    bureau: cand.bureau,
                    category: cand.category,
                    rationale: cand.rationale,
                    confidence: cand.confidence,
                    isApproved: false, // User must approve these later
                }
            });
        }

        // Update status to completed
        await prisma.upload.update({
            where: { id: uploadId },
            data: { status: "COMPLETED" },
        });

        return NextResponse.json({
            success: true,
            reportId: report.id,
            findingsCount: candidates.length
        });

    } catch (error: any) {
        console.error("ANALYSIS_ERROR", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
