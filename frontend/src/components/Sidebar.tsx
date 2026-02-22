"use client"

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { LayoutDashboard, Users, BarChart3, Bell, Settings, Zap, BookOpen, Menu, X, PanelLeftClose, PanelLeftOpen } from "lucide-react";

export default function Sidebar() {
    const [open, setOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
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
                    <div className="w-8 h-8 rounded-lg bg-brand-accent/10 flex items-center justify-center overflow-hidden">
                        <img src="/logo.png" alt="P" className="w-full h-full object-cover scale-150" />
                    </div>
                    <span className="font-semibold tracking-tight text-lg text-white">Picket</span>
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
                ${isCollapsed ? 'w-[72px]' : 'w-64'} border-r border-brand-border h-screen flex flex-col bg-brand-bg select-none
                transition-all duration-300 ease-in-out
                ${open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            `}>
                {/* Top: Logo + Toggle Row */}
                <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} px-5 pt-6 pb-2`}>
                    <Link href="/" className="flex items-center gap-3 group" onClick={() => setOpen(false)}>
                        <div className="w-9 h-9 min-w-[36px] rounded-lg bg-brand-accent/10 flex items-center justify-center overflow-hidden shadow-[0_0_16px_rgba(232,185,49,0.08)]">
                            <img src="/logo.png" alt="P" className="w-full h-full object-cover scale-150" />
                        </div>
                        {!isCollapsed && (
                            <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="font-bold tracking-tighter text-xl text-white group-hover:text-brand-accent transition-colors"
                            >
                                Picket
                            </motion.span>
                        )}
                    </Link>
                    {!isCollapsed && (
                        <button
                            onClick={() => setIsCollapsed(true)}
                            className="hidden md:flex w-7 h-7 items-center justify-center rounded-md text-brand-dim hover:text-brand-muted hover:bg-white/[0.04] transition-all"
                            title="Collapse sidebar"
                        >
                            <PanelLeftClose size={15} />
                        </button>
                    )}
                </div>

                {/* Collapsed: Expand button under logo */}
                {isCollapsed && (
                    <div className="hidden md:flex justify-center pt-2 pb-1">
                        <button
                            onClick={() => setIsCollapsed(false)}
                            className="w-7 h-7 flex items-center justify-center rounded-md text-brand-dim hover:text-brand-muted hover:bg-white/[0.04] transition-all"
                            title="Expand sidebar"
                        >
                            <PanelLeftOpen size={15} />
                        </button>
                    </div>
                )}

                {/* Navigation */}
                <div className={`flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar ${isCollapsed ? 'px-2 pt-6' : 'px-4 pt-8'} space-y-8`}>
                    <NavGroup label="Getting Started" isCollapsed={isCollapsed}>
                        <NavItem href="/about" icon={<BookOpen size={18} />} label="Terminal Guide" isCollapsed={isCollapsed} />
                    </NavGroup>

                    <NavGroup label="Core Infrastructure" isCollapsed={isCollapsed}>
                        <NavItem href="/dashboard" icon={<LayoutDashboard size={18} />} label="Dashboard" isCollapsed={isCollapsed} />
                        <NavItem href="/accounts" icon={<Users size={18} />} label="Accounts" isCollapsed={isCollapsed} />
                        <NavItem href="/analytics" icon={<BarChart3 size={18} />} label="Analytics" isCollapsed={isCollapsed} />
                        <NavItem href="/alerts" icon={<Bell size={18} />} label="Alerts" isCollapsed={isCollapsed} />
                    </NavGroup>

                    <NavGroup label="Integrations" isCollapsed={isCollapsed}>
                        <NavItem href="/integrations" icon={<Zap size={18} />} label="Nodes" isCollapsed={isCollapsed} />
                        <NavItem href="/settings" icon={<Settings size={18} />} label="Terminal" isCollapsed={isCollapsed} />
                    </NavGroup>
                </div>

                {/* Bottom Status */}
                <div className={`${isCollapsed ? 'px-2 pb-5' : 'px-4 pb-5'}`}>
                    {isCollapsed ? (
                        <div className="flex justify-center py-3" title="Systems Nominal">
                            <div className="w-2.5 h-2.5 rounded-full bg-brand-success shadow-[0_0_10px_rgba(16,185,129,0.4)] animate-pulse" />
                        </div>
                    ) : (
                        <div className="p-4 bg-brand-surface/50 rounded-xl border border-brand-border/50">
                            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-brand-dim mb-2.5">Network Status</p>
                            <div className="flex items-center gap-2.5">
                                <div className="w-2 h-2 rounded-full bg-brand-success shadow-[0_0_10px_rgba(16,185,129,0.4)] animate-pulse" />
                                <span className="text-xs font-semibold text-brand-text">Systems Nominal</span>
                            </div>
                        </div>
                    )}
                </div>
            </aside>
        </>
    );
}

function NavGroup({ label, isCollapsed, children }: { label: string; isCollapsed: boolean; children: React.ReactNode }) {
    return (
        <nav className="space-y-1">
            {!isCollapsed && (
                <p className="px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-brand-dim mb-3">{label}</p>
            )}
            {isCollapsed && <div className="w-6 mx-auto border-t border-brand-border/40 mb-3" />}
            <div className="space-y-0.5">
                {children}
            </div>
        </nav>
    );
}

function NavItem({ href, icon, label, isCollapsed }: { href: string; icon: React.ReactNode; label: string; isCollapsed: boolean }) {
    const pathname = usePathname();
    const active = pathname === href || (href !== "/" && pathname.startsWith(href));

    return (
        <Link
            href={href}
            title={isCollapsed ? label : ""}
            className={`
                flex items-center ${isCollapsed ? 'justify-center w-10 h-10 mx-auto' : 'gap-3 px-3'} 
                py-2 rounded-lg text-[13px] font-semibold transition-all duration-200 group
                ${active
                    ? "bg-brand-accent/8 text-brand-accent"
                    : "text-brand-muted hover:text-white hover:bg-white/[0.03]"
                }
            `}
        >
            <span className={`transition-colors duration-200 ${active ? "text-brand-accent" : "text-brand-muted group-hover:text-brand-accent/70"}`}>
                {icon}
            </span>
            {!isCollapsed && <span>{label}</span>}
        </Link>
    );
}
