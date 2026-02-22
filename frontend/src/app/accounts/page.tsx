"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
    ArrowUpDown,
    ExternalLink,
    Linkedin,
    Mail,
    Download,
    Search,
    ChevronDown,
    Filter,
    BarChart4,
    X,
    FilterX,
    TrendingUp,
    Database,
    Zap,
    MapPin,
    Building2,
    Calendar,
    ArrowUpRight,
    ChevronRight
} from "lucide-react"
import { Company, Industry, Region, FundingStage } from "@/lib/types"
import companiesData from "@/data/companies.json"
import { formatINR, cn } from "@/lib/utils"
import { exportLeadsToCSV } from "@/lib/export"

export default function AccountsPage() {
    const router = useRouter()
    const [companies, setCompanies] = useState<Company[]>([])
    const [search, setSearch] = useState("")
    const [isFilterOpen, setIsFilterOpen] = useState(false)

    // Sort states
    const [sortField, setSortField] = useState<keyof Company | 'none'>('buyingWindowScore')
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

    // Filter states
    const [selectedIndustries, setSelectedIndustries] = useState<Industry[]>([])
    const [selectedRegions, setSelectedRegions] = useState<Region[]>([])
    const [selectedStages, setSelectedStages] = useState<FundingStage[]>([])
    const [selectedCity, setSelectedCity] = useState<string>("")
    const [minBudget, setMinBudget] = useState<number>(0)
    const [selectedStatuses, setSelectedStatuses] = useState<string[]>([])

    useEffect(() => {
        setCompanies(companiesData as Company[])
    }, [])

    const industries: Industry[] = Array.from(new Set((companiesData as Company[]).map(c => c.industry))).sort()
    const regions: Region[] = Array.from(new Set((companiesData as Company[]).map(c => c.region))).sort()
    const stages: FundingStage[] = Array.from(new Set((companiesData as Company[]).map(c => c.fundingStage))).sort()
    const statuses = ["OPEN", "CONTACTED", "MEETING_SET", "QUALIFIED", "CLOSED_WON", "CLOSED_LOST"]
    const cities = Array.from(new Set((companiesData as Company[]).map(c => c.location))).sort()

    const filteredCompanies = useMemo(() => {
        return companies.filter(c => {
            const matchesSearch =
                c.name.toLowerCase().includes(search.toLowerCase()) ||
                c.industry.toLowerCase().includes(search.toLowerCase()) ||
                c.location.toLowerCase().includes(search.toLowerCase()) ||
                c.techStack.some(t => t.toLowerCase().includes(search.toLowerCase()));

            const matchesIndustry = selectedIndustries.length === 0 || selectedIndustries.includes(c.industry);
            const matchesRegion = selectedRegions.length === 0 || selectedRegions.includes(c.region);
            const matchesStage = selectedStages.length === 0 || selectedStages.includes(c.fundingStage);
            const matchesCity = !selectedCity || c.location === selectedCity;
            const matchesBudget = c.expectedRevenueValue >= minBudget;
            const matchesStatus = selectedStatuses.length === 0 || selectedStatuses.includes(c.outcome.status);

            return matchesSearch && matchesIndustry && matchesRegion && matchesStage && matchesCity && matchesBudget && matchesStatus;
        }).sort((a, b) => {
            if (sortField === 'none') return 0;
            const aVal = a[sortField];
            const bVal = b[sortField];

            if (typeof aVal === 'string' && typeof bVal === 'string') {
                return sortOrder === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
            }
            if (typeof aVal === 'number' && typeof bVal === 'number') {
                return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
            }
            return 0;
        });
    }, [companies, search, selectedIndustries, selectedRegions, selectedStages, selectedCity, minBudget, selectedStatuses, sortField, sortOrder]);

    const handleSort = (field: keyof Company) => {
        if (sortField === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortOrder('desc');
        }
    }

    const clearFilters = () => {
        setSelectedIndustries([]);
        setSelectedRegions([]);
        setSelectedStages([]);
        setSelectedCity("");
        setMinBudget(0);
        setSelectedStatuses([]);
    }

    const activeFilterCount = selectedIndustries.length + selectedRegions.length + selectedStages.length + (selectedCity ? 1 : 0) + (minBudget > 0 ? 1 : 0) + selectedStatuses.length;

    return (
        <div className="p-4 md:p-10 space-y-6 md:space-y-8 max-w-[1600px] mx-auto min-h-screen">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div className="space-y-1">
                    <p className="text-[11px] font-medium tracking-wide text-brand-accent/80 uppercase">Universe Management</p>
                    <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-white">Monitored Accounts</h1>
                    <p className="text-xs text-brand-muted font-medium">Showing {filteredCompanies.length} of {companies.length} targets</p>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="flex-1 md:flex-none bg-brand-card border border-brand-border px-4 py-2.5 rounded-xl flex items-center gap-3 focus-within:border-brand-accent/30 transition-all shadow-sm">
                        <Search size={14} className="text-brand-muted" />
                        <input
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            type="text"
                            placeholder="Search by name, city, tech..."
                            className="bg-transparent border-none outline-none text-sm w-full md:w-80 font-medium placeholder:text-brand-dim"
                        />
                    </div>
                    <button
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                        className={cn(
                            "p-2.5 border rounded-xl transition-all flex items-center gap-2 text-xs font-bold uppercase tracking-wider relative",
                            isFilterOpen || activeFilterCount > 0 ? "border-brand-accent text-brand-accent bg-brand-accent/5" : "border-brand-border bg-brand-card text-brand-muted hover:text-white"
                        )}
                    >
                        <Filter size={18} />
                        <span className="hidden sm:inline">Filters</span>
                        {activeFilterCount > 0 && (
                            <span className="absolute -top-2 -right-2 w-5 h-5 bg-brand-accent text-brand-bg rounded-full flex items-center justify-center text-[10px] font-bold shadow-lg">
                                {activeFilterCount}
                            </span>
                        )}
                    </button>
                    <button
                        onClick={() => exportLeadsToCSV(filteredCompanies)}
                        className="p-2.5 border border-brand-border bg-brand-card rounded-xl hover:border-brand-accent/30 transition-all text-brand-muted hover:text-white group"
                        title="Export filtered leads"
                    >
                        <Download size={18} className="group-hover:translate-y-0.5 transition-transform" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Desktop Filter Sidebar / Mobile Drawer */}
                <AnimatePresence>
                    {(isFilterOpen || (typeof window !== 'undefined' && window.innerWidth >= 1024)) && (
                        <motion.aside
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className={cn(
                                "lg:col-span-1 space-y-6 lg:block",
                                isFilterOpen ? "fixed inset-0 z-50 bg-brand-bg md:relative md:z-auto p-4 md:p-0 overflow-y-auto" : "hidden lg:block"
                            )}
                        >
                            <div className="flex items-center justify-between lg:hidden mb-6">
                                <h3 className="text-lg font-bold text-white">Filters</h3>
                                <button onClick={() => setIsFilterOpen(false)} className="p-2"><X size={24} /></button>
                            </div>

                            <div className="space-y-6 bg-brand-card/50 border border-brand-border p-6 rounded-2xl shadow-xl">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-[10px] font-bold text-brand-dim uppercase tracking-[0.2em]">Refine Territory</h4>
                                    {activeFilterCount > 0 && (
                                        <button onClick={clearFilters} className="text-[10px] font-bold text-brand-accent hover:underline flex items-center gap-1">
                                            <FilterX size={12} /> Clear
                                        </button>
                                    )}
                                </div>

                                {/* Industry */}
                                <div className="space-y-3">
                                    <label className="text-xs font-bold text-brand-muted uppercase flex items-center gap-2">
                                        <Building2 size={12} /> Industry
                                    </label>
                                    <div className="flex flex-wrap gap-1.5">
                                        {industries.map(ind => (
                                            <button
                                                key={ind}
                                                onClick={() => setSelectedIndustries(prev => prev.includes(ind) ? prev.filter(i => i !== ind) : [...prev, ind])}
                                                className={cn(
                                                    "px-2 py-1 rounded-lg text-[10px] font-bold transition-all border",
                                                    selectedIndustries.includes(ind) ? "bg-brand-accent/20 border-brand-accent/40 text-brand-accent" : "bg-brand-surface border-brand-border text-brand-dim hover:border-brand-accent/30"
                                                )}
                                            >
                                                {ind}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* City */}
                                <div className="space-y-3">
                                    <label className="text-xs font-bold text-brand-muted uppercase flex items-center gap-2">
                                        <MapPin size={12} /> City
                                    </label>
                                    <select
                                        value={selectedCity}
                                        onChange={e => setSelectedCity(e.target.value)}
                                        className="w-full bg-brand-surface border border-brand-border rounded-xl px-3 py-2 text-xs font-semibold text-brand-text outline-none focus:border-brand-accent/30 appearance-none cursor-pointer"
                                    >
                                        <option value="">All Cities ({cities.length})</option>
                                        {cities.map(city => (
                                            <option key={city} value={city}>{city}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Budget */}
                                <div className="space-y-3">
                                    <label className="text-xs font-bold text-brand-muted uppercase flex items-center gap-2">
                                        <TrendingUp size={12} /> Min. Pipeline (INR)
                                    </label>
                                    <input
                                        type="range"
                                        min="0"
                                        max="100000000"
                                        step="1000000"
                                        value={minBudget}
                                        onChange={e => setMinBudget(parseInt(e.target.value))}
                                        className="w-full h-1.5 bg-brand-surface rounded-lg appearance-none cursor-pointer accent-brand-accent"
                                    />
                                    <div className="flex justify-between text-[10px] font-bold text-brand-dim tracking-wider">
                                        <span>₹0</span>
                                        <span className="text-brand-accent">{formatINR(minBudget)}</span>
                                        <span>₹10Cr+</span>
                                    </div>
                                </div>

                                {/* Status */}
                                <div className="space-y-3">
                                    <label className="text-xs font-bold text-brand-muted uppercase flex items-center gap-2">
                                        <Zap size={12} /> Engagement Status
                                    </label>
                                    <div className="grid grid-cols-1 gap-1.5">
                                        {statuses.map(status => (
                                            <button
                                                key={status}
                                                onClick={() => setSelectedStatuses(prev => prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status])}
                                                className={cn(
                                                    "px-3 py-2 rounded-xl text-[10px] font-bold text-left transition-all border flex items-center justify-between",
                                                    selectedStatuses.includes(status) ? "bg-brand-accent/10 border-brand-accent/30 text-brand-accent shadow-inner" : "bg-brand-surface border-brand-border text-brand-dim hover:bg-brand-surface/80"
                                                )}
                                            >
                                                {status.replace('_', ' ')}
                                                {selectedStatuses.includes(status) && <div className="w-1.5 h-1.5 rounded-full bg-brand-accent shadow-[0_0_8px_rgba(232,185,49,0.5)]" />}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Funding Stage */}
                                <div className="space-y-3">
                                    <label className="text-xs font-bold text-brand-muted uppercase flex items-center gap-2">
                                        <Database size={12} /> Funding Stage
                                    </label>
                                    <div className="flex flex-wrap gap-1.5">
                                        {stages.map(stage => (
                                            <button
                                                key={stage}
                                                onClick={() => setSelectedStages(prev => prev.includes(stage) ? prev.filter(s => s !== stage) : [...prev, stage])}
                                                className={cn(
                                                    "px-2 py-1 rounded-lg text-[10px] font-bold transition-all border",
                                                    selectedStages.includes(stage) ? "bg-brand-accent/20 border-brand-accent/40 text-brand-accent" : "bg-brand-surface border-brand-border text-brand-dim hover:border-brand-accent/30"
                                                )}
                                            >
                                                {stage}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    onClick={() => setIsFilterOpen(false)}
                                    className="w-full lg:hidden py-4 bg-brand-accent text-brand-bg rounded-xl font-bold uppercase tracking-widest mt-4"
                                >
                                    Apply filters
                                </button>
                            </div>
                        </motion.aside>
                    )}
                </AnimatePresence>

                {/* Accounts Table (Desktop) / Cards (Mobile) */}
                <div className={cn("space-y-4", isFilterOpen ? "hidden lg:block lg:col-span-3" : "block lg:col-span-3")}>
                    {/* Desktop Table View */}
                    <div className="hidden md:block bg-brand-card border border-brand-border rounded-2xl overflow-hidden shadow-2xl relative">
                        <div className="overflow-x-auto custom-scrollbar">
                            <table className="w-full text-left border-collapse min-w-[1000px]">
                                <thead>
                                    <tr className="bg-brand-surface text-[10px] font-bold text-brand-dim border-b border-brand-border uppercase tracking-widest">
                                        <th className="px-8 py-5">
                                            <button onClick={() => handleSort('name')} className="flex items-center gap-1.5 hover:text-white transition-colors">
                                                Account details <ArrowUpDown size={12} />
                                            </button>
                                        </th>
                                        <th className="px-8 py-5">
                                            <button onClick={() => handleSort('buyingWindowScore')} className="flex items-center gap-1.5 hover:text-white transition-colors">
                                                Window Score <ArrowUpDown size={12} />
                                            </button>
                                        </th>
                                        <th className="px-8 py-5 text-center">
                                            <button onClick={() => handleSort('activeTriggersCount')} className="flex items-center gap-1.5 mx-auto hover:text-white transition-colors">
                                                Signals <ArrowUpDown size={12} />
                                            </button>
                                        </th>
                                        <th className="px-8 py-5">
                                            <button onClick={() => handleSort('expectedRevenueValue')} className="flex items-center gap-1.5 hover:text-white transition-colors">
                                                Est. Value <ArrowUpDown size={12} />
                                            </button>
                                        </th>
                                        <th className="px-8 py-5">Status</th>
                                        <th className="px-8 py-5"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-brand-border/50">
                                    {filteredCompanies.length > 0 ? (
                                        filteredCompanies.map((company, idx) => (
                                            <AccountItem key={company.id} company={company} index={idx} />
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={6} className="px-8 py-20 text-center space-y-4">
                                                <div className="w-16 h-16 bg-brand-surface rounded-full flex items-center justify-center mx-auto text-brand-dim border border-brand-border">
                                                    <FilterX size={32} />
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-white font-semibold">No accounts found</p>
                                                    <p className="text-xs text-brand-muted">Try adjusting your filters or search query.</p>
                                                </div>
                                                <button onClick={clearFilters} className="text-xs font-bold text-brand-accent uppercase tracking-widest hover:underline">Clear all filters</button>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Mobile Card View */}
                    <div className="md:hidden space-y-4">
                        {filteredCompanies.length > 0 ? (
                            filteredCompanies.map((company, idx) => (
                                <motion.div
                                    key={company.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="bg-brand-card border border-brand-border p-5 rounded-2xl space-y-5"
                                    onClick={() => router.push(`/account/${company.id}`)}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-brand-surface border border-brand-border rounded-lg flex items-center justify-center font-bold text-brand-muted shrink-0">
                                                {company.name[0]}
                                            </div>
                                            <div className="space-y-0.5">
                                                <h3 className="font-bold text-white text-sm">{company.name}</h3>
                                                <p className="text-[10px] font-bold text-brand-dim uppercase tracking-wider">{company.industry}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[9px] font-bold text-brand-dim uppercase tracking-widest">Score</p>
                                            <p className="text-lg font-bold text-brand-accent mono-nums leading-none">{company.buyingWindowScore}%</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 pt-2 border-t border-brand-border/40">
                                        <div className="space-y-0.5">
                                            <p className="text-[9px] font-bold text-brand-dim uppercase tracking-widest">Est. Value</p>
                                            <p className="text-xs font-bold text-white mono-nums">{formatINR(company.expectedRevenueValue)}</p>
                                        </div>
                                        <div className="space-y-0.5 text-right">
                                            <p className="text-[9px] font-bold text-brand-dim uppercase tracking-widest">Status</p>
                                            <span className={cn(
                                                "text-[9px] font-bold uppercase tracking-widest",
                                                company.outcome.status === 'CLOSED_WON' ? "text-brand-success" :
                                                    company.outcome.status === 'QUALIFIED' ? "text-brand-accent" :
                                                        "text-brand-dim"
                                            )}>
                                                {company.outcome.status.replace('_', ' ')}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-2">
                                        <div className="flex items-center gap-1.5">
                                            <MapPin size={10} className="text-brand-dim" />
                                            <span className="text-[10px] font-bold text-brand-dim uppercase">{company.location}</span>
                                        </div>
                                        <div className="flex items-center gap-1 text-[10px] font-bold text-brand-accent uppercase tracking-widest">
                                            View Report <ChevronRight size={12} />
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div className="py-20 text-center space-y-4">
                                <p className="text-white font-semibold">No accounts found</p>
                                <button onClick={clearFilters} className="text-xs font-bold text-brand-accent uppercase hover:underline">Clear all filters</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

function AccountItem({ company, index }: { company: Company; index: number }) {
    const [expanded, setExpanded] = useState(false)
    const router = useRouter()

    const hoursSinceLastSignal = Math.floor((new Date().getTime() - new Date(company.lastSignalDate).getTime()) / (1000 * 3600))
    const signalLabel = hoursSinceLastSignal < 24 ? `${hoursSinceLastSignal}h ago` : `${Math.floor(hoursSinceLastSignal / 24)}d ago`

    return (
        <>
            <motion.tr
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.005 }}
                className={cn(
                    "group transition-all cursor-pointer",
                    expanded ? "bg-brand-accent/[0.03]" : "hover:bg-white/[0.01]"
                )}
                onClick={() => setExpanded(!expanded)}
            >
                <td className="px-8 py-6">
                    <div className="flex items-center gap-5">
                        <div className="w-12 h-12 bg-brand-surface border border-brand-border rounded-xl flex items-center justify-center font-bold text-lg text-brand-muted group-hover:text-brand-accent group-hover:bg-brand-accent/5 group-hover:border-brand-accent/30 transition-all shadow-sm">
                            {company.name[0]}
                        </div>
                        <div className="space-y-1">
                            <p className="font-bold text-brand-text group-hover:text-white transition-colors">{company.name}</p>
                            <p className="text-[10px] font-bold text-brand-dim uppercase tracking-wider flex items-center gap-2">
                                <span>{company.industry}</span>
                                <span className="w-1 h-1 rounded-full bg-brand-border" />
                                <span className="flex items-center gap-1"><MapPin size={10} /> {company.location}</span>
                            </p>
                        </div>
                    </div>
                </td>
                <td className="px-8 py-6">
                    <div className="flex items-center gap-4 min-w-[140px]">
                        <div className={cn(
                            "text-xl font-bold mono-nums tracking-tighter",
                            company.buyingWindowScore > 75 ? "text-brand-accent" : "text-brand-text"
                        )}>
                            {company.buyingWindowScore}%
                        </div>
                        <div className="flex-1 max-w-[80px] h-1.5 bg-brand-surface rounded-full overflow-hidden border border-brand-border/30">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${company.buyingWindowScore}%` }}
                                transition={{ duration: 1, delay: index * 0.01 }}
                                className={cn(
                                    "h-full rounded-full",
                                    company.buyingWindowScore > 75 ? "bg-brand-accent shadow-[0_0_8px_rgba(232,185,49,0.3)]" : "bg-brand-muted"
                                )}
                            />
                        </div>
                    </div>
                </td>
                <td className="px-8 py-6 text-center">
                    <div className="space-y-1">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-accent/5 border border-brand-accent/10 rounded-lg">
                            <BarChart4 size={12} className="text-brand-accent" />
                            <span className="text-[11px] font-bold mono-nums text-brand-accent">{company.activeTriggersCount}</span>
                        </div>
                        <p className="text-[9px] font-bold text-brand-dim uppercase tracking-widest">{signalLabel}</p>
                    </div>
                </td>
                <td className="px-8 py-6">
                    <div className="space-y-0.5">
                        <p className="text-base font-bold text-brand-text mono-nums tracking-tighter group-hover:text-brand-accent transition-colors">{formatINR(company.expectedRevenueValue)}</p>
                        <p className="text-[9px] font-bold text-brand-dim uppercase tracking-widest flex items-center gap-1.5">
                            {Math.round(company.closeProbability * 100)}% Prob <span className="text-brand-border">|</span> {company.employeeRange} emps
                        </p>
                    </div>
                </td>
                <td className="px-8 py-6">
                    <span className={cn(
                        "px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border",
                        company.outcome.status === 'CLOSED_WON' ? "border-brand-success/30 bg-brand-success/5 text-brand-success" :
                            company.outcome.status === 'QUALIFIED' ? "border-brand-accent/30 bg-brand-accent/5 text-brand-accent" :
                                "border-brand-border bg-brand-surface text-brand-dim"
                    )}>
                        {company.outcome.status.replace('_', ' ')}
                    </span>
                </td>
                <td className="px-8 py-6 text-right">
                    <div className={cn(
                        "p-2 rounded-xl transition-all",
                        expanded ? "bg-brand-accent/10 text-brand-accent" : "text-brand-dim group-hover:text-white group-hover:bg-white/5"
                    )}>
                        <ChevronDown size={18} className={cn("transition-transform duration-500", expanded ? "rotate-180" : "")} />
                    </div>
                </td>
            </motion.tr>

            <AnimatePresence>
                {expanded && (
                    <motion.tr
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                    >
                        <td colSpan={6} className="px-8 py-10 bg-brand-card/40 border-b border-brand-border overflow-hidden">
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-12"
                            >
                                <div className="space-y-8">
                                    <div className="flex items-center justify-between border-b border-brand-border pb-4">
                                        <h4 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-3">
                                            <div className="w-1 h-4 bg-brand-accent rounded-full" />
                                            Active trigger history
                                        </h4>
                                        <span className="text-[10px] font-bold text-brand-dim uppercase tracking-widest italic">Live Stream Feed</span>
                                    </div>
                                    <div className="space-y-6 relative pl-4">
                                        <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-brand-accent/40 to-transparent" />
                                        {company.signals.map((sig, i) => (
                                            <div key={i} className="flex gap-6 items-start group/sig">
                                                <div className="mt-1.5 w-2 h-2 rounded-full bg-brand-accent shadow-[0_0_10px_rgba(232,185,49,0.4)] relative z-10" />
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-3">
                                                        <p className="text-xs font-bold text-white uppercase tracking-tight">{sig.title}</p>
                                                        <span className="text-[10px] font-bold text-brand-accent/60 bg-brand-accent/5 px-2 py-0.5 rounded border border-brand-accent/10">+{sig.weight}wt</span>
                                                    </div>
                                                    <p className="text-xs text-brand-muted leading-relaxed max-w-lg font-medium group-hover/sig:text-brand-text transition-colors">{sig.description}</p>
                                                    <div className="flex items-center gap-2 text-[9px] font-bold text-brand-dim uppercase tracking-[0.2em]">
                                                        <Calendar size={10} /> {new Date(sig.timestamp).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-8">
                                    <div className="bg-brand-surface/50 border border-brand-border p-6 rounded-2xl space-y-6 relative overflow-hidden group/brief">
                                        <div className="absolute top-0 right-0 w-40 h-40 bg-brand-accent opacity-[0.03] -translate-y-20 translate-x-20 rounded-full blur-3xl group-hover/brief:opacity-[0.06] transition-opacity duration-1000" />

                                        <div className="space-y-5 relative z-10">
                                            <div className="flex justify-between items-center border-b border-brand-border pb-4">
                                                <h4 className="text-[10px] font-bold text-brand-dim uppercase tracking-widest flex items-center gap-2">
                                                    <Database size={12} className="text-brand-accent" /> Intelligence Node
                                                </h4>
                                                <div className="px-2 py-1 bg-brand-success/10 border border-brand-success/20 rounded-md text-[8px] font-bold text-brand-success uppercase tracking-widest">Active Sink</div>
                                            </div>

                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <p className="text-xs font-bold text-brand-text uppercase tracking-tight">Account Brief</p>
                                                    <p className="text-xs text-brand-muted leading-relaxed font-medium">
                                                        {company.description} Established {company.founded}, targeting {company.subIndustry}. Infrastructure mapping fully indexed.
                                                    </p>
                                                </div>

                                                <div className="space-y-2">
                                                    <p className="text-[10px] font-bold text-brand-dim uppercase tracking-widest">Primary Stack</p>
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {company.techStack.map(tech => (
                                                            <span key={tech} className="px-2 py-0.5 bg-brand-surface border border-brand-border rounded text-[9px] font-bold text-brand-text/80 uppercase tracking-widest hover:border-brand-accent/30 transition-colors">
                                                                {tech}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    router.push(`/account/${company.id}`);
                                                }}
                                                className="w-full py-4 bg-brand-accent text-brand-bg rounded-xl text-[11px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-white transition-all shadow-lg shadow-brand-accent/10 active:scale-95 group/btn"
                                            >
                                                Enter Intelligence Report <ArrowUpRight size={14} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <a href={company.linkedin} target="_blank" onClick={e => e.stopPropagation()} className="flex items-center justify-center gap-2 py-4 rounded-xl border border-brand-border bg-brand-surface hover:text-brand-accent transition-all text-[10px] font-bold uppercase tracking-widest text-brand-dim"><Linkedin size={14} /> Profile</a>
                                        <a href={`mailto:${company.contactEmail}`} onClick={e => e.stopPropagation()} className="flex items-center justify-center gap-2 py-4 rounded-xl border border-brand-border bg-brand-surface hover:text-brand-accent transition-all text-[10px] font-bold uppercase tracking-widest text-brand-dim"><Mail size={14} /> SDR Sync</a>
                                    </div>
                                </div>
                            </motion.div>
                        </td>
                    </motion.tr>
                )}
            </AnimatePresence>
        </>
    )
}

