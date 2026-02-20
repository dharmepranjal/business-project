"use client"

import { motion } from "framer-motion"
import { TrendingUp, Users, DollarSign, Target, ArrowUpRight, Zap, BarChart3 } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, CartesianGrid } from "recharts"

const pipelineData = [
  { name: "SaaS", T1: 18, T2: 32, T3: 12 },
  { name: "FinTech", T1: 12, T2: 24, T3: 8 },
  { name: "HealthTech", T1: 8, T2: 16, T3: 6 },
  { name: "DevTools", T1: 14, T2: 20, T3: 10 },
  { name: "AI/ML", T1: 10, T2: 18, T3: 5 },
  { name: "Cyber", T1: 6, T2: 14, T3: 4 },
]

const signalActivity = [
  { day: "Mon", hiring: 12, funding: 4, pain: 8 },
  { day: "Tue", hiring: 18, funding: 6, pain: 12 },
  { day: "Wed", hiring: 14, funding: 3, pain: 15 },
  { day: "Thu", hiring: 22, funding: 8, pain: 10 },
  { day: "Fri", hiring: 28, funding: 12, pain: 18 },
  { day: "Sat", hiring: 16, funding: 5, pain: 9 },
  { day: "Sun", hiring: 10, funding: 2, pain: 6 },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
}
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
}

export default function Dashboard() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="p-6 md:p-8 space-y-8 max-w-[1400px] mx-auto"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
            Revenue Dashboard
          </h1>
          <p className="text-zinc-500 mt-1 text-sm">Real-time account intelligence and buying probability.</p>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 flex items-center gap-2 active:scale-95">
          <Zap className="w-4 h-4" /> Recalculate Scores
        </button>
      </motion.div>

      {/* KPI Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <KpiCard title="Total Accounts" value="1,284" change="+12.5%" icon={<Users className="w-5 h-5" />} gradient="from-indigo-600 to-violet-600" />
        <KpiCard title="Tier-1 High Priority" value="84" change="+4.2%" icon={<Target className="w-5 h-5" />} gradient="from-emerald-600 to-teal-600" />
        <KpiCard title="Revenue Potential" value="$12.4M" change="+18.1%" icon={<DollarSign className="w-5 h-5" />} gradient="from-amber-600 to-orange-600" />
        <KpiCard title="Avg Buy Probability" value="64%" change="+2.4%" icon={<TrendingUp className="w-5 h-5" />} gradient="from-blue-600 to-cyan-600" />
      </motion.div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Signal Activity Chart */}
        <motion.div variants={itemVariants} className="lg:col-span-3 bg-zinc-900/80 backdrop-blur border border-white/[0.06] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-base">Signal Activity</h3>
            <div className="flex items-center gap-4 text-[11px] text-zinc-500">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-indigo-500"></span>Hiring</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500"></span>Funding</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500"></span>Pain</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={signalActivity}>
              <defs>
                <linearGradient id="hiringGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="fundingGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis dataKey="day" stroke="#52525b" fontSize={11} />
              <YAxis stroke="#52525b" fontSize={11} />
              <Tooltip
                contentStyle={{ background: "#18181b", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "12px", fontSize: "12px" }}
                itemStyle={{ color: "#fafafa" }}
              />
              <Area type="monotone" dataKey="hiring" stroke="#6366f1" fill="url(#hiringGrad)" strokeWidth={2} />
              <Area type="monotone" dataKey="funding" stroke="#10b981" fill="url(#fundingGrad)" strokeWidth={2} />
              <Area type="monotone" dataKey="pain" stroke="#f59e0b" fill="none" strokeWidth={2} strokeDasharray="4 4" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Pipeline Distribution */}
        <motion.div variants={itemVariants} className="lg:col-span-2 bg-zinc-900/80 backdrop-blur border border-white/[0.06] rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="w-4 h-4 text-indigo-400" />
            <h3 className="font-semibold text-base">Pipeline by Industry</h3>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={pipelineData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" horizontal={false} />
              <XAxis type="number" stroke="#52525b" fontSize={10} />
              <YAxis dataKey="name" type="category" stroke="#52525b" fontSize={10} width={65} />
              <Tooltip
                contentStyle={{ background: "#18181b", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "12px", fontSize: "12px" }}
              />
              <Bar dataKey="T1" stackId="a" fill="#6366f1" radius={[0, 0, 0, 0]} />
              <Bar dataKey="T2" stackId="a" fill="#3b82f6" />
              <Bar dataKey="T3" stackId="a" fill="#1e293b" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Recent High-Signal Accounts */}
      <motion.div variants={itemVariants} className="bg-zinc-900/80 backdrop-blur border border-white/[0.06] rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-base">Top Scoring Accounts</h3>
          <a href="/accounts" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors font-medium">View all →</a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            { name: "Acme Corp", industry: "SaaS", score: 92, prob: 88, signal: "Hiring Spike", tier: "T1" },
            { name: "GlobalTech Systems", industry: "FinTech", score: 89, prob: 84, signal: "New CTO", tier: "T1" },
            { name: "CloudScale Inc", industry: "Infrastructure", score: 87, prob: 81, signal: "Series B", tier: "T1" },
            { name: "NovaHealth AI", industry: "HealthTech", score: 85, prob: 79, signal: "Tech Shift", tier: "T1" },
            { name: "DataFlow Labs", industry: "DevTools", score: 82, prob: 76, signal: "Expansion", tier: "T1" },
          ].map((acc) => (
            <motion.div
              key={acc.name}
              whileHover={{ y: -4, borderColor: "rgba(99,102,241,0.3)" }}
              className="bg-zinc-950/50 border border-white/[0.04] rounded-xl p-4 cursor-pointer transition-all"
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-[10px] font-bold">
                  {acc.name.charAt(0)}
                </div>
                <div>
                  <p className="text-xs font-semibold truncate">{acc.name}</p>
                  <p className="text-[10px] text-zinc-500">{acc.industry}</p>
                </div>
              </div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-zinc-500">Score</span>
                <span className="text-sm font-bold text-white">{acc.score}</span>
              </div>
              <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden mb-3">
                <div className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full" style={{ width: `${acc.score}%` }}></div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  {acc.signal}
                </span>
                <span className="text-[10px] text-emerald-500 font-mono">{acc.prob}%</span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}

function KpiCard({ title, value, change, icon, gradient }: any) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="relative bg-zinc-900/80 backdrop-blur border border-white/[0.06] rounded-2xl p-5 overflow-hidden group transition-all hover:border-white/[0.12]"
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br opacity-[0.04] group-hover:opacity-[0.08] transition-opacity rounded-bl-full ${gradient}" />
      <div className="flex items-center justify-between mb-3">
        <div className={`p-2 rounded-xl bg-gradient-to-br ${gradient} shadow-lg`}>
          {icon}
        </div>
        <span className="text-[11px] font-semibold text-emerald-400 flex items-center bg-emerald-500/10 px-2 py-0.5 rounded-full">
          {change} <ArrowUpRight className="w-3 h-3 ml-0.5" />
        </span>
      </div>
      <p className="text-xs text-zinc-500 font-medium">{title}</p>
      <h2 className="text-2xl font-bold mt-1 tracking-tight">{value}</h2>
    </motion.div>
  )
}
