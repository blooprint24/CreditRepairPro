"use client";

import Link from "next/link";
import { ShieldCheck, FileSearch, Mail, ArrowRight, CheckCircle2, AlertTriangle } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-950 overflow-hidden">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-6 border-b border-white/5">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-8 w-8 text-blue-500" />
          <span className="text-xl font-bold tracking-tight text-white">CreditRepair<span className="text-blue-500">Pro</span></span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/login" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Sign In</Link>
          <Link href="/register" className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-500 transition-all">Get Started</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-grow">
        <section className="relative pt-20 pb-32 px-8 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />
          </div>

          <div className="max-w-4xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-8">
              <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
              AI-Powered Credit Restoration
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-8">
              Clear Errors. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Restore Your Future.</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
              Upload your credit reports and let our AI analyze potential inaccuracies. Generate professional dispute letters in minutes, not weeks.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register" className="w-full sm:w-auto px-8 py-4 text-lg font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-500 hover:scale-105 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25">
                Start Free Analysis <ArrowRight className="h-5 w-5" />
              </Link>
              <Link href="#features" className="w-full sm:w-auto px-8 py-4 text-lg font-bold text-slate-300 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all">
                How it Works
              </Link>
            </div>
          </div>
        </section>

        {/* Features Preview */}
        <section id="features" className="py-24 px-8 border-t border-white/5 bg-slate-900/50">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-8 rounded-2xl bg-slate-950 border border-white/5 hover:border-blue-500/30 transition-all group">
                <FileSearch className="h-10 w-10 text-blue-500 mb-6 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-bold text-white mb-4">Smart Parsing</h3>
                <p className="text-slate-400 leading-relaxed">Simply upload your PDF reports. Our AI extracts every trade line, inquiry, and personal detail automatically.</p>
              </div>
              <div className="p-8 rounded-2xl bg-slate-950 border border-white/5 hover:border-blue-500/30 transition-all group">
                <ShieldCheck className="h-10 w-10 text-indigo-500 mb-6 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-bold text-white mb-4">Expert Analysis</h3>
                <p className="text-slate-400 leading-relaxed">Identify inaccuracies, duplicates, and outdated marks that might be dragging down your score.</p>
              </div>
              <div className="p-8 rounded-2xl bg-slate-950 border border-white/5 hover:border-blue-500/30 transition-all group">
                <Mail className="h-10 w-10 text-emerald-500 mb-6 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-bold text-white mb-4">Letter Generation</h3>
                <p className="text-slate-400 leading-relaxed">Generate ready-to-mail letters using industry-standard templates (FCRA & UCC) tailored to your case.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Disclaimer Banner */}
        <section className="py-12 px-8">
          <div className="max-w-4xl mx-auto rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6 md:p-8 flex items-start gap-4">
            <AlertTriangle className="h-6 w-6 text-amber-500 flex-shrink-0 mt-1" />
            <div>
              <h4 className="text-sm font-bold text-amber-500 uppercase tracking-wider mb-2">Important Legal Disclaimer</h4>
              <p className="text-sm text-amber-200/70 leading-relaxed">
                CreditRepairPro is an educational tool designed to help you organize and communicate with credit bureaus. We are <strong>not a law firm</strong> and do not provide legal advice. Use of this application does not guarantee any specific result or credit score increase. Users are responsible for the accuracy of all information provided and submitted to third parties.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-12 px-8 border-t border-white/5 text-center">
        <p className="text-slate-500 text-sm mb-4">© 2026 CreditRepairPro. All rights reserved.</p>
        <div className="flex justify-center gap-6 text-xs text-slate-600">
          <Link href="/privacy" className="hover:text-slate-400 transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-slate-400 transition-colors">Terms of Service</Link>
          <Link href="/contact" className="hover:text-slate-400 transition-colors">Contact Support</Link>
        </div>
      </footer>
    </div>
  );
}
