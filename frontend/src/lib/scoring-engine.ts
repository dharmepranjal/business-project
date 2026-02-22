import { Company, Signal } from "./types";

export function calculateBuyingWindowScore(company: Company): number {
    const baseDate = new Date();
    let totalScore = 0;

    company.signals.forEach(signal => {
        const signalDate = new Date(signal.timestamp);
        const daysAgo = (baseDate.getTime() - signalDate.getTime()) / (1000 * 3600 * 24);

        // Time decay: signals older than 180 days have very little weight
        // Exponential decay: weight * (0.95 ^ (days / 30))
        const decayFactor = Math.pow(0.95, daysAgo / 30);
        totalScore += signal.weight * decayFactor;
    });

    // Add some baseline weighting for company growth stage and industry
    if (company.fundingStage === "Series B" || company.fundingStage === "Series C") totalScore += 5;
    if (company.industry === "CyberSecurity" || company.industry === "AI/ML") totalScore += 5;

    return Math.min(100, Math.round(totalScore));
}

export function getCloseProbability(score: number): number {
    if (score >= 90) return 0.38;
    if (score >= 80) return 0.31;
    if (score >= 70) return 0.22;
    if (score >= 50) return 0.12;
    return 0.05;
}

export function getExpectedRevenue(company: Company): number {
    const score = calculateBuyingWindowScore(company);
    const prob = getCloseProbability(score);
    const avgDealSize = 150000; // Mock average deal size in INR

    return Math.round((score / 100) * prob * avgDealSize);
}

export function rankByBuyingWindow(companies: Company[]): Company[] {
    return [...companies].sort((a, b) => b.buyingWindowScore - a.buyingWindowScore);
}
