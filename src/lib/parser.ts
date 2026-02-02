import { PDFParse } from "pdf-parse";
import { s3Client } from "./s3";
import { GetObjectCommand } from "@aws-sdk/client-s3";

export interface ParsedData {
    tradelines: any[];
    collections: any[];
    inquiries: any[];
    personalInfo: any;
    rawText: string;
}

/**
 * Extracts text from a PDF buffer and performs initial redaction of PII.
 */
export async function extractAndRedactText(buffer: Buffer): Promise<string> {
    const parser = new PDFParse({ data: buffer });
    const result = await parser.getText();
    let text = result.text;

    // Basic PII Redaction
    // Mask SSN: XXX-XX-XXXX
    text = text.replace(/\b\d{3}-\d{2}-\d{4}\b/g, "XXX-XX-XXXX");

    // Mask potential account numbers (long digit strings)
    // This is a heuristic and should be refined
    text = text.replace(/\b\d{8,16}\b/g, (match) => {
        return "X".repeat(match.length - 4) + match.slice(-4);
    });

    return text;
}

/**
 * Heuristic parser to extract structured data from redacted report text.
 * In a production app, this would use more sophisticated NLP or specific templates.
 */
export function parseReportText(text: string): ParsedData {
    const tradelines: any[] = [];
    const collections: any[] = [];
    const inquiries: any[] = [];

    // Heuristic: Look for keywords often associated with sections
    // This is a simplified version for demonstration
    const lines = text.split('\n');

    let currentSection: 'TRADELINES' | 'COLLECTIONS' | 'INQUIRIES' | 'PERSONAL' | null = null;

    lines.forEach(line => {
        const uppedLine = line.toUpperCase();

        if (uppedLine.includes('ACCOUNT HISTORY') || uppedLine.includes('TRADE ACCOUNTS')) {
            currentSection = 'TRADELINES';
            return;
        }
        if (uppedLine.includes('COLLECTION') || uppedLine.includes('COLLECTIONS')) {
            currentSection = 'COLLECTIONS';
            return;
        }
        if (uppedLine.includes('INQUIRIES') || uppedLine.includes('REQUESTS FOR YOUR CREDIT')) {
            currentSection = 'INQUIRIES';
            return;
        }

        // Very basic extraction logic
        if (currentSection === 'INQUIRIES') {
            // Look for dates like MM/DD/YYYY
            const dateMatch = line.match(/(\d{1,2}\/\d{1,2}\/\d{2,4})/);
            if (dateMatch) {
                inquiries.push({
                    subscriber: line.replace(dateMatch[0], '').trim(),
                    date: dateMatch[0],
                    type: 'HARD'
                });
            }
        }

        // ... add more heuristics for tradelines and collections
    });

    return {
        tradelines,
        collections,
        inquiries,
        personalInfo: {},
        rawText: text
    };
}

export async function getFileBuffer(storageKey: string): Promise<Buffer> {
    const command = new GetObjectCommand({
        Bucket: process.env.S3_BUCKET,
        Key: storageKey,
    });

    const response = await s3Client.send(command);
    const byteArray = await response.Body?.transformToByteArray();
    return Buffer.from(byteArray!);
}
