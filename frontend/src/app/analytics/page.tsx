"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line,
    AreaChart,
    Area
} from "recharts"
import { TrendingUp, DollarSign, Target, Zap, BarChart3, PieChart as PieChartIcon } from "lucide-react"
import { Company } from "@/lib/types"
import companiesData from "@/data/companies.json"
import { formatINR } from "@/lib/utils"

export default function AnalyticsPage() {
    const [data, setData] = useState<Company[]>([])

    useEffect(() => {
        setData(companiesData as Company[])
    }, [])

    const totalPipeline = data.reduce((acc, c) => acc + c.expectedRevenueValue, 0)

    const industryData = [
        { name: 'FinTech', value: data.filter(c => c.industry === 'FinTech').length },
        { name: 'SaaS', value: data.filter(c => c.industry === 'SaaS').length },
        { name: 'CyberSec', value: data.filter(c => c.industry === 'CyberSecurity').length },
        { name: 'AI/ML', value: data.filter(c => c.industry === 'AI/ML').length },
        { name: 'Logistics', value: data.filter(c => c.industry === 'Logistics').length },
    ]

    const triggerData = [
        { type: 'Hiring Spike', conv: 29, color: '#E8B931' },
        { type: 'Exec Change', conv: 34, color: '#E8B931' },
        { type: 'Funding', conv: 12, color: '#3B3F4A' },
        { type: 'Tech Stack', conv: 19, color: '#E8B931' },
        { type: 'JD Match', conv: 25, color: '#E8B931' },
    ]

    const revenueProjection = [
        { week: 'W1', value: 45 },
        { week: 'W2', value: 52 },
        { week: 'W3', value: 48 },
        { week: 'W4', value: 61 },
        { week: 'W5', value: 55 },
        { week: 'W6', value: 67 },
        { week: 'W7', value: 82 },
    ]

    const COLORS = ['#E8B931', '#94A3B8', '#3B3F4A', '#1A1B22', '#13141A'];

    return (
        <div className="p-4 md:p-10 space-y-8 md:space-y-12 max-w-[1600px] mx-auto">
            <div className="space-y-1">
                <p className="text-[11px] font-medium tracking-wide text-brand-accent/80 uppercase">Picket Intelligence</p>
                <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-white">Market Intelligence</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">

                {/* Conversion by Trigger */}
                <section className="bg-brand-card border border-brand-border rounded-2xl p-8 space-y-8 lg:col-span-2 shadow-sm accent-line-top">
                    <div className="flex justify-between items-center">
                        <div className="space-y-1.5">
                            <h2 className="text-xl font-semibold tracking-tight text-white">Meeting rate by trigger type</h2>
                            <p className="text-[10px] font-semibold uppercase tracking-widest text-brand-dim">Conversion probability analysis</p>
                        </div>
                        <div className="p-2.5 rounded-lg bg-brand-surface border border-brand-border text-brand-accent">
                            <BarChart3 size={20} />
                        </div>
                    </div>

                    <div className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={triggerData} layout="vertical" margin={{ left: 40 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.05)" horizontal={false} />
                                <XAxis type="number" hide />
                                <YAxis dataKey="type" type="category" stroke="#3B3F4A" fontSize={11} fontWeight={500} axisLine={false} tickLine={false} />
                                <Tooltip
                                    cursor={{ fill: 'rgba(255,255,255,0.01)' }}
                                    contentStyle={{ background: '#13141A', border: '1px solid rgba(148, 163, 184, 0.1)', borderRadius: '12px', color: '#D4D4DC' }}
                                />
                                <Bar dataKey="conv" fill="#E8B931" radius={[0, 4, 4, 0]} barSize={24}>
                                    {triggerData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.8} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </section>

                {/* Revenue Impact Model */}
                <section className="bg-brand-card border border-brand-border rounded-2xl p-8 space-y-8 shadow-sm">
                    <div className="flex justify-between items-center">
                        <div className="space-y-1.5">
                            <h2 className="text-xl font-semibold tracking-tight text-white">Revenue model</h2>
                            <p className="text-[10px] font-semibold uppercase tracking-widest text-brand-dim">Expected pipeline distribution</p>
                        </div>
                        <div className="p-2.5 rounded-lg bg-brand-surface border border-brand-border text-brand-accent">
                            <DollarSign size={20} />
                        </div>
                    </div>

                    <div className="h-[350px] flex items-center justify-center relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={industryData}
                                    innerRadius={75}
                                    outerRadius={100}
                                    paddingAngle={8}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {industryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} fillOpacity={0.8} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none p-4">
                            <span className="text-2xl md:text-3xl lg:text-4xl font-semibold tracking-tighter text-white mono-nums text-center">
                                {formatINR(totalPipeline)}
                            </span>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-brand-dim">Pipeline</span>
                        </div>
                    </div>
                </section>

                {/* Forecast Modeling */}
                <section className="bg-brand-card border border-brand-border rounded-2xl p-8 space-y-8 lg:col-span-3 shadow-sm">
                    <div className="flex justify-between items-center">
                        <div className="space-y-1.5">
                            <h2 className="text-xl font-semibold tracking-tight text-white">Pipeline velocity modeling</h2>
                            <p className="text-[10px] font-semibold uppercase tracking-widest text-brand-dim">Next Phase Growth Projection</p>
                        </div>
                        <div className="p-2.5 rounded-lg bg-brand-surface border border-brand-border text-brand-accent">
                            <TrendingUp size={20} />
                        </div>
                    </div>

                    <div className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={revenueProjection}>
                                <defs>
                                    <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#E8B931" stopOpacity={0.15} />
                                        <stop offset="95%" stopColor="#E8B931" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.05)" vertical={false} />
                                <XAxis dataKey="week" stroke="#3B3F4A" fontSize={11} fontWeight={500} axisLine={false} tickLine={false} />
                                <YAxis stroke="#3B3F4A" fontSize={11} fontWeight={500} axisLine={false} tickLine={false} />
                                <Tooltip
                                    contentStyle={{ background: '#13141A', border: '1px solid rgba(148, 163, 184, 0.1)', borderRadius: '12px', color: '#D4D4DC' }}
                                />
                                <Area type="monotone" dataKey="value" stroke="#E8B931" strokeWidth={3} fillOpacity={1} fill="url(#colorVal)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </section>

            </div>
        </div>
    )
}
