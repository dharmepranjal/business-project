"use client"

import { motion } from "framer-motion"
import { ArrowLeft, Mail, TrendingUp, DollarSign, Shield, Cpu, Clock, MessageSquare } from "lucide-react"
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, AreaChart, Area } from "recharts"

const radarData = [
    { signal: "ICP", value: 0.85 },
    { signal: "Hiring", value: 0.92 },
    { signal: "Funding", value: 0.78 },
    { signal: "Pain", value: 0.88 },
    { signal: "Timing", value: 0.65 },
]

const hiringTrend = [
    { month: "Sep", roles: 3 },
    { month: "Oct", roles: 5 },
    { month: "Nov", roles: 8 },
    { month: "Dec", roles: 7 },
    { month: "Jan", roles: 14 },
    { month: "Feb", roles: 22 },
]

const fundingTimeline = [
    { year: "2021", event: "Seed Round", amount: "$2.5M", desc: "Initial product development" },
    { year: "2022", event: "Series A", amount: "$12M", desc: "Market expansion and team growth" },
    { year: "2024", event: "Series B", amount: "$38M", desc: "Enterprise push and international expansion" },
]

const outreachAngles = [
    {
        angle: "Growth Enablement",
        subject: "Scaling SaaS? Here's how top teams do it",
        preview: "I noticed Acme Corp is hiring aggressively in engineering. Companies at your growth stage often hit infrastructure bottlenecks that slow delivery by 40%.",
        signal: "Hiring Spike",
    },
    {
        angle: "Post-Funding Acceleration",
        subject: "Congrats on the Series B — here's what winners do next",
        preview: "After raising $38M, the clock starts. The best-performing companies in your cohort invested immediately in developer infrastructure.",
        signal: "Recent Funding",
    },
    {
        angle: "Pain Point Direct",
        subject: "The security compliance problem at Acme Corp",
        preview: "I've been studying how SaaS companies handle security compliance. Most spend 15+ engineering hours/week on it.",
        signal: "Pain Match",
    },
]

const painTopics = [
    { topic: "Infrastructure Scaling", score: 0.88 },
    { topic: "Security Compliance", score: 0.72 },
    { topic: "Developer Productivity", score: 0.65 },
    { topic: "Cost Optimization", score: 0.41 },
]

export default function AccountDetailPage() {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="p-6 md:p-8 max-w-[1400px] mx-auto space-y-8"
        >
            {/* Back + Hero */}
            <a href="/accounts" className="flex items-center gap-2 text-sm text-zinc-500 hover:text-white transition-colors w-fit">
                <ArrowLeft className="w-4 h-4" /> Back to Intelligence
            </a>

            <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-xl font-bold shadow-xl shadow-indigo-500/20">
                            A
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Acme Corp</h1>
                            <p className="text-zinc-500 text-sm">SaaS · Series B · San Francisco, CA · 450 employees</p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="text-center px-5 py-3 bg-zinc-900 border border-white/5 rounded-xl">
                        <p className="text-2xl font-bold text-indigo-400">92</p>
                        <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Score</p>
                    </div>
                    <div className="text-center px-5 py-3 bg-zinc-900 border border-white/5 rounded-xl">
                        <p className="text-2xl font-bold text-emerald-400">88%</p>
                        <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Buy Prob</p>
                    </div>
                    <span className="text-xs font-bold px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">T1</span>
                </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Radar Chart */}
                <div className="bg-zinc-900/80 backdrop-blur border border-white/[0.06] rounded-2xl p-6">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                        <Shield className="w-4 h-4 text-indigo-400" /> Signal Dimensions
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <RadarChart data={radarData} outerRadius="70%">
                            <PolarGrid stroke="#27272a" />
                            <PolarAngleAxis dataKey="signal" stroke="#71717a" fontSize={12} />
                            <PolarRadiusAxis domain={[0, 1]} tick={false} axisLine={false} />
                            <Radar
                                dataKey="value"
                                stroke="#6366f1"
                                fill="#6366f1"
                                fillOpacity={0.2}
                                strokeWidth={2}
                            />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>

                {/* Hiring Trend */}
                <div className="bg-zinc-900/80 backdrop-blur border border-white/[0.06] rounded-2xl p-6">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-emerald-400" /> Hiring Trend (6 Months)
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={hiringTrend}>
                            <defs>
                                <linearGradient id="hiringGrad2" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                                    <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                            <XAxis dataKey="month" stroke="#52525b" fontSize={11} />
                            <YAxis stroke="#52525b" fontSize={11} />
                            <Tooltip contentStyle={{ background: "#18181b", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "12px", fontSize: "12px" }} />
                            <Area type="monotone" dataKey="roles" stroke="#10b981" fill="url(#hiringGrad2)" strokeWidth={2.5} dot={{ r: 4, fill: "#10b981" }} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Funding Timeline + Pain Topics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Funding Timeline */}
                <div className="bg-zinc-900/80 backdrop-blur border border-white/[0.06] rounded-2xl p-6">
                    <h3 className="font-semibold mb-6 flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-amber-400" /> Funding Timeline
                    </h3>
                    <div className="space-y-0">
                        {fundingTimeline.map((round, i) => (
                            <div key={i} className="flex gap-4 relative">
                                <div className="flex flex-col items-center">
                                    <div className="w-3 h-3 rounded-full bg-indigo-500 ring-4 ring-indigo-500/20 z-10"></div>
                                    {i < fundingTimeline.length - 1 && <div className="w-px h-full bg-zinc-800 absolute top-3"></div>}
                                </div>
                                <div className="pb-8">
                                    <p className="text-xs text-zinc-500">{round.year}</p>
                                    <p className="font-semibold text-sm">{round.event} — <span className="text-emerald-400">{round.amount}</span></p>
                                    <p className="text-xs text-zinc-500 mt-1">{round.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Pain Topics */}
                <div className="bg-zinc-900/80 backdrop-blur border border-white/[0.06] rounded-2xl p-6">
                    <h3 className="font-semibold mb-6 flex items-center gap-2">
                        <Cpu className="w-4 h-4 text-rose-400" /> Detected Pain Topics (NLP)
                    </h3>
                    <div className="space-y-4">
                        {painTopics.map((topic) => (
                            <div key={topic.topic} className="space-y-1.5">
                                <div className="flex justify-between text-sm">
                                    <span className="text-zinc-300">{topic.topic}</span>
                                    <span className="text-xs font-mono text-zinc-500">{(topic.score * 100).toFixed(0)}%</span>
                                </div>
                                <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${topic.score * 100}%` }}
                                        transition={{ duration: 1, delay: 0.3 }}
                                        className="h-full bg-gradient-to-r from-rose-500 to-pink-500 rounded-full"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Outreach Angles */}
            <div className="bg-zinc-900/80 backdrop-blur border border-white/[0.06] rounded-2xl p-6">
                <h3 className="font-semibold mb-6 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-indigo-400" /> AI-Generated Outreach Angles
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {outreachAngles.map((angle, i) => (
                        <motion.div
                            key={i}
                            whileHover={{ y: -4, borderColor: "rgba(99,102,241,0.3)" }}
                            className="bg-zinc-950/60 border border-white/[0.04] rounded-xl p-5 space-y-3 transition-all cursor-pointer"
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">{angle.angle}</span>
                                <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 text-zinc-500">{angle.signal}</span>
                            </div>
                            <p className="text-sm font-semibold text-white leading-tight">{angle.subject}</p>
                            <p className="text-xs text-zinc-500 leading-relaxed">{angle.preview}</p>
                            <button className="w-full mt-2 py-2 bg-indigo-600/10 hover:bg-indigo-600/20 border border-indigo-500/20 rounded-lg text-xs font-semibold text-indigo-400 transition-colors flex items-center justify-center gap-1.5">
                                <Mail className="w-3 h-3" /> Use This Angle
                            </button>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.div>
    )
}
