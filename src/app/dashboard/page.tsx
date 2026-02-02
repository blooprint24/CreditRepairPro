"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import {
    BarChart3,
    FileText,
    Upload as UploadIcon,
    ShieldCheck,
    AlertCircle,
    LogOut,
    ChevronRight,
    TrendingDown,
    Clock,
    Mail,
    ArrowRight,
    Loader2
} from "lucide-react";
import { signOut } from "next-auth/react";
import { UploadZone } from "@/components/UploadZone";
import { FindingItem } from "@/components/FindingItem";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function DashboardPage() {
    const { data: session } = useSession();
    const [data, setData] = useState<{ findings: any[], uploads: any[] }>({ findings: [], uploads: [] });
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        try {
            const res = await fetch("/api/user/findings");
            if (res.ok) {
                const json = await res.json();
                setData(json);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const toggleFinding = async (findingId: string, isApproved: boolean) => {
        // Optimistic update
        setData(prev => ({
            ...prev,
            findings: prev.findings.map(f => f.id === findingId ? { ...f, isApproved } : f)
        }));

        try {
            await fetch("/api/user/findings", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ findingId, isApproved }),
            });
        } catch (err) {
            console.error(err);
            fetchData(); // Rollback
        }
    };

    const handleLogout = () => signOut({ callbackUrl: "/" });

    const approvedCount = data.findings.filter(f => f.isApproved).length;

    return (
        <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 border-r border-white/5 flex flex-col">
                <div className="p-6">
                    <div className="flex items-center gap-2 mb-8 cursor-pointer" onClick={() => window.location.href = "/"}>
                        <ShieldCheck className="h-6 w-6 text-blue-500" />
                        <span className="font-bold text-lg tracking-tight">ProRepair</span>
                    </div>

                    <nav className="space-y-1">
                        <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium bg-blue-500/10 text-blue-400 rounded-lg">
                            <BarChart3 className="h-4 w-4" /> Dashboard
                        </button>
                        <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-400 hover:bg-white/5 hover:text-white rounded-lg transition-colors">
                            <FileText className="h-4 w-4" /> Reports
                        </button>
                        <Link href="/dashboard/letters" className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-400 hover:bg-white/5 hover:text-white rounded-lg transition-colors">
                            <Mail className="h-4 w-4" /> Letters
                        </Link>
                    </nav>
                </div>

                <div className="mt-auto p-4 border-t border-white/5">
                    <div className="mb-4 px-2">
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Account</div>
                        <p className="text-xs text-slate-300 truncate">{session?.user?.email}</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-400 hover:bg-red-500/10 hover:text-red-400 rounded-lg transition-colors"
                    >
                        <LogOut className="h-4 w-4" /> Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <header className="px-8 py-6 border-b border-white/5 flex items-center justify-between sticky top-0 bg-slate-950/80 backdrop-blur-md z-10">
                    <div>
                        <h1 className="text-xl font-bold">Credit Dashboard</h1>
                        <p className="text-sm text-slate-500">Analysis results for your uploaded reports.</p>
                    </div>

                    {approvedCount > 0 && (
                        <Link
                            href="/dashboard/letters/generate"
                            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-blue-500/20 transition-all animate-in zoom-in-95 duration-300"
                        >
                            Generate Dispute Letters ({approvedCount}) <ArrowRight className="h-4 w-4" />
                        </Link>
                    )}
                </header>

                <div className="p-8 space-y-8">
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-6 rounded-2xl bg-slate-900 border border-white/5 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-blue-500/10 transition-colors" />
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-sm font-medium text-slate-400 uppercase tracking-wider text-[10px]">Active Findings</span>
                                <AlertCircle className="h-4 w-4 text-amber-500" />
                            </div>
                            <div className="text-3xl font-bold">{data.findings.length}</div>
                            <div className="text-xs text-slate-600 mt-2 italic">Possible inaccuracies detected</div>
                        </div>

                        <div className="p-6 rounded-2xl bg-slate-900 border border-white/5 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 blur-2xl -translate-y-1/2 translate-x-1/2" />
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-sm font-medium text-slate-400 uppercase tracking-wider text-[10px]">Approved for Dispute</span>
                                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                            </div>
                            <div className="text-3xl font-bold">{approvedCount}</div>
                            <div className="text-xs text-slate-600 mt-2 italic">Ready for letter generation</div>
                        </div>

                        <div className="p-6 rounded-2xl bg-slate-900 border border-white/5 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 blur-2xl -translate-y-1/2 translate-x-1/2" />
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-sm font-medium text-slate-400 uppercase tracking-wider text-[10px]">Total Reports</span>
                                <FileText className="h-4 w-4 text-indigo-500" />
                            </div>
                            <div className="text-3xl font-bold">{data.uploads.filter(u => u.status === 'COMPLETED').length}</div>
                            <div className="text-xs text-slate-600 mt-2 italic">Bureaus analyzed</div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Left Column: Upload & Actions */}
                        <div className="space-y-8">
                            <section>
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-lg font-semibold flex items-center gap-2">
                                        <UploadIcon className="h-5 w-5 text-blue-500" />
                                        New Analysis
                                    </h2>
                                </div>
                                <UploadZone onUploadComplete={() => { fetchData(); }} />
                            </section>

                            {data.uploads.length > 0 && (
                                <section>
                                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                        <Clock className="h-5 w-5 text-slate-500" />
                                        Recent Reports
                                    </h2>
                                    <div className="rounded-2xl border border-white/5 bg-slate-900 divide-y divide-white/5 overflow-hidden font-mono">
                                        {data.uploads.map((up) => (
                                            <div key={up.id} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors group">
                                                <div className="flex items-center gap-3">
                                                    <div className={cn(
                                                        "w-2 h-2 rounded-full",
                                                        up.status === 'COMPLETED' ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" :
                                                            up.status === 'PROCESSING' ? "bg-blue-500 animate-pulse" : "bg-slate-700"
                                                    )} />
                                                    <div>
                                                        <p className="text-xs text-white group-hover:text-blue-400 transition-colors uppercase">{up.filename}</p>
                                                        <p className="text-[10px] text-slate-500">{new Date(up.createdAt).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-600 group-hover:text-slate-400 transition-colors">
                                                    {up.status}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}
                        </div>

                        {/* Right Column: Findings */}
                        <div className="space-y-6">
                            <h2 className="text-lg font-semibold flex items-center gap-2">
                                <TrendingDown className="h-5 w-5 text-amber-500" />
                                Detected Candidates
                            </h2>

                            {loading ? (
                                <div className="flex items-center justify-center p-20">
                                    <Loader2 className="h-8 w-8 animate-spin text-slate-700" />
                                </div>
                            ) : data.findings.length > 0 ? (
                                <div className="space-y-4">
                                    {data.findings.map((finding) => (
                                        <FindingItem
                                            key={finding.id}
                                            finding={finding}
                                            onToggle={toggleFinding}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="p-12 text-center rounded-2xl border border-dashed border-white/5 bg-slate-900/50">
                                    <AlertCircle className="h-10 w-10 mx-auto text-slate-700 mb-4" />
                                    <p className="text-sm text-slate-500">No findings detected yet. <br /> Upload a report to start the automated scan.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
