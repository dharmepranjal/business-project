"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import {
    ArrowLeft,
    Shield,
    BarChart3,
    Users,
    DollarSign,
    Globe,
    Cpu,
    TrendingUp,
    ExternalLink,
    MessageSquare
} from "lucide-react"
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from "recharts"
import { Company, UserProfile, WeightConfig, ScoredResult } from "@/lib/types"
import { rankLeads } from "@/lib/scoring"
import companiesData from "@/data/companies.json"

export default function ComparePage() {
    const [compareIds, setCompareIds] = useState<number[]>([])
    const [scoredResults, setScoredResults] = useState<ScoredResult[]>([])
    const [radarData, setRadarData] = useState<any[]>([])

    useEffect(() => {
        const storedIds = localStorage.getItem("leadlens_compare")
        const storedProfile = localStorage.getItem("leadlens_profile")

        if (storedIds && storedProfile) {
            const ids = JSON.parse(storedIds)
            const profile = JSON.parse(storedProfile)
            setCompareIds(ids)

            // Re-score them to get dimensions
            const defaultWeights: WeightConfig = { size: 15, revenue: 10, tech: 25, stage: 15, region: 10, hiring: 10, industry: 15 }
            const allRanked = rankLeads(companiesData as Company[], profile, defaultWeights)
            const filtered = allRanked.filter(r => ids.includes(r.company.id))
            setScoredResults(filtered)

            // Prepare radar data
            const parameters = ["size", "revenue", "tech", "stage", "region", "hiring", "industry"]
            const formatted = parameters.map(p => {
                const row: any = { parameter: p.charAt(0).toUpperCase() + p.slice(1) }
                filtered.forEach(r => {
                    row[r.company.name] = (r.dimensionScores as any)[p]
                })
                return row
            })
            setRadarData(formatted)
        }
    }, [])

    if (scoredResults.length === 0) return <div className="p-20 text-center animate-pulse text-zinc-500">Loading comparison...</div>

    const colors = ["#6366f1", "#10b981", "#f59e0b"]

    return (
        <div className="min-h-screen bg-black text-white p-6 md:p-12">
            <div className="max-w-[1400px] mx-auto space-y-12">

                {/* Back Button */}
                <a href="/results" className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-sm w-fit group">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Analysis
                </a>

                {/* Hero Header */}
                <div className="space-y-4">
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight">Lead Comparison</h1>
                    <p className="text-zinc-500">Side-by-side technical profile matching for your selected accounts.</p>
                </div>

                {/* Radar Chart Section */}
                <div className="bg-zinc-900/50 border border-white/[0.06] rounded-[40px] p-8 md:p-12">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
                        <div className="space-y-8">
                            <div className="flex items-center gap-2 text-indigo-400 font-bold uppercase tracking-widest text-xs">
                                <BarChart3 className="w-4 h-4" /> Multi-Dimension Analysis
                            </div>
                            <div className="space-y-6">
                                {scoredResults.map((r, i) => (
                                    <div key={r.company.id} className="flex items-center gap-4">
                                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: colors[i] }}></div>
                                        <div>
                                            <p className="font-bold text-sm">{r.company.name}</p>
                                            <p className="text-xs text-zinc-500">Score: {r.compositeScore}% match</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="p-5 bg-white/5 border border-white/5 rounded-2xl">
                                <p className="text-xs text-zinc-400 leading-relaxed italic flex gap-3">
                                    <MessageSquare className="w-8 h-8 opacity-20 shrink-0" />
                                    This chart visualizes how each company aligns with your 7 key scoring dimensions. Higher volume indicates a more balanced lead.
                                </p>
                            </div>
                        </div>

                        <div className="lg:col-span-2 h-[450px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart data={radarData}>
                                    <PolarGrid stroke="#27272a" />
                                    <PolarAngleAxis dataKey="parameter" stroke="#71717a" fontSize={12} />
                                    <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                                    {scoredResults.map((r, i) => (
                                        <Radar
                                            key={r.company.id}
                                            name={r.company.name}
                                            dataKey={r.company.name}
                                            stroke={colors[i]}
                                            fill={colors[i]}
                                            fillOpacity={0.1}
                                            strokeWidth={3}
                                        />
                                    ))}
                                    <Tooltip contentStyle={{ background: "#18181b", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "12px" }} />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Vertical Comparison Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {scoredResults.map((r, i) => (
                        <motion.div
                            key={r.company.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-zinc-900/40 border border-white/[0.06] rounded-[32px] p-8 space-y-8 relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/[0.02] rounded-full -translate-y-16 translate-x-16"></div>

                            {/* Header */}
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-2xl bg-zinc-800 flex items-center justify-center font-bold text-2xl text-white shadow-xl">
                                    {r.company.name[0]}
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold">{r.company.name}</h3>
                                    <p className="text-xs text-zinc-500 uppercase tracking-widest">{r.company.industry}</p>
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                                <div className="space-y-1">
                                    <p className="text-[10px] text-zinc-600 uppercase font-bold tracking-widest">Employees</p>
                                    <p className="text-sm font-medium">{r.company.employeeCount.toLocaleString()}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] text-zinc-600 uppercase font-bold tracking-widest">Revenue Est</p>
                                    <p className="text-sm font-medium text-emerald-400">{r.company.revenueRange}</p>
                                </div>
                            </div>

                            {/* Dimension Tiles */}
                            <div className="space-y-3">
                                <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Key Performance</p>
                                <div className="grid grid-cols-1 gap-2">
                                    <div className="flex items-center justify-between p-3 bg-white/[0.03] border border-white/5 rounded-xl">
                                        <div className="flex items-center gap-2 text-xs text-zinc-300">
                                            <Shield className="w-3.5 h-3.5 text-indigo-400" /> Security/Stage
                                        </div>
                                        <span className="text-xs font-mono">{r.dimensionScores.stage}%</span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-white/[0.03] border border-white/5 rounded-xl">
                                        <div className="flex items-center gap-2 text-xs text-zinc-300">
                                            <Cpu className="w-3.5 h-3.5 text-purple-400" /> Tech Alignment
                                        </div>
                                        <span className="text-xs font-mono">{r.dimensionScores.tech}%</span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-white/[0.03] border border-white/5 rounded-xl">
                                        <div className="flex items-center gap-2 text-xs text-zinc-300">
                                            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> Hiring Rank
                                        </div>
                                        <span className="text-xs font-mono">{r.dimensionScores.hiring}%</span>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Footer */}
                            <div className="pt-8 border-t border-white/5 flex justify-between items-center">
                                <div className="flex gap-4 text-zinc-500">
                                    <a href={r.company.website} target="_blank" className="hover:text-white transition-colors"><ExternalLink className="w-4.5 h-4.5" /></a>
                                    <a href={r.company.linkedin} target="_blank" className="hover:text-white transition-colors"><Linkedin size={18} /></a>
                                </div>
                                <a
                                    href={`mailto:${r.company.contactEmail}`}
                                    className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-[10px] font-bold uppercase rounded-lg transition-all"
                                >
                                    Get Contact
                                </a>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    )
}

import { Linkedin } from "lucide-react"
