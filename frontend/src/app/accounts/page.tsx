"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
    ArrowUpDown,
    ExternalLink,
    Linkedin,
    Mail,
    Download,
    Search,
    ChevronDown,
    Filter,
    BarChart4
} from "lucide-react"
import { Company } from "@/lib/types"
import companiesData from "@/data/companies.json"

export default function AccountsPage() {
    const [companies, setCompanies] = useState<Company[]>([])
    const [search, setSearch] = useState("")

    useEffect(() => {
        setCompanies(companiesData as Company[])
    }, [])

    const filtered = companies
        .filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.industry.toLowerCase().includes(search.toLowerCase()))
        .sort((a, b) => b.buyingWindowScore - a.buyingWindowScore)

    return (
        <div className="p-4 md:p-10 space-y-8 md:space-y-12 max-w-[1600px] mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div className="space-y-1">
                    <p className="text-[11px] font-medium tracking-wide text-brand-accent/80 uppercase">Universe Management</p>
                    <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-white">Monitored Accounts</h1>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="flex-1 md:flex-none bg-brand-card border border-brand-border px-4 py-2.5 rounded-lg flex items-center gap-3 focus-within:border-brand-accent/30 transition-colors">
                        <Search size={14} className="text-brand-muted" />
                        <input
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            type="text"
                            placeholder="Find an account..."
                            className="bg-transparent border-none outline-none text-sm w-full md:w-64 font-medium"
                        />
                    </div>
                    <button className="p-2.5 border border-brand-border bg-brand-card rounded-lg hover:border-brand-accent/30 transition-all text-brand-muted">
                        <Download size={18} />
                    </button>
                </div>
            </div>

            <div className="bg-brand-card border border-brand-border rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/[0.02] text-[11px] font-semibold text-brand-muted border-b border-brand-border">
                                <th className="px-8 py-5">Account details</th>
                                <th className="px-8 py-5">
                                    <div className="flex items-center gap-1.5 cursor-pointer hover:text-white transition-colors">
                                        Buying window <ArrowUpDown size={12} />
                                    </div>
                                </th>
                                <th className="px-8 py-5 text-center">Signals</th>
                                <th className="px-8 py-5">Est. value</th>
                                <th className="px-8 py-5">Engagement</th>
                                <th className="px-8 py-5"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-brand-border">
                            {filtered.map((company, idx) => (
                                <AccountItem key={company.id} company={company} index={idx} />
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

function AccountItem({ company, index }: { company: Company; index: number }) {
    const [expanded, setExpanded] = useState(false)
    const router = useRouter()

    return (
        <>
            <motion.tr
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.01 }}
                className={`group transition-all cursor-pointer ${expanded ? 'bg-brand-accent/[0.02]' : 'hover:bg-white/[0.01]'}`}
                onClick={() => setExpanded(!expanded)}
            >
                <td className="px-8 py-6">
                    <div className="flex items-center gap-5">
                        <div className="w-10 h-10 bg-brand-surface border border-brand-border rounded-lg flex items-center justify-center font-bold text-brand-muted group-hover:text-brand-accent transition-colors">
                            {company.name[0]}
                        </div>
                        <div>
                            <p className="font-semibold text-brand-text leading-none mb-1.5 group-hover:text-white transition-colors">{company.name}</p>
                            <p className="text-[11px] font-medium text-brand-muted">{company.industry} · {company.region}</p>
                        </div>
                    </div>
                </td>
                <td className="px-8 py-6">
                    <div className="flex items-center gap-4 min-w-[140px]">
                        <div className={`text-lg font-semibold mono-nums tracking-tight ${company.buyingWindowScore > 75 ? 'text-brand-accent' : 'text-brand-text'}`}>
                            {company.buyingWindowScore}%
                        </div>
                        <div className="flex-1 max-w-[100px] h-1.5 bg-brand-surface rounded-full overflow-hidden border border-brand-border/50">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${company.buyingWindowScore}%` }}
                                transition={{ duration: 1, delay: index * 0.02 }}
                                className={`h-full rounded-full ${company.buyingWindowScore > 75 ? 'bg-brand-accent shadow-[0_0_8px_rgba(232,185,49,0.2)]' : 'bg-brand-dim'}`}
                            />
                        </div>
                    </div>
                </td>
                <td className="px-8 py-6 text-center">
                    <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-brand-accent/5 border border-brand-accent/10 rounded-md">
                        <BarChart4 size={12} className="text-brand-accent/80" />
                        <span className="text-[11px] font-bold mono-nums text-brand-accent">{company.activeTriggersCount}</span>
                    </div>
                </td>
                <td className="px-8 py-6">
                    <div className="space-y-0.5">
                        <p className="text-sm font-semibold text-brand-text mono-nums tracking-tight">{company.expectedRevenueValue >= 1000000 ? `$${(company.expectedRevenueValue / 1000000).toFixed(1)}M` : `$${(company.expectedRevenueValue / 1000).toFixed(0)}K`}</p>
                        <p className="text-[10px] font-medium text-brand-dim uppercase tracking-wider">Prob. {Math.round(company.closeProbability * 100)}%</p>
                    </div>
                </td>
                <td className="px-8 py-6">
                    <div className="flex gap-4 text-brand-dim">
                        <a href={company.linkedin} target="_blank" onClick={e => e.stopPropagation()} className="hover:text-brand-accent transition-colors p-1.5 hover:bg-brand-accent/5 rounded-md"><Linkedin size={16} /></a>
                        <a href={`mailto:${company.contactEmail}`} onClick={e => e.stopPropagation()} className="hover:text-brand-accent transition-colors p-1.5 hover:bg-brand-accent/5 rounded-md"><Mail size={16} /></a>
                        <a href={company.website} target="_blank" onClick={e => e.stopPropagation()} className="hover:text-brand-accent transition-colors p-1.5 hover:bg-brand-accent/5 rounded-md"><ExternalLink size={16} /></a>
                    </div>
                </td>
                <td className="px-8 py-6 text-right">
                    <div className={`p-2 rounded-lg transition-all ${expanded ? 'bg-brand-accent/10 text-brand-accent' : 'text-brand-dim group-hover:text-white group-hover:bg-white/5'}`}>
                        <ChevronDown size={18} className={`transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`} />
                    </div>
                </td>
            </motion.tr>

            <AnimatePresence>
                {expanded && (
                    <motion.tr
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                    >
                        <td colSpan={6} className="px-8 py-10 bg-white/[0.01] border-b border-brand-border">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                                <div className="space-y-6">
                                    <h4 className="text-[11px] font-semibold text-brand-accent uppercase tracking-widest pl-4 border-l-2 border-brand-accent">Active trigger history</h4>
                                    <div className="space-y-6">
                                        {company.signals.map((sig, i) => (
                                            <div key={i} className="flex gap-5 items-start">
                                                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-accent/40" />
                                                <div className="space-y-1.5">
                                                    <p className="text-xs font-semibold text-brand-text uppercase tracking-tight">{sig.title}</p>
                                                    <p className="text-xs text-brand-muted leading-relaxed max-w-md">{sig.description}</p>
                                                    <p className="text-[10px] font-medium text-brand-dim">{new Date(sig.timestamp).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-8">
                                    <div>
                                        <h4 className="text-[11px] font-semibold text-brand-accent uppercase tracking-widest mb-4 pl-4 border-l-2 border-brand-accent">Technical specifications</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {company.techStack.map(tech => (
                                                <span key={tech} className="px-2.5 py-1 bg-brand-surface border border-brand-border rounded-md text-[10px] font-semibold text-brand-text uppercase tracking-wider shadow-sm">
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="p-6 rounded-xl border border-brand-border bg-brand-card space-y-4 relative overflow-hidden group/card shadow-lg">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-accent opacity-[0.02] -translate-y-16 translate-x-16 rounded-full group-hover/card:scale-110 transition-transform duration-700" />
                                        <div className="flex justify-between items-center">
                                            <p className="text-[10px] font-semibold text-brand-dim uppercase tracking-widest">Account brief</p>
                                            <div className="px-2 py-0.5 rounded-full bg-brand-surface border border-brand-border text-[9px] font-bold text-brand-dim uppercase tracking-wider">Operational</div>
                                        </div>
                                        <p className="text-xs text-brand-muted leading-relaxed">
                                            {company.description} Established in {company.founded}, targeting {company.subIndustry} within the {company.location} region.
                                        </p>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                router.push(`/account/${company.id}`);
                                            }}
                                            className="w-full py-3 mt-2 bg-brand-surface border border-brand-border rounded-lg text-[11px] font-semibold text-brand-accent hover:border-brand-accent/40 hover:bg-brand-accent/5 transition-all uppercase tracking-widest flex items-center justify-center gap-2 group/btn"
                                        >
                                            Enter intelligence report <ExternalLink size={12} className="group-hover/btn:translate-x-0.5 transition-transform" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </td>
                    </motion.tr>
                )}
            </AnimatePresence>
        </>
    )
}
