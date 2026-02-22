"use client"

import { motion } from "framer-motion"
import { Shield, Target, Zap, BarChart3, Search, Database, ArrowRight, CheckCircle2, Award } from "lucide-react"

export default function AboutPage() {
    const parameters = [
        { name: "Company Size Fit", desc: "Compares target employee count to your ideal service capacity." },
        { name: "Revenue Match", desc: "Estimates purchasing power based on estimated annual revenue brackets." },
        { name: "Tech Stack Overlap", desc: "Analyzes digital infrastructure to ensure architectural compatibility." },
        { name: "Growth Stage", desc: "Matches Series A-E or Public status to your product's lifecycle utility." },
        { name: "Regional alignment", desc: "Calculates geographic distance and operational timezone overlap." },
        { name: "Hiring Momentum", desc: "Signals immediate need based on active engineering and sales expansion." },
        { name: "Industry Depth", desc: "Deep-dives into sub-industries for high-relevance vertical matching." },
    ]

    return (
        <div className="min-h-screen bg-black text-white selection:bg-indigo-500/30">
            <div className="max-w-[1200px] mx-auto p-6 md:p-12 space-y-24">

                {/* Hero */}
                <section className="text-center py-20 space-y-8">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-widest"
                    >
                        <Award className="w-3.5 h-3.5" /> Business Analytics & Data Systems
                    </motion.div>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tight tracking-tighter">
                        Sales Intelligence <br /> <span className="text-indigo-500">Simplified.</span>
                    </h1>
                    <p className="text-xl text-zinc-500 max-w-2xl mx-auto leading-relaxed">
                        LeadLens is an analytical lead-matching engine built to automate the tedious process of prospecting. We use multi-parameter weighted scoring to find your 1 in 1,000.
                    </p>
                </section>

                {/* Scoring Logic */}
                <section className="bg-zinc-900/40 border border-white/[0.06] rounded-[48px] p-8 md:p-16 space-y-16">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-8">
                            <h2 className="text-3xl font-bold">The 7-Dimension <br /> Weighted Engine</h2>
                            <p className="text-zinc-500 text-sm leading-relaxed">
                                Unlike basic filters that provide binary results, LeadLens calculates a composite probability. Every lead is scored against seven distinct business dimensions, each of which can be weighted by the user based on their specific priorities.
                            </p>
                            <div className="space-y-4">
                                {parameters.map((p, i) => (
                                    <div key={i} className="flex gap-4">
                                        <div className="mt-1"><CheckCircle2 className="w-5 h-5 text-indigo-500" /></div>
                                        <div>
                                            <p className="text-sm font-bold text-white">{p.name}</p>
                                            <p className="text-xs text-zinc-500">{p.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="relative aspect-square bg-gradient-to-br from-indigo-600/10 to-transparent rounded-[32px] border border-white/5 flex items-center justify-center overflow-hidden">
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                            <div className="text-center space-y-2 relative z-10">
                                <Search className="w-20 h-20 text-indigo-500 mx-auto opacity-40 mb-4" />
                                <p className="text-5xl font-black italic">SCORE: 94</p>
                                <p className="text-[10px] uppercase font-bold tracking-widest text-zinc-500">Analytical Lead Rank</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer CTA */}
                <section className="text-center space-y-8 py-12">
                    <h2 className="text-3xl font-bold">Ready to find your next enterprise client?</h2>
                    <a href="/" className="inline-flex items-center gap-2 px-10 py-5 bg-white text-black rounded-2xl font-black hover:bg-zinc-200 transition-all active:scale-95 group">
                        Get Started Now <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </a>
                </section>
            </div>
        </div>
    )
}
