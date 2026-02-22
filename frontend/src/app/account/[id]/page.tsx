"use client"

import { useParams } from "next/navigation"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
    ArrowLeft,
    Target,
    TrendingUp,
    DollarSign,
    Users,
    ShieldCheck,
    Zap,
    ExternalLink,
    Linkedin,
    Mail,
    Calendar,
    CheckCircle2,
    XCircle,
    AlertTriangle
} from "lucide-react"
import { Company } from "@/lib/types"
import companiesData from "@/data/companies.json"

export default function AccountDetail() {
    const params = useParams()
    const [company, setCompany] = useState<Company | null>(null)

    useEffect(() => {
        const id = parseInt(params.id as string)
        const found = (companiesData as Company[]).find(c => c.id === id)
        if (found) setCompany(found)
    }, [params.id])

    if (!company) return null

    return (
        <div className="p-4 md:p-10 pb-24 space-y-8 md:space-y-12 max-w-[1600px] mx-auto">
            {/* Header / Breadcrumb */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <button
                        onClick={() => window.history.back()}
                        className="p-2.5 rounded-lg border border-brand-border bg-brand-card hover:border-brand-accent/30 transition-all text-brand-muted hover:text-white group"
                    >
                        <ArrowLeft size={18} className="group-hover:-translate-x-0.5 transition-transform" />
                    </button>
                    <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-widest text-brand-dim">
                        <span>Universe</span>
                        <span className="text-brand-border">/</span>
                        <span>{company.industry}</span>
                        <span className="text-brand-border">/</span>
                        <span className="text-brand-text font-semibold">{company.name}</span>
                    </div>
                </div>
            </div>

            {/* Hero Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-16 items-start border-b border-brand-border pb-8 md:pb-16">
                <div className="lg:col-span-2 space-y-10">
                    <div className="flex items-start md:items-center gap-4 md:gap-8 flex-col md:flex-row">
                        <div className="w-16 h-16 md:w-24 md:h-24 bg-brand-accent rounded-2xl flex items-center justify-center font-bold text-2xl md:text-4xl text-brand-bg italic shadow-[0_0_30px_rgba(232,185,49,0.1)]">
                            {company.name[0]}
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center gap-4 flex-wrap">
                                <h1 className="text-3xl md:text-5xl font-semibold tracking-tight text-white">{company.name}</h1>
                                {company.buyingWindowScore > 75 && (
                                    <div className="px-3 py-1 rounded-full border border-brand-accent/20 bg-brand-accent/5 text-brand-accent text-[11px] font-bold uppercase tracking-wider">
                                        High priority window
                                    </div>
                                )}
                            </div>
                            <p className="text-brand-muted text-xl max-w-2xl leading-relaxed">{company.description}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-y-6 gap-x-6 md:gap-x-12 pt-4">
                        <MetaItem label="Primary location" value={company.location} />
                        <MetaItem label="Funding stage" value={company.fundingStage} />
                        <MetaItem label="Headcount" value={company.employeeRange} />
                        <MetaItem label="Est. revenue" value={company.revenueRange} />
                        <MetaItem label="Year founded" value={company.founded.toString()} />
                    </div>
                </div>

                <div className="bg-brand-card border border-brand-border rounded-2xl p-8 space-y-8 relative overflow-hidden group shadow-2xl accent-line-top">
                    <div className="absolute inset-0 bg-brand-accent/[0.03] transition-transform duration-1000 origin-bottom"
                        style={{ transform: `scaleY(${company.buyingWindowScore / 100})` }} />

                    <div className="relative z-10 space-y-2 text-center">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-accent/80">Buying Window Score</p>
                        <div className="flex items-baseline justify-center gap-1">
                            <span className="text-8xl font-semibold tracking-tighter text-white mono-nums">{company.buyingWindowScore}</span>
                            <span className="text-xl font-medium text-brand-dim">/100</span>
                        </div>
                        <div className="pt-6 flex items-center justify-center gap-2 text-[11px] font-bold uppercase tracking-wider">
                            {company.buyingWindowScore > 75 ? (
                                <span className="flex items-center gap-2 text-brand-success"><TrendingUp size={14} className="animate-bounce" /> Critical momentum detected</span>
                            ) : company.buyingWindowScore > 50 ? (
                                <span className="flex items-center gap-2 text-brand-accent"><TrendingUp size={14} /> Moderate activity</span>
                            ) : (
                                <span className="flex items-center gap-2 text-brand-dim">Low current activity</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Body */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-20">
                {/* Timeline */}
                <div className="lg:col-span-2 space-y-10">
                    <section className="space-y-8">
                        <div className="flex items-center justify-between border-b border-brand-border pb-5">
                            <h2 className="text-xl font-semibold tracking-tight text-white">Active signal timeline</h2>
                            <div className="text-[10px] font-bold uppercase tracking-widest text-brand-dim italic">180 Day history</div>
                        </div>

                        <div className="space-y-0 relative pl-4">
                            <div className="absolute left-[7px] top-4 bottom-8 w-px bg-gradient-to-b from-brand-accent/40 via-brand-border to-transparent" />
                            {company.signals.map((sig, idx) => (
                                <TimelineItem key={idx} signal={sig} idx={idx} />
                            ))}
                        </div>
                    </section>

                    <section className="space-y-8">
                        <div className="flex items-center justify-between border-b border-brand-border pb-5">
                            <h2 className="text-xl font-semibold tracking-tight text-white">Infrastructure & stack</h2>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {company.techStack.map((tech, i) => (
                                <div key={i} className="p-5 rounded-xl border border-brand-border bg-brand-card flex flex-col items-center text-center space-y-3 group hover:border-brand-accent/30 transition-all">
                                    <div className="w-10 h-10 rounded-lg bg-brand-surface border border-brand-border flex items-center justify-center group-hover:bg-brand-accent/5 group-hover:text-brand-accent transition-colors">
                                        <Zap size={18} />
                                    </div>
                                    <p className="text-[11px] font-semibold uppercase tracking-wider text-brand-text">{tech}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Forecast & Sidebar Actions */}
                <div className="space-y-12">
                    <section className="bg-brand-card border border-brand-border rounded-2xl p-8 space-y-10 shadow-xl">
                        <div className="flex items-center gap-3 text-brand-accent">
                            <Target size={18} />
                            <h3 className="text-[11px] font-bold uppercase tracking-[0.2em]">Revenue Forecast</h3>
                        </div>

                        <div className="space-y-8">
                            <ForecastRow label="Historical probability" value={`${(company.closeProbability * 100).toFixed(0)}%`} desc="Based on prior signal success" />
                            <ForecastRow label="Expected revenue" value={company.expectedRevenueValue >= 1000000 ? `$${(company.expectedRevenueValue / 1000000).toFixed(1)}M` : `$${(company.expectedRevenueValue / 1000).toFixed(0)}K`} desc="Projected next 90 days" />
                            <ForecastRow label="Estimated deal size" value={company.outcome?.dealSize ? (company.outcome.dealSize >= 1000000 ? `$${(company.outcome.dealSize / 1000000).toFixed(1)}M` : `$${(company.outcome.dealSize / 1000).toFixed(0)}K`) : 'TBD'} desc={company.outcome?.status === 'CLOSED_WON' ? 'Closed-won deal' : 'Estimated range'} />
                        </div>
                    </section>

                    <section className="bg-brand-card border border-brand-border rounded-2xl p-8 space-y-8 shadow-xl">
                        <div className="flex items-center gap-3 text-white">
                            <CheckCircle2 size={18} className="text-brand-success" />
                            <h3 className="text-[11px] font-bold uppercase tracking-[0.2em]">Workflow Sync</h3>
                        </div>

                        <div className="space-y-5">
                            <div className="p-5 rounded-xl border border-brand-border bg-brand-bg space-y-3 shadow-inner">
                                <div className="flex justify-between items-center">
                                    <p className="text-[10px] font-semibold uppercase tracking-widest text-brand-dim">CRM Status</p>
                                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-brand-success/5 border border-brand-success/20 text-[9px] font-bold text-brand-success uppercase tracking-wider">
                                        <ShieldCheck size={10} /> Live
                                    </div>
                                </div>
                                <p className="text-xs font-semibold text-brand-text">Account fully mapped in Salesforce</p>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <ActionButton icon={<Linkedin size={14} />} label="LinkedIn" />
                                <ActionButton icon={<Mail size={14} />} label="Email SDR" />
                            </div>

                            <button className="w-full py-4 mt-2 bg-brand-accent text-brand-bg rounded-xl font-bold uppercase tracking-widest transition-all hover:bg-white shadow-[0_0_20px_rgba(232,185,49,0.1)] hover:shadow-[0_0_30px_rgba(232,185,49,0.2)] active:scale-95 flex items-center justify-center gap-2">
                                Push to infrastructure <Zap size={16} />
                            </button>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    )
}

function MetaItem({ label, value }: { label: string; value: string }) {
    return (
        <div className="space-y-1.5">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-brand-dim">{label}</p>
            <p className="text-sm font-semibold text-brand-text">{value}</p>
        </div>
    )
}

function TimelineItem({ signal, idx }: { signal: any; idx: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="relative pl-10 pb-12 last:pb-0 group"
        >
            <div className="absolute left-[3px] top-1.5 w-2 h-2 rounded-full bg-brand-bg border-2 border-brand-accent shadow-[0_0_8px_rgba(232,185,49,0.5)] group-hover:scale-125 transition-transform" />
            <div className="space-y-3">
                <div className="flex items-center gap-4">
                    <p className="text-sm font-semibold text-white uppercase tracking-tight">{signal.title}</p>
                    <span className="text-[10px] font-medium text-brand-dim bg-brand-surface border border-brand-border px-2 py-0.5 rounded-full">
                        {new Date(signal.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                </div>
                <p className="text-sm text-brand-muted max-w-2xl leading-relaxed">{signal.description}</p>
                <div className="pt-1 flex items-center gap-4">
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-brand-accent/5 border border-brand-accent/10 text-[10px] font-bold uppercase tracking-widest text-brand-accent">
                        <Zap size={10} /> Magnitude: +{signal.weight}
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

function ForecastRow({ label, value, desc }: { label: string; value: string; desc: string }) {
    return (
        <div className="flex justify-between items-end border-b border-brand-border pb-6 last:border-0 last:pb-0">
            <div className="space-y-1.5">
                <p className="text-xs font-semibold text-brand-text uppercase tracking-tight leading-none">{label}</p>
                <p className="text-[10px] font-medium text-brand-dim uppercase tracking-wider leading-none">{desc}</p>
            </div>
            <p className="text-3xl font-semibold text-brand-accent mono-nums tracking-tighter leading-none">{value}</p>
        </div>
    )
}

function ActionButton({ icon, label }: { icon: React.ReactNode; label: string }) {
    return (
        <button className="flex items-center justify-center gap-2 py-3 rounded-lg border border-brand-border bg-brand-surface hover:bg-brand-accent hover:text-brand-bg hover:border-brand-accent transition-all text-[11px] font-bold uppercase tracking-widest text-brand-dim">
            {icon} {label}
        </button>
    )
}
