export type SignalType =
    | "HIRING_SPIKE"
    | "EXEC_CHANGE"
    | "FUNDING_RECENT"
    | "TECH_STACK_CHANGE"
    | "JD_KEYWORD_MATCH"
    | "REVENUE_ACCELERATION";

export interface Signal {
    id: string;
    type: SignalType;
    title: string;
    description: string;
    timestamp: string; // ISO format
    weight: number;
    metadata?: Record<string, any>;
}

export type Industry =
    | "FinTech"
    | "SaaS"
    | "E-commerce"
    | "HealthTech"
    | "DevTools"
    | "CyberSecurity"
    | "Infrastructure"
    | "AI/ML"
    | "EdTech"
    | "Logistics";

export type Region = "North America" | "Europe" | "Asia" | "Global";

export type FundingStage = "Seed" | "Series A" | "Series B" | "Series C" | "Series D" | "Public" | "Private Late";

export interface OutcomeTracking {
    contactedDate?: string;
    meetingBooked: boolean;
    status: "OPEN" | "CONTACTED" | "MEETING_SET" | "QUALIFIED" | "CLOSED_WON" | "CLOSED_LOST";
    dealSize?: number; // In target currency
    salesCycleDays?: number;
}

export interface Company {
    id: number;
    name: string;
    industry: Industry;
    subIndustry: string;
    employeeRange: string;
    employeeCount: number;
    revenueRange: string;
    revenueValue: number; // In millions
    location: string;
    region: Region;
    fundingStage: FundingStage;
    techStack: string[];
    website: string;
    linkedin: string;
    contactEmail: string;
    founded: number;
    description: string;

    // SignalRank Extensions
    signals: Signal[];
    buyingWindowScore: number; // 0-100
    activeTriggersCount: number;
    lastSignalDate: string;
    closeProbability: number; // 0-1 (e.g., 0.31)
    expectedRevenueValue: number; // Calculated field

    // Performance Data (for Analytics)
    outcome: OutcomeTracking;
}

export interface TriggerPerformance {
    type: SignalType;
    combination?: SignalType[];
    meetingRate: number; // 0-1
    avgDealSize: number;
    avgCycleDays: number;
}

export interface DashboardStats {
    totalMonitored: number;
    activeBuyingWindows: number; // Score > 75
    signalsDetectedThisWeek: number;
    expectedPipelineValue: number;
}
