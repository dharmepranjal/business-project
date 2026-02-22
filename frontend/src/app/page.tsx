"use client"

import { motion } from "framer-motion"
import { ArrowRight, Zap, Target, TrendingUp, ShieldCheck, Search, Database } from "lucide-react"
import Link from "next/link"
import { Company } from "@/lib/types"
import companiesData from "@/data/companies.json"
import { formatINR } from "@/lib/utils"

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-brand-bg flex flex-col items-center overflow-x-hidden w-full">
      {/* Background Grain & Gradients */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_20%,rgba(232,185,49,0.05),transparent_70%)]" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] bg-brand-accent/[0.01] blur-[150px] rounded-full pointer-events-none" />

      {/* Hero Section */}
      <section className="min-h-[110vh] flex flex-col items-center justify-center p-6 text-center max-w-7xl mx-auto pt-32 pb-40">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-16 flex-1 flex flex-col justify-center"
        >
          <div className="space-y-12">
            <h1 className="text-4xl sm:text-6xl md:text-[92px] font-semibold tracking-tight leading-[1.1] md:leading-[0.9] text-white">
              Know exactly when <br className="hidden sm:block" />
              <span className="text-brand-accent italic font-medium">they are buying.</span>
            </h1>

            <p className="text-brand-muted text-base sm:text-lg md:text-2xl max-w-4xl mx-auto leading-relaxed font-medium px-4">
              Deploy revenue-timed intelligence to identify accounts entering high-intent cycles.
              <br className="hidden md:block" />
              Track hiring velocity, executive appointments, and stack migrations in real-time.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-10">
              <Link
                href="/dashboard"
                className="group px-10 py-5 bg-brand-accent text-brand-bg rounded-2xl font-bold text-lg flex items-center gap-3 transition-all shadow-[0_20px_40px_rgba(232,185,49,0.15)] hover:bg-white hover:shadow-[0_25px_50px_rgba(232,185,49,0.25)] active:scale-95"
              >
                Open terminal <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/analytics"
                className="px-10 py-5 bg-transparent border border-brand-border text-brand-text rounded-2xl font-bold text-lg hover:bg-white/[0.03] transition-all"
              >
                View evidence
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Proof Ticker - Now pushed down further */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1.5 }}
          className="mt-60 w-full grid grid-cols-2 md:grid-cols-4 gap-12 border-t border-brand-border/40 pt-16"
        >

          {(() => {
            const companies = companiesData as Company[]
            const totalSignals = companies.reduce((acc, c) => acc + c.signals.length, 0)
            const totalPipeline = companies.reduce((acc, c) => acc + c.expectedRevenueValue, 0)
            const avgConv = (companies.filter(c => c.outcome?.meetingBooked).length / companies.length * 100).toFixed(1)
            return (
              <>
                <Stat label="Active signals" value={totalSignals.toLocaleString()} />
                <Stat label="Avg conversion" value={`${avgConv}%`} />
                <Stat label="Monitored accounts" value={companies.length.toLocaleString()} />
                <Stat label="Pipeline identified" value={formatINR(totalPipeline)} />
              </>
            )
          })()}
        </motion.div>
      </section>

      {/* Feature Showcase */}
      <section className="w-full max-w-7xl mx-auto px-6 py-32 space-y-24">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-semibold text-white tracking-tight">Purpose-built for revenue teams.</h2>
          <p className="text-brand-muted font-medium">Precision instrumentation for the entire sales cycle.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Feature
            icon={<TrendingUp />}
            title="Timing Arbitrage"
            desc="Identify the precise 14-day window where an account is most likely to commit to new infrastructure."
          />
          <Feature
            icon={<Search />}
            title="Keyword Intent"
            desc="Scan thousands of job descriptions for specific technical keywords that signal a platform migration."
          />
          <Feature
            icon={<Database />}
            title="Sync Infrastructure"
            desc="Auto-pipe high-score leads directly into Salesforce and HubSpot with enriched signal context."
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full border-t border-brand-border py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 md:gap-8 opacity-50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-brand-accent rounded-lg flex items-center justify-center font-bold text-brand-bg italic">P</div>
            <span className="font-semibold tracking-tighter text-lg">Picket</span>
          </div>
          <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-center md:text-left">© 2026 Predictive Timing Lab</p>
        </div>
      </footer>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-2 text-left md:text-center">
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-dim">{label}</p>
      <p className="text-4xl font-semibold text-white tracking-tight mono-nums">{value}</p>
    </div>
  )
}

function Feature({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="bg-brand-card border border-brand-border rounded-2xl p-8 space-y-6 hover:border-brand-accent/30 transition-all group shadow-sm accent-line-top">
      <div className="w-12 h-12 rounded-xl bg-brand-surface border border-brand-border flex items-center justify-center text-brand-accent group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <div className="space-y-3">
        <h3 className="text-xl font-semibold text-white">{title}</h3>
        <p className="text-sm text-brand-muted leading-relaxed font-medium">{desc}</p>
      </div>
    </div>
  )
}

