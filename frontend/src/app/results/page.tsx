"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Download,
    ExternalLink,
    Linkedin,
    Mail,
    ChevronDown,
    ChevronUp,
    Plus,
    BarChart3,
    Filter,
    ArrowUpDown,
    CheckCircle2,
    X,
    Info
} from "lucide-react"
import { UserProfile, WeightConfig, ScoredResult, Company } from "@/lib/types"
import { rankLeads } from "@/lib/scoring"
import { exportLeadsToCSV } from "@/lib/export"
import companiesData from "@/data/companies.json"

export default function ResultsPage() {
    const [profile, setProfile] = useState<UserProfile | null>(null)
    const [weights, setWeights] = useState<WeightConfig>({
        size: 15,
        revenue: 10,
        tech: 25,
        stage: 15,
        region: 10,
        hiring: 10,
        industry: 15
    })
    const [results, setResults] = useState<ScoredResult[]>([])
    const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set())
    const [selectedForCompare, setSelectedForCompare] = useState<number[]>([])

    useEffect(() => {
        const stored = localStorage.getItem("leadlens_profile")
        if (stored) {
            setProfile(JSON.parse(stored))
        }
    }, [])

    useEffect(() => {
        if (profile) {
            const ranked = rankLeads(companiesData as Company[], profile, weights)
            setResults(ranked)
        }
    }, [profile, weights])

    const toggleRow = (id: number) => {
        const newSet = new Set(expandedRows)
        if (newSet.has(id)) newSet.delete(id)
        else newSet.add(id)
        setExpandedRows(newSet)
    }

    const toggleCompare = (id: number) => {
        if (selectedForCompare.includes(id)) {
            setSelectedForCompare(selectedForCompare.filter(i => i !== id))
        } else if (selectedForCompare.length < 3) {
            setSelectedForCompare([...selectedForCompare, id])
        }
    }

    const handleExport = () => {
        exportLeadsToCSV(results.slice(0, 50))
    }

    if (!profile) return <div className="p-20 text-center animate-pulse text-zinc-500">Initializing Lead Finder...</div>

    return (
        <div className="min-h-screen bg-black text-white p-6 md:p-8">
            <div className="max-w-[1400px] mx-auto space-y-8">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Lead Analysis Results</h1>
                        <p className="text-zinc-500 text-sm mt-1">Found {results.length} companies matched for your "{profile.saasCategory}" profile.</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={handleExport}
                            className="bg-white text-black px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-zinc-200 transition-all active:scale-95"
                        >
                            <Download className="w-4 h-4" /> Export CSV (Top 50)
                        </button>
                    </div>
                </div>

                {/* Weight Adjustment Bar */}
                <div className="bg-zinc-900/50 border border-white/[0.06] rounded-2xl p-6">
                    <div className="flex items-center gap-2 mb-6 text-zinc-400 text-xs font-bold uppercase tracking-widest">
                        <Filter className="w-4 h-4" /> Fine-Tune Scoring weights
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-7 gap-6">
                        {Object.entries(weights).map(([key, value]) => (
                            <div key={key} className="space-y-2">
                                <div className="flex justify-between text-[10px] uppercase font-bold text-zinc-500">
                                    <span>{key}</span>
                                    <span className="text-indigo-400">{value}%</span>
                                </div>
                                <input
                                    type="range" min="0" max="50" step="5"
                                    value={value}
                                    onChange={e => setWeights({ ...weights, [key]: parseInt(e.target.value) })}
                                    className="w-full h-1 accent-indigo-500"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-zinc-900/40 border border-white/[0.04] p-6 rounded-2xl">
                        <p className="text-zinc-500 text-xs uppercase font-bold tracking-widest mb-1">Top Match Score</p>
                        <p className="text-4xl font-black text-emerald-400">{results[0]?.compositeScore}%</p>
                    </div>
                    <div className="bg-zinc-900/40 border border-white/[0.04] p-6 rounded-2xl">
                        <p className="text-zinc-500 text-xs uppercase font-bold tracking-widest mb-1">Avg. Probability</p>
                        <p className="text-4xl font-black text-indigo-400">
                            {(results.reduce((a, b) => a + b.compositeScore, 0) / results.length).toFixed(1)}%
                        </p>
                    </div>
                    <div className="bg-zinc-900/40 border border-white/[0.04] p-6 rounded-2xl">
                        <p className="text-zinc-500 text-xs uppercase font-bold tracking-widest mb-1">Ready for CRM</p>
                        <p className="text-4xl font-black text-zinc-100">{results.filter(r => r.compositeScore > 70).length}</p>
                    </div>
                </div>

                {/* Table Section */}
                <div className="bg-zinc-900/30 border border-white/[0.06] rounded-[32px] overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-zinc-900/80 text-zinc-500 text-[10px] uppercase font-bold tracking-widest">
                            <tr>
                                <th className="px-6 py-4">Compare</th>
                                <th className="px-6 py-4">Account</th>
                                <th className="px-6 py-4">Match Score</th>
                                <th className="px-6 py-4 hidden md:table-cell">Why It Matched</th>
                                <th className="px-6 py-4">Contact</th>
                                <th className="px-6 py-4"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.04]">
                            {results.map((result) => (
                                <React.Fragment key={result.company.id}>
                                    <tr className={`hover:bg-white/[0.02] transition-colors group ${expandedRows.has(result.company.id) ? "bg-white/[0.03]" : ""}`}>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => toggleCompare(result.company.id)}
                                                className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${selectedForCompare.includes(result.company.id)
                                                        ? "bg-indigo-600 border-indigo-500 text-white"
                                                        : "border-zinc-700 hover:border-zinc-500"
                                                    }`}
                                            >
                                                {selectedForCompare.includes(result.company.id) && <CheckCircle2 className="w-3.5 h-3.5" />}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-zinc-700 to-zinc-900 flex items-center justify-center font-bold text-zinc-300">
                                                    {result.company.name[0]}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-sm">{result.company.name}</p>
                                                    <p className="text-[10px] text-zinc-500 uppercase tracking-wider">{result.company.industry} · {result.company.employeeRange}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className={`text-lg font-black ${result.compositeScore > 85 ? "text-emerald-400" :
                                                    result.compositeScore > 70 ? "text-indigo-400" :
                                                        "text-zinc-500"
                                                }`}>
                                                {result.compositeScore}%
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 hidden md:table-cell max-w-[300px]">
                                            <div className="flex flex-wrap gap-1.5 line-clamp-2">
                                                {result.matchReasons.slice(0, 3).map((reason, i) => (
                                                    <span key={i} className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 whitespace-nowrap">
                                                        {reason}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4 text-zinc-500">
                                                <a href={result.company.website} target="_blank" className="hover:text-white transition-colors"><ExternalLink className="w-4 h-4" /></a>
                                                <a href={result.company.linkedin} target="_blank" className="hover:text-white transition-colors"><Linkedin className="w-4 h-4" /></a>
                                                <a href={`mailto:${result.company.contactEmail}`} className="hover:text-white transition-colors"><Mail className="w-4 h-4" /></a>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button onClick={() => toggleRow(result.company.id)} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                                                {expandedRows.has(result.company.id) ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                            </button>
                                        </td>
                                    </tr>
                                    <AnimatePresence>
                                        {expandedRows.has(result.company.id) && (
                                            <motion.tr
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: "auto" }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="bg-zinc-950/80"
                                            >
                                                <td colSpan={6} className="px-6 py-8">
                                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                                                        <div className="space-y-6">
                                                            <div>
                                                                <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-4">Parameter Score Breakdown</h4>
                                                                <div className="space-y-4">
                                                                    {Object.entries(result.dimensionScores).map(([key, value]) => (
                                                                        <div key={key} className="space-y-1.5">
                                                                            <div className="flex justify-between text-xs">
                                                                                <span className="capitalize text-zinc-400">{key} Match</span>
                                                                                <span className="font-mono text-zinc-500">{value}%</span>
                                                                            </div>
                                                                            <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
                                                                                <motion.div
                                                                                    initial={{ width: 0 }}
                                                                                    animate={{ width: `${value}%` }}
                                                                                    className="h-full bg-indigo-500"
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="space-y-6">
                                                            <div>
                                                                <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-4">Detailed Intel</h4>
                                                                <div className="p-5 bg-zinc-900/50 rounded-2xl border border-white/5 space-y-4">
                                                                    <div className="grid grid-cols-2 gap-4">
                                                                        <div>
                                                                            <p className="text-[10px] text-zinc-600 uppercase mb-0.5">Founded</p>
                                                                            <p className="text-sm font-medium">{result.company.founded}</p>
                                                                        </div>
                                                                        <div>
                                                                            <p className="text-[10px] text-zinc-600 uppercase mb-0.5">Location</p>
                                                                            <p className="text-sm font-medium">{result.company.location}</p>
                                                                        </div>
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-[10px] text-zinc-600 uppercase mb-1">Tech Stack Match</p>
                                                                        <div className="flex flex-wrap gap-1.5">
                                                                            {result.company.techStack.map(t => (
                                                                                <span key={t} className={`px-2 py-0.5 rounded text-[10px] ${profile.requiredTech.some(rt => rt.toLowerCase() === t.toLowerCase())
                                                                                        ? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30"
                                                                                        : "bg-zinc-800 text-zinc-500"
                                                                                    }`}>
                                                                                    {t}
                                                                                </span>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                    <p className="text-xs text-zinc-400 leading-relaxed pt-2 border-t border-white/5">
                                                                        "{result.company.description}"
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                            </motion.tr>
                                        )}
                                    </AnimatePresence>
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Compare Bar */}
            <AnimatePresence>
                {selectedForCompare.length > 0 && (
                    <motion.div
                        initial={{ y: 100 }}
                        animate={{ y: 0 }}
                        exit={{ y: 100 }}
                        className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-white text-black p-4 rounded-3xl shadow-2xl flex items-center gap-6 z-50 border border-zinc-200"
                    >
                        <div className="flex -space-x-2">
                            {selectedForCompare.map(id => {
                                const comp = companiesData.find(c => c.id === id)
                                return (
                                    <div key={id} className="w-10 h-10 rounded-full border-2 border-white bg-black flex items-center justify-center font-bold text-white text-xs">
                                        {comp?.name[0]}
                                    </div>
                                )
                            })}
                        </div>
                        <div className="pr-4 border-r border-zinc-200">
                            <p className="text-xs font-bold leading-none">{selectedForCompare.length} selected for comparison</p>
                            <p className="text-[10px] text-zinc-500 mt-0.5">Max 3 accounts</p>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => {
                                    localStorage.setItem("leadlens_compare", JSON.stringify(selectedForCompare))
                                    window.location.href = "/compare"
                                }}
                                className="bg-black text-white px-6 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 hover:bg-zinc-800 active:scale-95 transition-all"
                            >
                                <BarChart3 className="w-4 h-4" /> Compare Now
                            </button>
                            <button onClick={() => setSelectedForCompare([])} className="p-2 hover:bg-zinc-100 rounded-full">
                                <X className="w-4 h-4 text-zinc-400" />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

import React from "react"
