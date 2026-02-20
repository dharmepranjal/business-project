"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Sliders, RefreshCcw, Save, Play, Info, BarChart3, Download, Loader2, CheckCircle } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts"

const simulationBefore = [
    { name: "Acme Corp", before: 92 },
    { name: "GlobalTech", before: 89 },
    { name: "CloudScale", before: 87 },
    { name: "NovaHealth", before: 85 },
    { name: "DataFlow", before: 82 },
    { name: "SecureVault", before: 78 },
]

export default function ControlPanel() {
    const [weights, setWeights] = useState({ icp: 25, hiring: 20, funding: 15, pain: 25, timing: 15 })
    const [mode, setMode] = useState("weighted")
    const [capacity, setCapacity] = useState(50)
    const [simulating, setSimulating] = useState(false)
    const [simulated, setSimulated] = useState(false)
    const [saving, setSaving] = useState(false)

    const total = weights.icp + weights.hiring + weights.funding + weights.pain + weights.timing

    const handleWeightChange = (key: string, value: number) => {
        setWeights((prev) => ({ ...prev, [key]: value }))
        setSimulated(false)
    }

    const runSimulation = () => {
        setSimulating(true)
        setTimeout(() => { setSimulating(false); setSimulated(true) }, 1500)
    }

    const saveWeights = () => {
        setSaving(true)
        setTimeout(() => setSaving(false), 1000)
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-6 md:p-8 space-y-8 max-w-5xl mx-auto"
        >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">Model Control Center</h1>
                    <p className="text-zinc-500 mt-1 text-sm">Fine-tune scoring weights, select models, and run simulations.</p>
                </div>
                <button
                    onClick={saveWeights}
                    disabled={saving}
                    className="bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2 active:scale-95"
                >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {saving ? "Saving..." : "Save & Apply"}
                </button>
            </div>

            {/* Signal Weights */}
            <div className="bg-zinc-900/80 backdrop-blur border border-white/[0.06] rounded-2xl p-6 md:p-8 space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-indigo-400">
                        <Sliders className="w-5 h-5" />
                        <h2 className="font-semibold text-lg">Signal Weight Configuration</h2>
                    </div>
                    <span className={`text-xs font-mono px-2 py-1 rounded-md ${total === 100 ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"}`}>
                        Σ = {total}%
                    </span>
                </div>

                <div className="space-y-5">
                    <WeightSlider label="ICP Alignment" value={weights.icp} color="from-indigo-500 to-indigo-600" onChange={(v: number) => handleWeightChange("icp", v)} />
                    <WeightSlider label="Hiring Growth" value={weights.hiring} color="from-blue-500 to-blue-600" onChange={(v: number) => handleWeightChange("hiring", v)} />
                    <WeightSlider label="Funding Recency" value={weights.funding} color="from-emerald-500 to-emerald-600" onChange={(v: number) => handleWeightChange("funding", v)} />
                    <WeightSlider label="Pain Point Match" value={weights.pain} color="from-amber-500 to-amber-600" onChange={(v: number) => handleWeightChange("pain", v)} />
                    <WeightSlider label="Executive Timing" value={weights.timing} color="from-rose-500 to-rose-600" onChange={(v: number) => handleWeightChange("timing", v)} />
                </div>

                {total !== 100 && (
                    <div className="p-3 bg-amber-500/5 border border-amber-500/10 rounded-xl flex gap-3">
                        <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <p className="text-xs text-amber-300/80 leading-relaxed">
                            Weights should sum to 100% for balanced scoring. Current total: <span className="font-bold">{total}%</span>. Adjust the sliders above.
                        </p>
                    </div>
                )}
            </div>

            {/* Mode + Optimization */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-zinc-900/80 backdrop-blur border border-white/[0.06] rounded-2xl p-6 space-y-5">
                    <h3 className="font-semibold flex items-center gap-2">
                        <RefreshCcw className="w-4 h-4 text-emerald-400" /> Scoring Mode
                    </h3>
                    <div className="space-y-2">
                        {[
                            { value: "weighted", label: "Weighted Strategic", tier: "Tier 1", desc: "Transparent, configurable weights" },
                            { value: "logistic", label: "Logistic Regression", tier: "Tier 2", desc: "Requires 1,000+ CRM records" },
                            { value: "bayesian", label: "Bayesian Updating", tier: "Tier 3", desc: "Real-time adaptive probability" },
                        ].map((m) => (
                            <button
                                key={m.value}
                                onClick={() => setMode(m.value)}
                                className={`w-full text-left p-3 rounded-xl border transition-all ${mode === m.value ? "bg-indigo-600/10 border-indigo-500/30" : "bg-zinc-950/30 border-white/[0.03] hover:border-white/10"}`}
                            >
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-semibold">{m.label}</span>
                                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 text-zinc-500">{m.tier}</span>
                                </div>
                                <p className="text-[10px] text-zinc-500 mt-0.5">{m.desc}</p>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="bg-zinc-900/80 backdrop-blur border border-white/[0.06] rounded-2xl p-6 space-y-5">
                    <h3 className="font-semibold flex items-center gap-2">
                        <Play className="w-4 h-4 text-indigo-400" /> Portfolio Optimization
                    </h3>
                    <div>
                        <div className="flex items-center justify-between text-sm mb-2">
                            <span className="text-zinc-400">Sales Bench Capacity</span>
                            <span className="font-mono text-indigo-400 font-bold">{capacity} accounts</span>
                        </div>
                        <input
                            type="range"
                            className="w-full accent-indigo-500 h-1.5"
                            min="5"
                            max="200"
                            value={capacity}
                            onChange={(e) => setCapacity(parseInt(e.target.value))}
                        />
                        <div className="flex justify-between text-[9px] text-zinc-600 mt-1">
                            <span>5</span><span>200</span>
                        </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <span className="text-zinc-400">Industry Diversification</span>
                        <span className="text-[10px] px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded font-semibold">ON</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-zinc-400">Tier-1 Floor (min 20%)</span>
                        <span className="text-[10px] px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded font-semibold">ON</span>
                    </div>

                    <button
                        onClick={runSimulation}
                        disabled={simulating}
                        className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 border border-indigo-500/30 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 active:scale-[0.98] shadow-lg shadow-indigo-500/20"
                    >
                        {simulating ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Running Simulation...</> :
                            simulated ? <><CheckCircle className="w-3.5 h-3.5" /> Simulation Complete</> :
                                <><BarChart3 className="w-3.5 h-3.5" /> Run Revenue Simulation</>}
                    </button>
                </div>
            </div>

            {/* Simulation Results */}
            {simulated && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-zinc-900/80 backdrop-blur border border-white/[0.06] rounded-2xl p-6"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-semibold flex items-center gap-2">
                            <BarChart3 className="w-4 h-4 text-indigo-400" /> Simulation Results
                        </h3>
                        <button className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors">
                            <Download className="w-3 h-3" /> Export
                        </button>
                    </div>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={simulationBefore}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                            <XAxis dataKey="name" stroke="#52525b" fontSize={10} />
                            <YAxis stroke="#52525b" fontSize={10} />
                            <Tooltip contentStyle={{ background: "#18181b", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "12px", fontSize: "12px" }} />
                            <Bar dataKey="before" fill="#6366f1" radius={[6, 6, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                    <div className="mt-4 p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-xl">
                        <p className="text-xs text-emerald-300/80">
                            <span className="font-bold">Optimized portfolio:</span> {capacity} accounts selected. Expected revenue: <span className="font-bold text-emerald-400">$8.2M</span> with industry diversification applied.
                        </p>
                    </div>
                </motion.div>
            )}
        </motion.div>
    )
}

function WeightSlider({ label, value, color, onChange }: { label: string; value: number; color: string; onChange: (v: number) => void }) {
    return (
        <div className="space-y-2">
            <div className="flex justify-between items-center">
                <span className="text-sm text-zinc-300 font-medium">{label}</span>
                <span className="text-sm font-bold font-mono text-white bg-zinc-800 px-2 py-0.5 rounded">{value}%</span>
            </div>
            <div className="relative">
                <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <motion.div
                        className={`h-full bg-gradient-to-r ${color} rounded-full`}
                        animate={{ width: `${value}%` }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    />
                </div>
                <input
                    type="range"
                    className="absolute inset-0 w-full opacity-0 cursor-pointer"
                    min="0"
                    max="50"
                    value={value}
                    onChange={(e) => onChange(parseInt(e.target.value))}
                />
            </div>
        </div>
    )
}
