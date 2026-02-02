"use client";

import { useState, useEffect } from "react";
import {
    Mail,
    ChevronLeft,
    Save,
    Download,
    FileText,
    Loader2,
    CheckCircle2,
    AlertTriangle
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { jsPDF } from "jspdf";

export default function LettersPage() {
    const [letters, setLetters] = useState<any[]>([]);
    const [selectedLetter, setSelectedLetter] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editContent, setEditContent] = useState("");

    useEffect(() => {
        fetchLetters();
    }, []);

    const fetchLetters = async () => {
        try {
            const res = await fetch("/api/letters");
            if (res.ok) {
                const data = await res.json();
                setLetters(data);
                if (data.length > 0) {
                    setSelectedLetter(data[0]);
                    setEditContent(data[0].contentHtml);
                }
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await fetch(`/api/letters/${selectedLetter.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ contentHtml: editContent }),
            });
            // Update local state
            setLetters(prev => prev.map(l => l.id === selectedLetter.id ? { ...l, contentHtml: editContent } : l));
        } catch (err) {
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    const handleExport = () => {
        if (!selectedLetter) return;

        const doc = new jsPDF();
        doc.setFont("courier", "normal");
        doc.setFontSize(10);

        // Split text to fit page width
        const splitText = doc.splitTextToSize(editContent, 180);
        doc.text(splitText, 15, 20);

        doc.save(`Dispute_Letter_${selectedLetter.bureauOrCreditor}.pdf`);
    };

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center bg-slate-950">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden">
            {/* Sidebar: Letter List */}
            <aside className="w-80 border-r border-white/5 flex flex-col bg-slate-950">
                <div className="p-6 border-b border-white/5">
                    <Link href="/dashboard" className="flex items-center gap-2 text-sm text-slate-400 hover:text-white mb-6 transition-colors">
                        <ChevronLeft className="h-4 w-4" /> Back to Dashboard
                    </Link>
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <Mail className="h-5 w-5 text-blue-500" />
                        Dispute Letters
                    </h2>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    {letters.length === 0 ? (
                        <div className="p-8 text-center text-slate-500 space-y-4">
                            <Mail className="h-10 w-10 mx-auto opacity-20" />
                            <p className="text-xs">No letters generated yet.</p>
                        </div>
                    ) : (
                        letters.map((letter) => (
                            <button
                                key={letter.id}
                                onClick={() => { setSelectedLetter(letter); setEditContent(letter.contentHtml); }}
                                className={cn(
                                    "w-full text-left p-4 rounded-xl border transition-all group",
                                    selectedLetter?.id === letter.id
                                        ? "bg-blue-600/10 border-blue-500/50 ring-1 ring-blue-500/20"
                                        : "bg-slate-900 border-white/5 hover:border-white/10"
                                )}
                            >
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400 group-hover:text-blue-300">
                                        {letter.bureauOrCreditor}
                                    </span>
                                    <span className="text-[10px] text-slate-600">v{letter.version}</span>
                                </div>
                                <p className="text-xs font-medium text-slate-300 truncate">FCRA Dispute Letter</p>
                                <p className="text-[10px] text-slate-500 mt-2">{new Date(letter.createdAt).toLocaleDateString()}</p>
                            </button>
                        ))
                    )}
                </div>
            </aside>

            {/* Main Editor */}
            <main className="flex-1 flex flex-col overflow-hidden">
                {selectedLetter ? (
                    <>
                        <header className="px-8 py-4 border-b border-white/5 flex items-center justify-between bg-slate-900/50 backdrop-blur-md">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-500">
                                    <FileText className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white uppercase tracking-tight">Editing Dispute: {selectedLetter.bureauOrCreditor}</h3>
                                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Standard FCRA Template</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="px-4 py-2 text-sm font-bold bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg flex items-center gap-2 transition-all"
                                >
                                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                    Save Draft
                                </button>
                                <button
                                    onClick={handleExport}
                                    className="px-4 py-2 text-sm font-bold bg-blue-600 hover:bg-blue-500 text-white rounded-lg flex items-center gap-2 shadow-lg shadow-blue-500/20 transition-all"
                                >
                                    <Download className="h-4 w-4" />
                                    Export PDF
                                </button>
                            </div>
                        </header>

                        <div className="flex-1 p-8 overflow-y-auto bg-slate-950">
                            <div className="max-w-3xl mx-auto space-y-6">
                                {/* Warning Banner */}
                                <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 flex items-start gap-3">
                                    <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5" />
                                    <p className="text-xs text-amber-200/60 leading-relaxed">
                                        Please review the generated content carefully. Ensure all personal details are accurate and you have signed the letter before mailing.
                                    </p>
                                </div>

                                <textarea
                                    value={editContent}
                                    onChange={(e) => setEditContent(e.target.value)}
                                    className="w-full h-[800px] bg-slate-900 border border-white/10 rounded-2xl p-8 text-slate-300 font-mono text-sm leading-relaxed focus:ring-2 focus:ring-blue-500 outline-none shadow-2xl transition-all"
                                    placeholder="Start typing your letter..."
                                />
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
                        <div className="p-6 rounded-3xl bg-slate-900 border border-white/5 mb-6">
                            <Mail className="h-12 w-12 text-slate-700" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">No Letter Selected</h3>
                        <p className="text-slate-500 max-w-sm">Select a generated letter from the sidebar to review and edit its contents.</p>
                    </div>
                )}
            </main>
        </div>
    );
}
