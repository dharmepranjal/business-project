"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
    Bell,
    Search,
    Filter,
    TrendingUp,
    Users,
    DollarSign,
    ShieldCheck,
    Zap,
    ArrowRight,
    ChevronRight,
    Play
} from "lucide-react"
import { Company, Signal } from "@/lib/types"
import companiesData from "@/data/companies.json"
import { formatINR } from "@/lib/utils"

export default function AlertsPage() {
    const [alerts, setAlerts] = useState<{ company: Company, signal: Signal }[]>([])
    const [filter, setFilter] = useState<string>("ALL")
    const router = useRouter()

    useEffect(() => {
        const flatAlerts: { company: Company, signal: Signal }[] = []
            ; (companiesData as Company[]).forEach(comp => {
                comp.signals.forEach(sig => {
                    flatAlerts.push({ company: comp, signal: sig })
                })
            })
        setAlerts(flatAlerts.sort((a, b) => new Date(b.signal.timestamp).getTime() - new Date(a.signal.timestamp).getTime()))
    }, [])

    const filteredAlerts = filter === "ALL" ? alerts : alerts.filter(a => a.signal.type === filter)

    return (
        <div className="p-4 md:p-10 space-y-8 md:space-y-12 max-w-[1600px] mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div className="space-y-1">
                    <p className="text-[11px] font-medium tracking-wide text-brand-accent/80 uppercase">Signal Monitor</p>
                    <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-white">Buying Window Alerts</h1>
                </div>

                <div className="flex items-center gap-4">
                    <div className="bg-brand-card border border-brand-border px-4 py-2.5 rounded-lg flex items-center gap-3 focus-within:border-brand-accent/30 transition-colors">
                        <Filter size={14} className="text-brand-muted" />
                        <select
                            className="bg-transparent border-none outline-none text-[11px] font-semibold uppercase tracking-wider text-brand-text cursor-pointer"
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                        >
                            <option value="ALL">All triggers</option>
                            <option value="HIRING_SPIKE">Hiring spike</option>
                            <option value="EXEC_CHANGE">Executive change</option>
                            <option value="FUNDING_RECENT">Recent funding</option>
                            <option value="JD_KEYWORD_MATCH">JD keyword match</option>
                            <option value="TECH_STACK_CHANGE">Stack change</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="space-y-3 max-w-5xl">
                {filteredAlerts.slice(0, 30).map((alert, idx) => (
                    <AlertCard
                        key={`${alert.company.id}-${alert.signal.id}`}
                        alert={alert}
                        index={idx}
                        router={router}
                    />
                ))}
            </div>
        </div>
    )
}

function AlertCard({ alert, index, router }: { alert: { company: Company, signal: Signal }, index: number, router: any }) {
    const signalIcons: Record<string, any> = {
        HIRING_SPIKE: <TrendingUp size={18} />,
        EXEC_CHANGE: <Users size={18} />,
        FUNDING_RECENT: <DollarSign size={18} />,
        JD_KEYWORD_MATCH: <ShieldCheck size={18} />,
        TECH_STACK_CHANGE: <Zap size={18} />,
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-brand-card border border-brand-border p-6 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between group hover:border-brand-accent/20 hover:bg-white/[0.01] transition-all cursor-pointer shadow-sm relative overflow-hidden gap-6 sm:gap-0"
            onClick={() => router.push(`/account/${alert.company.id}`)}
        >
            <div className="flex items-center gap-6 relative z-10">
                <div className="w-12 h-12 bg-brand-surface border border-brand-border rounded-lg flex items-center justify-center text-brand-muted group-hover:text-brand-accent group-hover:bg-brand-accent/5 transition-all">
                    {signalIcons[alert.signal.type] || <Zap size={18} />}
                </div>

                <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-brand-text leading-none group-hover:text-white transition-colors">{alert.signal.title}</h3>
                        <span className="text-[10px] font-medium text-brand-dim uppercase tracking-wider">in</span>
                        <span className="text-xs font-bold text-brand-accent/80 uppercase tracking-tight">{alert.company.name}</span>
                    </div>
                    <p className="text-xs text-brand-muted leading-relaxed max-w-2xl font-medium">{alert.signal.description}</p>
                </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-10 relative z-10 w-full sm:w-auto">
                <div className="text-right space-y-0.5">
                    <p className="text-[10px] font-medium text-brand-dim uppercase tracking-wider">Potential win</p>
                    <p className="text-lg font-semibold text-brand-text mono-nums tracking-tight group-hover:text-white transition-colors">{formatINR(alert.company.expectedRevenueValue)}</p>
                </div>

                <div className="w-8 h-8 md:w-10 md:h-10 border border-brand-border rounded-lg flex items-center justify-center text-brand-dim group-hover:text-brand-accent group-hover:border-brand-accent/30 transition-all shrink-0">
                    <ChevronRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
                </div>
            </div>
        </motion.div>
    )
}
