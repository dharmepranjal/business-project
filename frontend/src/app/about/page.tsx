"use client"

import { motion } from "framer-motion"
import {
    LayoutDashboard,
    Users,
    BarChart3,
    Bell,
    Zap,
    Settings,
    ArrowRight,
    Info,
    CheckCircle2
} from "lucide-react"
import Link from "next/link"

export default function AboutPage() {
    return (
        <div className="p-10 pb-32 space-y-16 max-w-[1200px] mx-auto">
            {/* Header */}
            <div className="space-y-4 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-accent/5 border border-brand-accent/10 text-brand-accent text-[11px] font-bold uppercase tracking-wider">
                    <Info size={14} /> System Manual v1.0
                </div>
                <h1 className="text-4xl font-semibold tracking-tight text-white">How to use SignalRank</h1>
                <p className="text-lg text-brand-muted leading-relaxed font-medium">
                    SignalRank is a precision instrument for revenue teams. Follow this step-by-step terminal guide to master the infrastructure and identify your next high-intent accounts.
                </p>
            </div>

            {/* Tutorial Steps */}
            <div className="grid grid-cols-1 gap-12">
                <TutorialStep
                    number="01"
                    title="Monitor the Command Center"
                    icon={<LayoutDashboard className="text-brand-accent" />}
                    desc="Start your day here. The Dashboard gives you a bird's-eye view of your total pipeline and high-priority accounts. Look for the 'Accounts to contact this week' list—these are the companies with the highest buying velocity happening right now."
                    link="/dashboard"
                    linkLabel="Open Command Center"
                />

                <TutorialStep
                    number="02"
                    title="Browse the Account Universe"
                    icon={<Users className="text-brand-accent" />}
                    desc="Navigate to the Accounts page to see your entire territory. Use the 'Window Score' column to sort accounts. Any account with a score above 75 is in an active buying cycle. Expand any row to see the live trigger logs behind that score."
                    link="/accounts"
                    linkLabel="Explore Accounts"
                />

                <TutorialStep
                    number="03"
                    title="Deep-Dive into Intelligence"
                    icon={<CheckCircle2 className="text-brand-accent" />}
                    desc="Click on any specific account to open their Intelligence Report. Here you can see the 'Buying Window Score' gauge, which measures the heat of the account. Review the Signal Timeline to understand EXACTLY why the window is open (e.g., a recent CTO change combined with a hiring spike)."
                    link="/accounts"
                    linkLabel="View Sample Account"
                />

                <TutorialStep
                    number="04"
                    title="Track Real-time Alerts"
                    icon={<Bell className="text-brand-accent" />}
                    desc="The Alerts feed is your live stream of truth. As companies across the globe hire, shift leadership, or update their tech stacks, you'll see it here first. Filter by 'Hiring Spike' or 'Exec Change' to find the signals that match your specific product strength."
                    link="/alerts"
                    linkLabel="Check Live Alerts"
                />

                <TutorialStep
                    number="05"
                    title="Analyze Market Dynamics"
                    icon={<BarChart3 className="text-brand-accent" />}
                    desc="Use the Analytics page to see which industries are currently most active in your territory. This helps you pivot your messaging—if 'FinTech' is showing 3x more signals than 'Logistics', you know where to deploy your marketing resources for the highest ROI."
                    link="/analytics"
                    linkLabel="View Market Analytics"
                />

                <TutorialStep
                    number="06"
                    title="Wire Infrastructure Nodes"
                    icon={<Zap className="text-brand-accent" />}
                    desc="Finally, ensure SignalRank is connected to your existing stack. Go to Integrations to connect Salesforce or HubSpot. This allows the system to push high-scoring accounts directly into your CRM, so your sales team never misses a window."
                    link="/integrations"
                    linkLabel="Setup Integrations"
                />
            </div>

            {/* Final CTA */}
            <div className="bg-brand-surface border border-brand-border rounded-2xl p-12 text-center space-y-6 accent-line-top shadow-sm">
                <h2 className="text-2xl font-semibold text-white">System ready for deployment.</h2>
                <p className="text-brand-muted max-w-lg mx-auto font-medium">
                    You are now equipped to navigate the territory. Return to this guide anytime you need a refresher on the terminal's capabilities.
                </p>
                <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-brand-accent text-brand-bg rounded-xl font-bold hover:bg-white transition-all shadow-lg shadow-brand-accent/10 active:scale-95"
                >
                    Initialize Terminal <ArrowRight size={18} />
                </Link>
            </div>
        </div>
    )
}

function TutorialStep({ number, title, icon, desc, link, linkLabel }: { number: string, title: string, icon: React.ReactNode, desc: string, link: string, linkLabel: string }) {
    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="group relative grid grid-cols-1 md:grid-cols-[100px_1fr] gap-8 p-8 bg-brand-card border border-brand-border rounded-2xl hover:border-brand-accent/20 transition-all shadow-sm"
        >
            <div className="flex flex-col items-center gap-4">
                <span className="text-3xl font-bold mono-nums text-brand-dim group-hover:text-brand-accent/40 transition-colors">{number}</span>
                <div className="w-12 h-12 rounded-xl bg-brand-surface border border-brand-border flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                    {icon}
                </div>
            </div>

            <div className="space-y-6">
                <div className="space-y-3">
                    <h3 className="text-2xl font-semibold text-white tracking-tight">{title}</h3>
                    <p className="text-brand-muted leading-relaxed font-medium max-w-3xl">
                        {desc}
                    </p>
                </div>

                <Link
                    href={link}
                    className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-accent hover:text-white transition-colors group/link"
                >
                    {linkLabel} <ArrowRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
                </Link>
            </div>
        </motion.div>
    )
}
