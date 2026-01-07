import { DashboardClient } from "@/components/DashboardClient";

export default function DashboardPage() {
    return (
        <div className="min-h-screen bg-black text-white p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Climate Dashboard</h1>
                <p className="text-gray-400">Interactive analysis of global climate indicators</p>
            </div>

            <DashboardClient />
        </div>
    );
}
