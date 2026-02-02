"use client";

// Local types to avoid Prisma client generation issues during build
type Bureau = 'EXPERIAN' | 'EQUIFAX' | 'TRANSUNION' | 'OTHER';
type FindingCategory = 'PERSONAL_INFO' | 'COLLECTION' | 'TRADELINE' | 'INQUIRY' | 'BANKRUPTCY';

interface Finding {
    id: string;
    bureau: Bureau;
    category: FindingCategory;
    rationale: string;
    confidence: number;
    isApproved: boolean;
}

import {
    AlertCircle,
    CheckCircle2,
    User as UserIcon,
    FileText,
    ShieldAlert,
    Plus,
    X
} from "lucide-react";
import { cn } from "@/lib/utils";

interface FindingItemProps {
    finding: Finding;
    onToggle: (id: string, isApproved: boolean) => void;
}

const categoryIcons: Record<FindingCategory, any> = {
    PERSONAL_INFO: UserIcon,
    COLLECTION: ShieldAlert,
    TRADELINE: FileText,
    INQUIRY: AlertCircle,
    BANKRUPTCY: AlertCircle,
};

const bureauColors: Record<Bureau, string> = {
    EXPERIAN: "text-blue-500 bg-blue-500/10 border-blue-500/20",
    EQUIFAX: "text-indigo-500 bg-indigo-500/10 border-indigo-500/20",
    TRANSUNION: "text-slate-500 bg-slate-500/10 border-slate-500/20",
    OTHER: "text-slate-400 bg-slate-400/10 border-slate-400/20",
};

export function FindingItem({ finding, onToggle }: FindingItemProps) {
    const Icon = categoryIcons[finding.category];

    return (
        <div
            className={cn(
                "p-5 rounded-2xl border transition-all duration-300",
                finding.isApproved
                    ? "bg-blue-600/5 border-blue-500/30 ring-1 ring-blue-500/10"
                    : "bg-slate-900 border-white/5"
            )}
        >
            <div className="flex items-start gap-4">
                <div className={cn("p-3 rounded-xl border", bureauColors[finding.bureau])}>
                    <Icon className="h-5 w-5" />
                </div>

                <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{finding.bureau}</span>
                            <span className="h-1 w-1 rounded-full bg-slate-700" />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400">{finding.category}</span>
                        </div>

                        <button
                            onClick={() => onToggle(finding.id, !finding.isApproved)}
                            className={cn(
                                "p-2 rounded-lg border transition-all flex items-center gap-2 text-xs font-bold",
                                finding.isApproved
                                    ? "bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-500/20"
                                    : "bg-white/5 text-slate-400 border-white/10 hover:border-white/20"
                            )}
                        >
                            {finding.isApproved ? (
                                <>
                                    Included <CheckCircle2 className="h-3 w-3" />
                                </>
                            ) : (
                                <>
                                    Include in Dispute <Plus className="h-3 w-3" />
                                </>
                            )}
                        </button>
                    </div>

                    <p className="text-sm font-medium text-white leading-relaxed pt-1">
                        {finding.rationale}
                    </p>

                    <div className="flex items-center gap-2 pt-3">
                        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-950/50 border border-white/5">
                            <span className="text-[10px] font-bold text-slate-500">Confidence:</span>
                            <span className={cn(
                                "text-[10px] font-bold",
                                finding.confidence > 0.8 ? "text-emerald-500" : "text-amber-500"
                            )}>{(finding.confidence * 100).toFixed(0)}%</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
