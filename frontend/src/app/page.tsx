"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Search, Rocket, Building2, Globe, Cpu, Users, ArrowRight, Target } from "lucide-react"
import { Industry, Region, FundingStage, UserProfile } from "@/lib/types"

const INDUSTRIES: Industry[] = ["FinTech", "SaaS", "E-commerce", "HealthTech", "DevTools", "CyberSecurity", "Infrastructure", "AI/ML", "EdTech", "Logistics"]
const REGIONS: Region[] = ["North America", "Europe", "Asia", "Global"]
const STAGES: FundingStage[] = ["Seed", "Series A", "Series B", "Series C", "Series D", "Public", "Private Late"]

export default function SetupPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile>({
    saasCategory: "",
    targetIndustries: [],
    idealSizeMin: 50,
    idealSizeMax: 1000,
    targetRevenueMin: 1,
    targetRevenueMax: 1000,
    requiredTech: [],
    targetRegions: [],
    targetStages: []
  })

  const handleToggle = (key: keyof UserProfile, value: any) => {
    setProfile(prev => {
      const current = prev[key] as any[]
      if (current.includes(value)) {
        return { ...prev, [key]: current.filter(item => item !== value) }
      }
      return { ...prev, [key]: [...current, value] }
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    localStorage.setItem("leadlens_profile", JSON.stringify(profile))
    router.push("/results")
  }

  return (
    <div className="min-h-screen bg-black text-white selection:bg-indigo-500/30">
      <div className="max-w-4xl mx-auto p-6 md:p-12 space-y-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto shadow-2xl shadow-indigo-500/20 mb-6">
            <Target className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-gradient-to-b from-white to-zinc-500 bg-clip-text text-transparent">
            Find Your Ideal Customers
          </h1>
          <p className="text-zinc-500 text-lg max-w-xl mx-auto">
            Describe your SaaS and target market. We'll rank 200+ real companies using our 7-parameter intelligence engine.
          </p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-8 bg-zinc-900/50 border border-white/[0.06] rounded-[32px] p-8 md:p-12 backdrop-blur-xl">
          {/* Section 1: Product info */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-indigo-400 font-bold uppercase tracking-widest text-xs">
              <Rocket className="w-4 h-4" /> Step 1: Your Product
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">What does your SaaS do?</label>
              <input
                required
                value={profile.saasCategory}
                onChange={e => setProfile({ ...profile, saasCategory: e.target.value })}
                placeholder="e.g. DevOps Monitoring, CRM for FinTech, Healthcare Analytics..."
                className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
              />
            </div>
          </div>

          {/* Section 2: Target Industry */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-emerald-400 font-bold uppercase tracking-widest text-xs">
              <Building2 className="w-4 h-4" /> Step 2: Ideal Segments
            </div>
            <div className="space-y-3">
              <label className="text-sm font-medium text-zinc-300">Target Industries</label>
              <div className="flex flex-wrap gap-2">
                {INDUSTRIES.map(ind => (
                  <button
                    key={ind}
                    type="button"
                    onClick={() => handleToggle("targetIndustries", ind)}
                    className={`px-4 py-2 rounded-full text-xs font-semibold transition-all border ${profile.targetIndustries.includes(ind)
                        ? "bg-indigo-600 border-indigo-500 text-white"
                        : "bg-zinc-950 border-white/10 text-zinc-500 hover:border-white/30"
                      }`}
                  >
                    {ind}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section 3: Company Specs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-amber-400 font-bold uppercase tracking-widest text-xs">
                <Users className="w-4 h-4" /> Step 3: Firmographics
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-zinc-500">
                    <span>Ideal Employee Count</span>
                    <span className="text-white font-mono">{profile.idealSizeMin} - {profile.idealSizeMax}</span>
                  </div>
                  <input
                    type="range" min="10" max="10000" step="10"
                    value={profile.idealSizeMax}
                    onChange={e => setProfile({ ...profile, idealSizeMax: parseInt(e.target.value) })}
                    className="w-full accent-indigo-500 h-1"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-2 text-rose-400 font-bold uppercase tracking-widest text-xs">
                <Globe className="w-4 h-4" /> Step 4: Geographic Reach
              </div>
              <div className="flex flex-wrap gap-2">
                {REGIONS.map(reg => (
                  <button
                    key={reg}
                    type="button"
                    onClick={() => handleToggle("targetRegions", reg)}
                    className={`px-4 py-2 rounded-full text-xs font-semibold transition-all border ${profile.targetRegions.includes(reg)
                        ? "bg-rose-600 border-rose-500 text-white"
                        : "bg-zinc-950 border-white/10 text-zinc-500 hover:border-white/30"
                      }`}
                  >
                    {reg}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section 5: Tech stack */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-purple-400 font-bold uppercase tracking-widest text-xs">
              <Cpu className="w-4 h-4" /> Step 5: Technology Requirements
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Required Tech Stack (comma separated)</label>
              <input
                value={profile.requiredTech.join(", ")}
                onChange={e => setProfile({ ...profile, requiredTech: e.target.value.split(",").map(t => t.trim()).filter(t => t !== "") })}
                placeholder="e.g. React, AWS, Kubernetes, Python..."
                className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
              />
            </div>
          </div>

          {/* Section 6: Funding Stage */}
          <div className="space-y-4">
            <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Target Funding Stages</label>
            <div className="flex flex-wrap gap-2">
              {STAGES.map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => handleToggle("targetStages", s)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all border ${profile.targetStages.includes(s)
                      ? "bg-zinc-100 text-black border-white"
                      : "bg-zinc-950 border-white/10 text-zinc-500 hover:border-white/30"
                    }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold flex items-center justify-center gap-2 group transition-all shadow-xl shadow-indigo-600/20 active:scale-95"
          >
            Analyze & Rank Leads <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>
      </div>
    </div>
  )
}
