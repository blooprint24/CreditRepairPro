"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { User, MapPin, Shield, ChevronRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function OnboardingPage() {
    const router = useRouter();
    const { data: session } = useSession();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        fullName: "",
        phone: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        zipCode: "",
        identityApproved: false,
    });

    const updateProfile = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/user/profile", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                router.push("/dashboard");
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const nextStep = () => {
        if (step < 3) setStep(step + 1);
        else updateProfile();
    };

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center px-4">
            <div className="max-w-md w-full">
                {/* Progress bar */}
                <div className="flex gap-2 mb-12">
                    {[1, 2, 3].map((s) => (
                        <div
                            key={s}
                            className={cn(
                                "h-1 flex-1 rounded-full transition-all duration-500",
                                s <= step ? "bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" : "bg-white/10"
                            )}
                        />
                    ))}
                </div>

                <div className="bg-slate-900 border border-white/5 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
                    {/* Background Glow */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl -translate-y-1/2 translate-x-1/2" />

                    {step === 1 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-500">
                                    <User className="h-5 w-5" />
                                </div>
                                <h2 className="text-2xl font-bold text-white tracking-tight">Personal Details</h2>
                            </div>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                Provide your legal name and contact information. This will be used in your dispute letters.
                            </p>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Full Legal Name</label>
                                    <input
                                        type="text"
                                        value={formData.fullName}
                                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                        placeholder="John A. DOE"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Phone Number</label>
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        placeholder="(555) 000-0000"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-500">
                                    <MapPin className="h-5 w-5" />
                                </div>
                                <h2 className="text-2xl font-bold text-white tracking-tight">Current Address</h2>
                            </div>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                Ensure this address matches the one on your government ID.
                            </p>
                            <div className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="Street Address"
                                    value={formData.addressLine1}
                                    onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        placeholder="City"
                                        value={formData.city}
                                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                                    />
                                    <input
                                        type="text"
                                        placeholder="State (e.g., NY)"
                                        value={formData.state}
                                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                                    />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Zip Code"
                                    value={formData.zipCode}
                                    onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                                />
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-500">
                                    <Shield className="h-5 w-5" />
                                </div>
                                <h2 className="text-2xl font-bold text-white tracking-tight">Identity & Auth</h2>
                            </div>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                To continue, you must confirm you are authorized to use this tool for your personal credit reports.
                            </p>
                            <div className="p-4 rounded-xl bg-slate-950 border border-white/5">
                                <label className="flex items-start gap-4 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        checked={formData.identityApproved}
                                        onChange={(e) => setFormData({ ...formData, identityApproved: e.target.checked })}
                                        className="mt-1 h-5 w-5 rounded border-white/10 bg-white/5 text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className="text-sm text-slate-300 group-hover:text-white transition-colors">
                                        I confirm that I am the owner of the credit reports I intend to upload, and I authorize CreditRepairPro to process this data for my personal use.
                                    </span>
                                </label>
                            </div>
                        </div>
                    )}

                    <button
                        onClick={nextStep}
                        disabled={loading || (step === 3 && !formData.identityApproved)}
                        className="w-full mt-10 px-8 py-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-2xl flex items-center justify-center gap-2 group transition-all"
                    >
                        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : (
                            <>
                                {step === 3 ? "Complete Setup" : "Continue"}
                                <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
