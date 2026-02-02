import { Bureau, FindingCategory } from "@prisma/client";
import { ParsedData } from "./parser";
import { DateTime } from "luxon";

export interface DisputeCandidate {
    bureau: Bureau;
    category: FindingCategory;
    rationale: string;
    confidence: number;
    relatedItemId?: string;
}

/**
 * analyzes parsed report data against a set of credit repair rules.
 */
export function analyzeDisputeCandidates(
    bureau: Bureau,
    data: ParsedData
): DisputeCandidate[] {
    const candidates: DisputeCandidate[] = [];

    // Rule 1: Collections older than 7 years (Potential obsolescence)
    data.collections.forEach((col) => {
        if (col.dofd) {
            const dofdDate = DateTime.fromJSDate(new Date(col.dofd));
            const sevenYearsAgo = DateTime.now().minus({ years: 7 });

            if (dofdDate < sevenYearsAgo) {
                candidates.push({
                    bureau,
                    category: "COLLECTION",
                    relatedItemId: col.id,
                    confidence: 0.95,
                    rationale: `This collection account appears to be older than 7 years (DOFD: ${dofdDate.toISODate()}). Pursuant to FCRA § 605, it may be obsolete and should be removed.`,
                });
            }
        }
    });

    // Rule 2: Duplicate Collections
    // Check for same agency and similar balances
    const seenCollections = new Map<string, any>();
    data.collections.forEach((col) => {
        const key = `${col.agency}-${col.balance}`;
        if (seenCollections.has(key)) {
            candidates.push({
                bureau,
                category: "COLLECTION",
                relatedItemId: col.id,
                confidence: 0.8,
                rationale: "This appears to be a duplicate collection entry for the same debt. Duplicate reporting is inaccurate under the FCRA.",
            });
        } else {
            seenCollections.set(key, col);
        }
    });

    // Rule 3: Late payment inconsistencies
    data.tradelines.forEach((trade) => {
        if (trade.paymentStatus === "Late" && !trade.remarks?.includes("Verified")) {
            // Heuristic: If it's a revolving account with 0 balance marked late
            if (trade.limit > 0 && trade.balance === 0) {
                candidates.push({
                    bureau,
                    category: "TRADELINE",
                    relatedItemId: trade.id,
                    confidence: 0.7,
                    rationale: "Account reported as late despite having a zero balance. This is a common reporting inconsistency.",
                });
            }
        }
    });

    // Rule 4: Hard inquiries (Generic flag for user review)
    data.inquiries.forEach((inq) => {
        const inquiryDate = DateTime.fromFormat(inq.date, 'MM/DD/YYYY');
        if (inquiryDate > DateTime.now().minus({ months: 24 })) {
            candidates.push({
                bureau,
                category: "INQUIRY",
                confidence: 0.6,
                rationale: `A hard inquiry from ${inq.subscriber} on ${inq.date} was detected. If you did not authorize this inquiry, it may be disputed.`,
            });
        }
    });

    return candidates;
}
