"use client"

import { Zap, Shield, Key, Link2, MessageSquare, Database, ExternalLink, CheckCircle2 } from "lucide-react"

export default function IntegrationsPage() {
    return (
        <div className="p-10 space-y-12 max-w-[1600px] mx-auto">
            <div className="space-y-1">
                <p className="text-[11px] font-medium tracking-wide text-brand-accent/80 uppercase">Workflow Embedding</p>
                <h1 className="text-3xl font-semibold tracking-tight text-white">Infrastructure Nodes</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                <IntegrationCard
                    name="Salesforce"
                    desc="Push Buying Window Scores directly to Account & Lead objects. Enable priority routing."
                    status="Connected"
                    icon={<Database size={24} />}
                />
                <IntegrationCard
                    name="HubSpot"
                    desc="Auto-create deals when Buying Window Score exceeds 85. Sync trigger history to timeline."
                    status="Available"
                    icon={<Database size={24} />}
                />
                <IntegrationCard
                    name="Slack"
                    desc="Real-time alerts for hiring spikes and executive changes in your target territories."
                    status="Connected"
                    icon={<MessageSquare size={24} />}
                />
                <IntegrationCard
                    name="REST API"
                    desc="Access raw signal data and buying window scores via high-concurrency API nodes."
                    status="Active"
                    icon={<Zap size={24} />}
                />
                <IntegrationCard
                    name="Webhooks"
                    desc="Subscribe to specific trigger events. Payload includes company intel and score impact."
                    status="Available"
                    icon={<Link2 size={24} />}
                />

                <div className="bg-brand-accent/[0.03] border border-brand-accent/20 rounded-2xl p-8 flex flex-col items-center justify-center text-center space-y-5 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-brand-accent/[0.02] animate-pulse" />
                    <div className="w-16 h-16 rounded-full bg-brand-accent/10 flex items-center justify-center text-brand-accent relative z-10">
                        <Zap size={32} />
                    </div>
                    <div className="space-y-2 relative z-10">
                        <h3 className="text-lg font-semibold text-white">Request custom node</h3>
                        <p className="text-sm text-brand-muted max-w-[240px] mx-auto">Need a specialized integration for your revenue infrastructure?</p>
                    </div>
                    <button className="px-8 py-3 bg-brand-accent text-brand-bg rounded-xl text-[11px] font-bold uppercase tracking-widest relative z-10 transition-all hover:bg-white active:scale-95 shadow-lg shadow-brand-accent/10">
                        Open request
                    </button>
                </div>
            </div>

            <section className="bg-brand-card border border-brand-border rounded-2xl p-10 space-y-8 max-w-4xl shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="p-2.5 rounded-lg bg-brand-surface border border-brand-border text-brand-accent">
                        <Key size={20} />
                    </div>
                    <h2 className="text-xl font-semibold tracking-tight text-white">Access infrastructure keys</h2>
                </div>

                <div className="space-y-5">
                    <div className="flex items-center justify-between p-5 bg-brand-bg border border-brand-border rounded-xl font-mono text-xs shadow-inner group">
                        <span className="text-brand-dim font-medium">SECRET_KEY_PROD</span>
                        <span className="text-brand-text/50 tracking-widest text-[10px]">••••••••••••••••••••••••••••••••</span>
                        <button className="text-[11px] font-bold uppercase tracking-widest text-brand-accent transition-colors hover:text-white">Reveal</button>
                    </div>
                    <p className="text-[10px] font-semibold text-brand-dim uppercase tracking-widest flex items-center gap-2">
                        <Shield size={12} className="text-brand-accent" /> Use server-side proxying only
                    </p>
                </div>
            </section>
        </div>
    )
}

function IntegrationCard({ name, desc, status, icon }: { name: string, desc: string, status: string, icon: React.ReactNode }) {
    const isLive = status === 'Connected' || status === 'Active'

    return (
        <div className="bg-brand-card border border-brand-border rounded-2xl p-8 space-y-8 group hover:border-brand-accent/20 hover:bg-white/[0.01] transition-all cursor-pointer shadow-sm relative overflow-hidden">
            <div className="flex justify-between items-start">
                <div className="w-12 h-12 rounded-xl bg-brand-surface border border-brand-border flex items-center justify-center text-brand-muted group-hover:text-brand-accent group-hover:bg-brand-accent/5 transition-all">
                    {icon}
                </div>
                <div className={`px-2.5 py-1 rounded-full border text-[9px] font-bold uppercase tracking-wider ${isLive
                        ? 'border-brand-success/30 bg-brand-success/5 text-brand-success shadow-[0_0_15px_rgba(16,185,129,0.05)]'
                        : 'border-brand-border bg-brand-bg text-brand-dim'
                    }`}>
                    {status}
                </div>
            </div>

            <div className="space-y-3">
                <h3 className="text-xl font-semibold text-white group-hover:text-brand-accent transition-colors">{name}</h3>
                <p className="text-sm text-brand-muted leading-relaxed font-medium">{desc}</p>
            </div>

            <button className={`w-full py-4 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all ${isLive
                    ? 'bg-brand-surface border border-brand-border text-brand-text hover:bg-brand-accent hover:text-brand-bg hover:border-brand-accent'
                    : 'bg-brand-bg border border-brand-border text-brand-dim hover:border-brand-accent/30 hover:text-brand-accent'
                }`}>
                {isLive ? 'Manage node' : 'Setup connection'}
            </button>
        </div>
    )
}
