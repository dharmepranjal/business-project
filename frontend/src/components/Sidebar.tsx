"use client"

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, BarChart3, Bell, Settings, Zap, BookOpen, Menu, X } from "lucide-react";

export default function Sidebar() {
    const [open, setOpen] = useState(false);
    const pathname = usePathname();

    // Close sidebar on route change (mobile)
    useEffect(() => {
        setOpen(false);
    }, [pathname]);

    // Close on escape
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, []);

    return (
        <>
            {/* Mobile Header Bar */}
            <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-brand-bg/95 backdrop-blur-md border-b border-brand-border px-4 py-3 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2.5">
                    <div className="w-8 h-8 bg-brand-accent rounded-lg flex items-center justify-center font-bold text-sm text-brand-bg italic shadow-[0_0_15px_rgba(232,185,49,0.1)]">SR</div>
                    <span className="font-semibold tracking-tight text-lg text-white">SignalRank</span>
                </Link>
                <button
                    onClick={() => setOpen(!open)}
                    className="p-2 rounded-lg border border-brand-border bg-brand-card text-brand-muted hover:text-white hover:border-brand-accent/30 transition-all"
                    aria-label="Toggle menu"
                >
                    {open ? <X size={20} /> : <Menu size={20} />}
                </button>
            </div>

            {/* Mobile Overlay */}
            {open && (
                <div
                    className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
                    onClick={() => setOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed md:sticky top-0 left-0 z-50 md:z-auto
                w-64 border-r border-brand-border h-screen flex flex-col p-6 space-y-12 bg-brand-bg select-none
                transition-transform duration-300 ease-out
                ${open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            `}>
                <div className="flex items-center gap-3 px-2">
                    <Link href="/" className="flex items-center gap-3 group" onClick={() => setOpen(false)}>
                        <div className="w-9 h-9 bg-brand-accent rounded-xl flex items-center justify-center font-bold text-brand-bg italic group-hover:scale-105 transition-all shadow-[0_0_20px_rgba(232,185,49,0.1)]">SR</div>
                        <span className="font-semibold tracking-tight text-xl text-white group-hover:text-brand-accent transition-colors">SignalRank</span>
                    </Link>
                </div>

                <div className="flex-1 space-y-10 overflow-y-auto custom-scrollbar">
                    <nav className="space-y-1.5">
                        <p className="px-4 text-[10px] font-bold uppercase tracking-[0.2em] text-brand-dim mb-4">Getting Started</p>
                        <NavItem href="/about" icon={<BookOpen size={18} />} label="Terminal Guide" />
                    </nav>

                    <nav className="space-y-1.5">
                        <p className="px-4 text-[10px] font-bold uppercase tracking-[0.2em] text-brand-dim mb-4">Core Infrastructure</p>
                        <NavItem href="/dashboard" icon={<LayoutDashboard size={18} />} label="Dashboard" />
                        <NavItem href="/accounts" icon={<Users size={18} />} label="Accounts" />
                        <NavItem href="/analytics" icon={<BarChart3 size={18} />} label="Analytics" />
                        <NavItem href="/alerts" icon={<Bell size={18} />} label="Alerts" />
                    </nav>

                    <nav className="space-y-1.5">
                        <p className="px-4 text-[10px] font-bold uppercase tracking-[0.2em] text-brand-dim mb-4">Integrations</p>
                        <NavItem href="/integrations" icon={<Zap size={18} />} label="Nodes" />
                        <NavItem href="/settings" icon={<Settings size={18} />} label="Terminal" />
                    </nav>
                </div>

                <div className="mt-auto p-5 bg-brand-surface rounded-2xl border border-brand-border shadow-sm accent-line-top">
                    <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-brand-dim mb-3">Network Status</p>
                    <div className="flex items-center gap-2.5">
                        <div className="w-2 h-2 rounded-full bg-brand-success shadow-[0_0_10px_rgba(16,185,129,0.4)] animate-pulse" />
                        <span className="text-xs font-semibold text-brand-text">Systems Nominal</span>
                    </div>
                </div>
            </aside>
        </>
    );
}

function NavItem({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
    const pathname = usePathname();
    const active = pathname === href || (href !== "/" && pathname.startsWith(href));

    return (
        <Link
            href={href}
            className={`flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-[13px] font-semibold transition-all duration-300 group ${active
                ? "bg-brand-accent/5 text-brand-accent border border-brand-accent/10 shadow-[0_0_20px_rgba(232,185,49,0.03)]"
                : "text-brand-muted hover:text-white hover:bg-white/[0.02] border border-transparent"
                }`}
        >
            <span className={`transition-colors duration-300 ${active ? "text-brand-accent" : "text-brand-muted group-hover:text-brand-accent/70"}`}>
                {icon}
            </span>
            {label}
        </Link>
    );
}
