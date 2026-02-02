"use client";

import { useState } from "react";
import {
    ShieldAlert,
    Trash2,
    Clock,
    Eye,
    EyeOff,
    ChevronLeft,
    AlertTriangle,
    CheckCircle2,
    Loader2
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function SecurityPage() {
    const [retentionDays, setRetentionDays] = useState(30);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSave = async () => {
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        }, 1000);
    };

    return (
        <div className="flex min-h-screen bg-slate-950 text-slate-100">
            <div className="max-w-3xl mx-auto px-8 py-12 w-full">
                <Link href="/dashboard" className="flex items-center gap-2 text-sm text-slate-400 hover:text-white mb-10 transition-colors">
                    <ChevronLeft className="h-4 w-4" /> Back to Dashboard
                </Link>

                <header className="mb-12">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-500">
                            <ShieldAlert className="h-6 w-6" />
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight">Privacy & Security</h1>
                    </div>
                    <p className="text-slate-400 leading-relaxed">
                        Manage your data retention policies and platform security settings. Your privacy is our top priority.
                    </p>
                </header>

                <div className="space-y-8">
                    {/* Data Retention */}
                    <section className="p-8 rounded-3xl bg-slate-900 border border-white/5 space-y-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-3xl -translate-y-1/2 translate-x-1/2" />

                        <div className="flex items-center gap-3 text-white font-bold">
                            <Clock className="h-5 w-5 text-indigo-400" />
                            Auto-Deletion Policy
                        </div>

                        <p className="text-sm text-slate-400 leading-relaxed">
                            Configure how long we keep your uploaded reports and parsed data. After this period, files and findings are permanently purged.
                        </p>

                        <div className="grid grid-cols-3 gap-4">
                            {[7, 30, 90].map((days) => (
                                <button
                                    key={days}
                                    onClick={() => setRetentionDays(days)}
                                    className={cn(
                                        "p-4 rounded-2xl border transition-all text-center",
                                        retentionDays === days
                                            ? "bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/20"
                                            : "bg-slate-950 border-white/5 text-slate-500 hover:border-white/10"
                                    )}
                                >
                                    <span className="block text-lg font-bold">{days} Days</span>
                                    <span className="text-[10px] uppercase font-bold tracking-widest opacity-60">Retention</span>
                                </button>
                            ))}
                        </div>

                        <div className="flex items-center justify-between pt-4">
                            <div className="flex items-center gap-2 text-xs text-slate-500 italic">
                                <AlertTriangle className="h-3 w-3 text-amber-500" />
                                Letters and exports are kept indefinitely unless account is deleted.
                            </div>
                            <button
                                onClick={handleSave}
                                disabled={loading}
                                className="px-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-bold flex items-center gap-2 transition-all"
                            >
                                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> :
                                    success ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : "Save Policy"}
                            </button>
                        </div>
                    </section>

                    {/* Dangerous Zone */}
                    <section className="p-8 rounded-3xl bg-red-500/5 border border-red-500/10 space-y-6">
                        <div className="flex items-center gap-3 text-red-500 font-bold">
                            <Trash2 className="h-5 w-5" />
                            Dangerous Operations
                        </div>

                        <div className="flex items-center justify-between gap-8">
                            <div>
                                <p className="text-sm font-bold text-white mb-1">Permanently Delete All Reports</p>
                                <p className="text-xs text-slate-500">This will immediately wipe all trade lines, collections, and parsed reports associated with your account.</p>
                            </div>
                            <button className="px-6 py-2.5 bg-red-600/10 hover:bg-red-600/20 border border-red-500/20 text-red-500 rounded-xl text-sm font-bold transition-all whitespace-nowrap">
                                Purge Data
                            </button>
                        </div>

                        <div className="h-px bg-red-500/10" />

                        <div className="flex items-center justify-between gap-8">
                            <div>
                                <p className="text-sm font-bold text-white mb-1">Delete Account</p>
                                <p className="text-xs text-slate-500">Irreversible action. Your profile, letters, and all associated data will be removed from our servers.</p>
                            </div>
                            <button className="px-6 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-red-500/20 whitespace-nowrap">
                                Close Account
                            </button>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
