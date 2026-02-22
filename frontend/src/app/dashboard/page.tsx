"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
    TrendingUp,
    Users,
    Zap,
    DollarSign,
    ArrowUpRight,
    Search,
    ShieldCheck
} from "lucide-react"
import { Company } from "@/lib/types"
import companiesData from "@/data/companies.json"
import { formatINR } from "@/lib/utils"

export default function Dashboard() {
    const [companies, setCompanies] = useState<Company[]>([])

    useEffect(() => {
        // Sort by buying window score initially
        const sorted = [...(companiesData as Company[])].sort((a, b) => b.buyingWindowScore - a.buyingWindowScore)
        setCompanies(sorted)
    }, [])

    const topAccounts = companies.slice(0, 10)
    const activeWindows = companies.filter(c => c.buyingWindowScore > 75).length
    const totalPipeline = companies.reduce((acc, curr) => acc + curr.expectedRevenueValue, 0)
    const totalSignals7d = companies.reduce((acc, c) => acc + c.signals.length, 0)

    return (
        <div className="p-4 md:p-10 space-y-8 md:space-y-12 max-w-[1600px] mx-auto overflow-x-hidden w-full">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                <div className="space-y-1">
                    <p className="text-[11px] font-medium tracking-wide text-brand-accent/80 uppercase">Revenue Intelligence</p>
                    <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-white">Command Center</h1>
                </div>
                <div className="flex gap-4">
                    <div className="bg-brand-card border border-brand-border px-4 py-2 rounded-lg flex items-center gap-3 focus-within:border-brand-accent/30 transition-colors">
                        <Search size={14} className="text-brand-muted" />
                        <input
                            type="text"
                            placeholder="Find account..."
                            className="bg-transparent border-none outline-none text-sm w-48 font-medium placeholder:text-brand-dim"
                        />
                    </div>
                </div>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
                <KPICard
                    label="Monitored accounts"
                    value={companies.length.toLocaleString()}
                    trend="+12% this month"
                    icon={<Users className="text-brand-accent/70" size={18} />}
                />
                <KPICard
                    label="Active buying windows"
                    value={activeWindows.toString()}
                    trend="8 new entries"
                    icon={<Zap className="text-brand-accent/70" size={18} />}
                />
                <KPICard
                    label="Signals detected (7d)"
                    value={totalSignals7d.toLocaleString()}
                    trend="Hiring priority"
                    icon={<TrendingUp className="text-brand-accent/70" size={18} />}
                />
                <KPICard
                    label="Expected pipeline"
                    value={formatINR(totalPipeline)}
                    trend="Est. conversion 22%"
                    icon={<DollarSign className="text-brand-accent/70" size={18} />}
                />
            </div>


            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-16">
                {/* Main Feed: Priority Accounts */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="flex items-center justify-between border-b border-brand-border pb-4">
                        <h2 className="text-lg font-semibold tracking-tight text-white">Accounts to contact this week</h2>
                        <Link href="/accounts" className="text-xs font-medium text-brand-accent hover:text-white transition-colors">View all</Link>
                    </div>

                    <div className="space-y-3">
                        {topAccounts.map((account, idx) => (
                            <AccountRow key={account.id} account={account} index={idx} />
                        ))}
                    </div>
                </div>

                {/* Real-time Signal Stream */}
                <div className="space-y-8">
                    <div className="flex items-center justify-between border-b border-brand-border pb-4">
                        <h2 className="text-lg font-semibold tracking-tight text-white">Global signal feed</h2>
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-brand-success animate-pulse" />
                            <span className="text-[10px] font-medium text-brand-dim uppercase tracking-wider">Live</span>
                        </div>
                    </div>

                    <div className="space-y-0 h-[400px] md:h-[650px] overflow-auto pr-2 md:pr-4 custom-scrollbar">
                        {companies.slice(0, 15).map((comp) => (
                            comp.signals.map((sig, sidx) => (
                                <SignalAlert key={`${comp.id}-${sidx}`} company={comp} signal={sig} />
                            ))
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

function KPICard({ label, value, trend, icon }: { label: string; value: string; trend: string; icon: React.ReactNode }) {
    return (
        <div className="bg-brand-card p-6 border border-brand-border rounded-xl space-y-6 relative overflow-hidden group hover:border-brand-accent/20 transition-all accent-line-top">
            <div className="flex justify-between items-start">
                <div className="p-2 bg-brand-accent-soft border border-brand-accent/10 rounded-lg">
                    {icon}
                </div>
                <p className="text-[10px] font-medium uppercase tracking-widest text-brand-dim bg-brand-bg px-2 py-0.5 rounded-full border border-brand-border">{trend}</p>
            </div>
            <div className="space-y-1">
                <p className="text-xs font-medium text-brand-muted">{label}</p>
                <p className="text-3xl font-semibold mono-nums text-white tracking-tight">{value}</p>
            </div>
        </div>
    )
}


function AccountRow({ account, index }: { account: Company; index: number }) {
    const router = useRouter()
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-brand-card border border-brand-border p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between group hover:border-brand-accent/20 hover:bg-white/[0.01] transition-all cursor-pointer shadow-sm gap-4 sm:gap-0"
            onClick={() => router.push(`/account/${account.id}`)}
        >
            <div className="flex items-center gap-5">
                <div className="w-11 h-11 bg-brand-surface border border-brand-border rounded-lg flex items-center justify-center font-bold text-lg text-brand-muted group-hover:text-brand-accent transition-colors">
                    {account.name[0]}
                </div>
                <div className="space-y-0.5">
                    <h3 className="font-semibold text-brand-text group-hover:text-white transition-colors">{account.name}</h3>
                    <div className="flex items-center gap-2">
                        <p className="text-[11px] font-medium text-brand-muted">{account.industry}</p>
                        <span className="w-1 h-1 rounded-full bg-brand-dim" />
                        <p className="text-[11px] font-medium text-brand-muted">{account.region}</p>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-10 w-full sm:w-auto">
                <div className="hidden md:block space-y-1 text-right">
                    <p className="text-[10px] font-medium text-brand-dim uppercase tracking-wider">Active Triggers</p>
                    <div className="flex gap-1 justify-end">
                        {account.signals.slice(0, 3).map((s, i) => (
                            <div key={i} className="w-1.5 h-1.5 bg-brand-accent/30 rounded-full" />
                        ))}
                    </div>
                </div>

                <div className="text-right space-y-0.5 min-w-[80px]">
                    <p className="text-[10px] font-medium text-brand-dim uppercase tracking-wider">Window Score</p>
                    <div className="flex items-baseline justify-end gap-1">
                        <span className={`text-xl font-semibold mono-nums tracking-tight ${account.buyingWindowScore > 80 ? 'text-brand-accent' : 'text-brand-text'}`}>
                            {account.buyingWindowScore}
                        </span>
                        <span className="text-[10px] font-medium text-brand-dim">/100</span>
                    </div>
                </div>

                <div className="w-8 h-8 md:w-10 md:h-10 border border-brand-border rounded-lg flex items-center justify-center hover:bg-brand-accent-soft group-hover:border-brand-accent/30 transition-all shrink-0">
                    <ArrowUpRight size={14} className="text-brand-muted group-hover:text-brand-accent transition-colors md:w-4 md:h-4" />
                </div>
            </div>
        </motion.div>
    )
}

function SignalAlert({ company, signal }: { company: Company; signal: any }) {
    const signalIcons: Record<string, any> = {
        HIRING_SPIKE: <TrendingUp size={14} />,
        EXEC_CHANGE: <Users size={14} />,
        FUNDING_RECENT: <DollarSign size={14} />,
        JD_KEYWORD_MATCH: <ShieldCheck size={14} />,
        TECH_STACK_CHANGE: <Zap size={14} />,
    }

    const hoursAgo = Math.floor((new Date().getTime() - new Date(signal.timestamp).getTime()) / (1000 * 3600))

    return (
        <div className="relative pl-6 pb-8 group last:pb-0">
            <div className="absolute left-0 top-0 bottom-0 w-px bg-brand-border group-last:h-4" />
            <div className="absolute left-[-3px] top-1.5 w-1.5 h-1.5 rounded-full bg-brand-dim group-hover:bg-brand-accent transition-colors" />

            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <p className="text-[10px] font-semibold text-brand-accent/80 flex items-center gap-1.5 uppercase tracking-wide">
                        {signalIcons[signal.type] || <Zap size={14} />} {signal.title}
                    </p>
                    <span className="text-[10px] font-medium text-brand-dim bg-brand-surface px-2 py-0.5 rounded-full border border-brand-border">{hoursAgo}h ago</span>
                </div>
                <p className="text-xs font-medium text-brand-text leading-relaxed">
                    <span className="text-white font-semibold">{company.name}</span>: {signal.description}
                </p>
            </div>
        </div>
    )
}
