import { Company } from "./types";
import { formatINR } from "./utils";

export const exportLeadsToCSV = (companies: Company[]) => {
    const headers = [
        "Company Name",
        "Industry",
        "Location",
        "Region",
        "Buying Window Score",
        "Active Triggers",
        "Expected Revenue (INR)",
        "Funding Stage",
        "Engagement Status"
    ];

    const rows = companies.map((c) => [
        c.name,
        c.industry,
        c.location,
        c.region,
        `${c.buyingWindowScore}%`,
        c.activeTriggersCount,
        formatINR(c.expectedRevenueValue),
        c.fundingStage,
        c.outcome.status
    ]);

    const csvContent = [
        headers.join(","),
        ...rows.map((row) => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute("download", `signalrank_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
