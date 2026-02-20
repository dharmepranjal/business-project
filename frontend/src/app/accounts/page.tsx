"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Filter, ArrowUpDown, ChevronDown, ChevronRight, X, Download, Radar } from "lucide-react"

const MOCK_ACCOUNTS = [
    { id: 1, name: "Acme Corp", industry: "SaaS", score: 92, prob: 88, tier: "T1", signal: "Hiring Spike", angle: "Growth enablement — DevOps scaling", employees: 450, revenue: "$48M" },
    { id: 2, name: "GlobalTech Systems", industry: "FinTech", score: 89, prob: 84, tier: "T1", signal: "New CTO", angle: "New leadership — stack modernization", employees: 820, revenue: "$120M" },
    { id: 3, name: "CloudScale Inc", industry: "Infrastructure", score: 87, prob: 81, tier: "T1", signal: "Series B Raised", angle: "Post-funding acceleration", employees: 210, revenue: "$22M" },
    { id: 4, name: "NovaHealth AI", industry: "HealthTech", score: 85, prob: 79, tier: "T1", signal: "Tech Shift", angle: "Legacy to cloud migration", employees: 340, revenue: "$55M" },
    { id: 5, name: "DataFlow Labs", industry: "DevTools", score: 82, prob: 76, tier: "T1", signal: "Expansion", angle: "International scaling infrastructure", employees: 95, revenue: "$12M" },
    { id: 6, name: "SecureVault", industry: "CyberSecurity", score: 78, prob: 71, tier: "T2", signal: "Compliance Push", angle: "SOC2 automation opportunity", employees: 180, revenue: "$28M" },
    { id: 7, name: "BrightAI", industry: "AI/ML", score: 74, prob: 65, tier: "T2", signal: "ML Hiring", angle: "MLOps infrastructure needs", employees: 65, revenue: "$8M" },
    { id: 8, name: "FinEdge", industry: "FinTech", score: 71, prob: 62, tier: "T2", signal: "Growth Signal", angle: "Scaling payment infrastructure", employees: 550, revenue: "$85M" },
    { id: 9, name: "MedSync", industry: "HealthTech", score: 68, prob: 58, tier: "T2", signal: "Data Pipeline", angle: "Data engineering modernization", employees: 420, revenue: "$62M" },
    { id: 10, name: "CodeBuilder", industry: "DevTools", score: 45, prob: 32, tier: "T3", signal: "Low Activity", angle: "Monitor for trigger events", employees: 30, revenue: "$3M" },
]

const INDUSTRIES = ["All", "SaaS", "FinTech", "HealthTech", "DevTools", "CyberSecurity", "AI/ML", "Infrastructure"]
const TIERS = ["All", "T1", "T2", "T3"]

export default function AccountsPage() {
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedIndustry, setSelectedIndustry] = useState("All")
    const [selectedTier, setSelectedTier] = useState("All")
    const [sortBy, setSortBy] = useState<"score" | "prob">("score")
    const [sortDir, setSortDir] = useState<"asc" | "desc">("desc")
    const [expandedRow, setExpandedRow] = useState<number | null>(null)
    const [showFilters, setShowFilters] = useState(false)

    const filtered = MOCK_ACCOUNTS
        .filter((a) => {
            if (searchTerm && !a.name.toLowerCase().includes(searchTerm.toLowerCase()) && !a.signal.toLowerCase().includes(searchTerm.toLowerCase())) return false
            if (selectedIndustry !== "All" && a.industry !== selectedIndustry) return false
            if (selectedTier !== "All" && a.tier !== selectedTier) return false
            return true
        })
        .sort((a, b) => {
            const val = sortBy === "score" ? a.score - b.score : a.prob - b.prob
            return sortDir === "desc" ? -val : val
        })

    const toggleSort = (field: "score" | "prob") => {
        if (sortBy === field) setSortDir(sortDir === "desc" ? "asc" : "desc")
        else { setSortBy(field); setSortDir("desc") }
    }

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 md:p-8 space-y-6 max-w-[1400px] mx-auto">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">Account Intelligence</h1>
                    <p className="text-zinc-500 mt-1 text-sm">Deep-dive into company signals, scores, and buying intent.</p>
                </div>
                <button className="flex items-center gap-2 bg-zinc-900 border border-white/10 px-4 py-2 rounded-xl text-sm font-medium hover:bg-zinc-800 transition-colors">
                    <Download className="w-4 h-4" /> Export CSV
                </button>
            </div>

            {/* Search + Filters */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <input
                        type="text"
                        placeholder="Search companies, signals..."
                        className="w-full bg-zinc-900 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-zinc-600"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                        <button onClick={() => setSearchTerm("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white">
                            <X className="w-3 h-3" />
                        </button>
                    )}
                </div>
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors border ${showFilters ? "bg-indigo-600/10 border-indigo-500/30 text-indigo-400" : "bg-zinc-900 border-white/10 hover:bg-zinc-800"}`}
                >
                    <Filter className="w-4 h-4" /> Filters
                </button>
            </div>

            <AnimatePresence>
                {showFilters && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="flex flex-wrap gap-3 p-4 bg-zinc-900/50 border border-white/5 rounded-xl">
                            <div>
                                <p className="text-[10px] uppercase tracking-wider text-zinc-500 mb-2">Industry</p>
                                <div className="flex flex-wrap gap-1.5">
                                    {INDUSTRIES.map((ind) => (
                                        <button
                                            key={ind}
                                            onClick={() => setSelectedIndustry(ind)}
                                            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${selectedIndustry === ind ? "bg-indigo-600 text-white" : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"}`}
                                        >
                                            {ind}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <p className="text-[10px] uppercase tracking-wider text-zinc-500 mb-2">Priority Tier</p>
                                <div className="flex gap-1.5">
                                    {TIERS.map((t) => (
                                        <button
                                            key={t}
                                            onClick={() => setSelectedTier(t)}
                                            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${selectedTier === t ? "bg-indigo-600 text-white" : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"}`}
                                        >
                                            {t}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Table */}
            <div className="bg-zinc-900/80 backdrop-blur border border-white/[0.06] rounded-2xl overflow-hidden shadow-2xl shadow-black/40">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/5 bg-white/[0.02]">
                                <th className="px-5 py-4 text-[10px] font-semibold text-zinc-400 tracking-wider uppercase">Company</th>
                                <th className="px-5 py-4 text-[10px] font-semibold text-zinc-400 tracking-wider uppercase cursor-pointer select-none" onClick={() => toggleSort("score")}>
                                    <span className="flex items-center gap-1">Score <ArrowUpDown className="w-3 h-3" /></span>
                                </th>
                                <th className="px-5 py-4 text-[10px] font-semibold text-zinc-400 tracking-wider uppercase cursor-pointer select-none" onClick={() => toggleSort("prob")}>
                                    <span className="flex items-center gap-1">Buy Probability <ArrowUpDown className="w-3 h-3" /></span>
                                </th>
                                <th className="px-5 py-4 text-[10px] font-semibold text-zinc-400 tracking-wider uppercase hidden md:table-cell">Key Signal</th>
                                <th className="px-5 py-4 text-[10px] font-semibold text-zinc-400 tracking-wider uppercase hidden lg:table-cell">Suggested Angle</th>
                                <th className="px-5 py-4 text-[10px] font-semibold text-zinc-400 tracking-wider uppercase">Tier</th>
                                <th className="px-5 py-4"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((acc) => (
                                <>
                                    <tr
                                        key={acc.id}
                                        onClick={() => setExpandedRow(expandedRow === acc.id ? null : acc.id)}
                                        className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors cursor-pointer group"
                                    >
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-600/80 to-violet-600/80 flex items-center justify-center text-[11px] font-bold shadow-md">
                                                    {acc.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <a href={`/accounts/${acc.id}`} className="text-sm font-semibold hover:text-indigo-400 transition-colors">{acc.name}</a>
                                                    <p className="text-[10px] text-zinc-600">{acc.industry}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-20 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                                                    <div className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full" style={{ width: `${acc.score}%` }}></div>
                                                </div>
                                                <span className="text-sm font-mono font-medium text-zinc-200 w-7">{acc.score}</span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className="text-sm font-bold text-indigo-400">{acc.prob}%</span>
                                        </td>
                                        <td className="px-5 py-4 hidden md:table-cell">
                                            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/15 whitespace-nowrap">
                                                {acc.signal}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 hidden lg:table-cell">
                                            <span className="text-xs text-zinc-500 truncate max-w-[200px] block">{acc.angle}</span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className={`text-[10px] font-bold px-2 py-1 rounded-md ${acc.tier === "T1" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                                                    acc.tier === "T2" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
                                                        "bg-zinc-700/30 text-zinc-500 border border-zinc-700/30"
                                                }`}>
                                                {acc.tier}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-right">
                                            <motion.div animate={{ rotate: expandedRow === acc.id ? 90 : 0 }} className="text-zinc-500">
                                                <ChevronRight className="w-4 h-4" />
                                            </motion.div>
                                        </td>
                                    </tr>
                                    <AnimatePresence>
                                        {expandedRow === acc.id && (
                                            <tr key={`${acc.id}-expanded`}>
                                                <td colSpan={7} className="px-0 py-0 border-b border-white/[0.03]">
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: "auto", opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        transition={{ duration: 0.3 }}
                                                        className="overflow-hidden"
                                                    >
                                                        <div className="px-5 py-5 bg-zinc-950/50 grid grid-cols-2 md:grid-cols-4 gap-4">
                                                            <div>
                                                                <p className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1">Employees</p>
                                                                <p className="text-sm font-semibold">{acc.employees}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1">Revenue</p>
                                                                <p className="text-sm font-semibold text-emerald-400">{acc.revenue}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1">Signal Strength</p>
                                                                <div className="flex gap-1 mt-1">
                                                                    {[...Array(5)].map((_, i) => (
                                                                        <div key={i} className={`w-6 h-1.5 rounded-full ${i < Math.ceil(acc.score / 20) ? "bg-indigo-500" : "bg-zinc-800"}`} />
                                                                    ))}
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <a href={`/accounts/${acc.id}`} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600/10 border border-indigo-500/20 rounded-lg text-xs font-semibold text-indigo-400 hover:bg-indigo-600/20 transition-colors">
                                                                    <Radar className="w-3 h-3" /> View Full Intel
                                                                </a>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                </td>
                                            </tr>
                                        )}
                                    </AnimatePresence>
                                </>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="px-5 py-3 border-t border-white/5 text-[11px] text-zinc-500 flex justify-between items-center bg-white/[0.01]">
                    Showing {filtered.length} of {MOCK_ACCOUNTS.length} accounts
                    <div className="flex gap-2">
                        <button className="px-3 py-1 bg-zinc-800 rounded-lg hover:bg-zinc-700 disabled:opacity-40 transition-colors" disabled>Prev</button>
                        <button className="px-3 py-1 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition-colors">Next</button>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}
