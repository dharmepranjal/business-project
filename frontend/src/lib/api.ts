const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function fetchDashboardStats() {
    const res = await fetch(`${API_BASE}/api/dashboard/stats`);
    if (!res.ok) throw new Error("Failed to fetch dashboard stats");
    return res.json();
}

export async function fetchRankedAccounts(tier?: string, limit?: number) {
    const params = new URLSearchParams();
    if (tier) params.set("tier", tier);
    if (limit) params.set("limit", limit.toString());
    const res = await fetch(`${API_BASE}/api/scores/ranked?${params}`);
    if (!res.ok) throw new Error("Failed to fetch ranked accounts");
    return res.json();
}

export async function fetchCompany(id: number) {
    const res = await fetch(`${API_BASE}/api/companies/${id}`);
    if (!res.ok) throw new Error("Failed to fetch company");
    return res.json();
}

export async function fetchCompanies(filters?: Record<string, string>) {
    const params = new URLSearchParams(filters || {});
    const res = await fetch(`${API_BASE}/api/companies?${params}`);
    if (!res.ok) throw new Error("Failed to fetch companies");
    return res.json();
}

export async function fetchWeights() {
    const res = await fetch(`${API_BASE}/api/scores/weights`);
    if (!res.ok) throw new Error("Failed to fetch weights");
    return res.json();
}

export async function updateWeights(weights: Record<string, number>) {
    const res = await fetch(`${API_BASE}/api/scores/weights`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(weights),
    });
    if (!res.ok) throw new Error("Failed to update weights");
    return res.json();
}

export async function recalculateScores() {
    const res = await fetch(`${API_BASE}/api/scores/recalculate`, { method: "POST" });
    if (!res.ok) throw new Error("Failed to recalculate");
    return res.json();
}

export async function runOptimization(params: {
    capacity: number;
    diversify: boolean;
    max_industry_pct: number;
    min_tier1_pct: number;
}) {
    const res = await fetch(`${API_BASE}/api/optimize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
    });
    if (!res.ok) throw new Error("Failed to optimize");
    return res.json();
}

export async function generateOutreach(companyId: number) {
    const res = await fetch(`${API_BASE}/api/outreach/${companyId}`, { method: "POST" });
    if (!res.ok) throw new Error("Failed to generate outreach");
    return res.json();
}

export async function refreshSignals() {
    const res = await fetch(`${API_BASE}/api/signals/refresh`, { method: "POST" });
    if (!res.ok) throw new Error("Failed to refresh signals");
    return res.json();
}
