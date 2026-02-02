export interface LetterTemplate {
    name: string;
    subject: string;
    body: string;
}

export const BUREAU_DISPUTE_TEMPLATE: LetterTemplate = {
    name: "General Bureau Dispute",
    subject: "Formal Dispute of Inaccurate Credit Information - FCRA § 611",
    body: `
[Date]

[Bureau Name]
[Bureau Address]

RE: Formal Dispute of Inaccurate Credit Information
Consumer Name: {{fullName}}
Consumer Address: {{address}}
Social Security Number: XXX-XX-XXXX (Masked for Security)
Date of Birth: {{dob}}

To Whom It May Concern,

I am writing to formally dispute the following information appearing on my credit report. I have reviewed my report and found the following items to be inaccurate or incomplete:

{{disputeItems}}

Under the Fair Credit Reporting Act (FCRA), 15 U.S.C. § 1681i, you are required to conduct a reasonable investigation to verify the accuracy of this information. If you cannot verify these items within 30 days, they must be permanently removed from my credit file.

Please provide me with a written notice of the results of your investigation and a free copy of my credit report if any changes are made.

Sincerely,

[Signature]

{{fullName}}
  `.trim(),
};

export function generateLetterContent(
    template: LetterTemplate,
    data: {
        fullName: string;
        address: string;
        dob: string;
        bureauName: string;
        items: { category: string; rationale: string }[]
    }
) {
    const itemsText = data.items.map((item, index) => (
        `${index + 1}. Item: ${item.category}\n   Reason for Dispute: ${item.rationale}`
    )).join('\n\n');

    return template.body
        .replace('{{fullName}}', data.fullName)
        .replace('{{fullName}}', data.fullName) // Replace twice if needed
        .replace('{{address}}', data.address)
        .replace('{{dob}}', data.dob || 'Not Provided')
        .replace('[Bureau Name]', data.bureauName)
        .replace('{{disputeItems}}', itemsText);
}
