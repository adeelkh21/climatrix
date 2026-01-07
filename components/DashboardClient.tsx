'use client';

import { useState, useEffect } from 'react';
import { GlobalTrendChart } from './charts/GlobalTrendChart';
import { CorrelationChart } from './charts/CorrelationChart';
import { AccelerationHeatmap } from './charts/AccelerationHeatmap';
import { RegionalRisksChart } from './charts/RegionalRisksChart';
import { AnalyticsProvider, useAnalytics } from '@/app/context/AnalyticsContext';
import globalTrends from '@/public/data/global_trends.json';
import { Card, CardContent } from './ui/card';
import { Play, Pause, RotateCcw, Activity, Thermometer, Waves, ChevronLeft } from 'lucide-react';
import { WorldMap } from './charts/WorldMap';
import countryTrends from '@/public/data/country_trends.json';
import { InsightsPanel } from './InsightsPanel';
import { cn } from '@/lib/utils';

export function DashboardClient() {
    return (
        <AnalyticsProvider>
            <DashboardContent />
        </AnalyticsProvider>
    );
}

function DashboardContent() {
    const {
        selectedRegion,
        setRegion,
        timeRange,
        setTimeRange,
        resetFilters,
        viewMode
    } = useAnalytics();

    // Local animation state
    const [isPlaying, setIsPlaying] = useState(false);
    const [activeMetrics, setActiveMetrics] = useState<'temp' | 'co2' | 'sea'>('temp');

    // Sync current year with timeRange[1] for animation compatibility
    const currentYear = timeRange[1];

    // Animation Loop
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isPlaying) {
            interval = setInterval(() => {
                setTimeRange([timeRange[0], currentYear < 2022 ? currentYear + 1 : 2000]);
            }, 500);
        }
        return () => clearInterval(interval);
    }, [isPlaying, currentYear, timeRange, setTimeRange]);

    // Derived Metrics Logic
    // If selectedRegion is present, try to find that specific data.
    // Fallback to global if not found or no region selected.
    let displayMetrics: any = {};
    const safeYear = Math.min(Math.max(currentYear, 2000), 2022);

    if (selectedRegion && (countryTrends as any)[selectedRegion]) {
        // Find country specific year data
        const cData = (countryTrends as any)[selectedRegion].find((d: any) => d.year === safeYear);
        displayMetrics = cData || {};
    } else {
        displayMetrics = globalTrends.find((d: any) => d.year === safeYear) || {};
    }

    const togglePlay = () => setIsPlaying(!isPlaying);
    const handleReset = () => { setIsPlaying(false); resetFilters(); };

    return (
        <div className="space-y-4 pb-12">

            {/* 1. Header & Controls */}
            <div className="sticky top-16 z-30 bg-black/90 backdrop-blur-xl pb-3 pt-2 border-b border-white/10 shadow-lg">
                <div className="flex flex-col xl:flex-row gap-4 items-center justify-between">

                    {/* View Title & Back Button */}
                    <div className="flex items-center gap-3 w-full xl:w-auto">
                        {viewMode === 'country-detail' && (
                            <button onClick={() => setRegion(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                                <ChevronLeft className="h-5 w-5 text-white" />
                            </button>
                        )}
                        <div>
                            <h2 className="text-lg font-bold text-white leading-tight">
                                {selectedRegion ? selectedRegion : 'Global Overview'}
                            </h2>
                            <p className="text-xs text-slate-400">
                                {selectedRegion ? 'Regional Climate Analysis' : 'Planetary Aggregate Metrics'}
                            </p>
                        </div>
                    </div>

                    {/* Timeline Controls */}
                    <div className="flex items-center gap-4 w-full xl:w-auto bg-white/5 p-2 px-4 rounded-full border border-white/10">
                        <button
                            onClick={togglePlay}
                            className="h-8 w-8 flex items-center justify-center rounded-full bg-blue-600 hover:bg-blue-500 transition-all text-white shadow-lg shrink-0"
                        >
                            {isPlaying ? <Pause className="h-3 w-3 fill-current" /> : <Play className="h-3 w-3 fill-current ml-0.5" />}
                        </button>

                        <div className="flex-1 xl:w-48 flex items-center gap-3">
                            <span className="text-xl font-mono font-bold text-white min-w-[3rem]">{currentYear}</span>
                            <input
                                type="range"
                                min="2000"
                                max="2022"
                                value={currentYear}
                                onChange={(e) => {
                                    setIsPlaying(false);
                                    setTimeRange([2000, parseInt(e.target.value)]);
                                }}
                                className="w-full h-1.5 bg-white/20 rounded-full appearance-none cursor-pointer accent-blue-500 hover:accent-blue-400"
                            />
                        </div>

                        <button onClick={handleReset} className="p-1.5 text-gray-400 hover:text-white transition-colors" title="Reset Dashboard">
                            <RotateCcw className="h-4 w-4" />
                        </button>
                    </div>

                    {/* Live Metrics */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full xl:w-auto flex-1">
                        <StatCard
                            icon={<Thermometer className="h-4 w-4 text-orange-400" />}
                            label={selectedRegion ? "Regional Temp" : "Avg Temp"}
                            value={`${displayMetrics.temp?.toFixed(2) ?? 'N/A'}°C`}
                        />
                        <StatCard
                            icon={<Activity className="h-4 w-4 text-green-400" />}
                            label="CO₂"
                            value={`${displayMetrics.co2?.toFixed(1) ?? 'N/A'} ppm`}
                        />
                        <StatCard
                            icon={<Waves className="h-4 w-4 text-blue-400" />}
                            label="Sea Level"
                            value={`${displayMetrics.sea?.toFixed(1) ?? 'N/A'} mm`}
                        />
                        <StatCard
                            icon={<Waves className="h-4 w-4 text-cyan-400" />}
                            label="Precip"
                            value={`${displayMetrics.precip?.toFixed(1) ?? 'N/A'} mm`}
                        />
                    </div>
                </div>
            </div>

            {/* 2. BENTO LAYOUT */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">

                {/* Map Panel */}
                <div className="xl:col-span-6 h-[500px]">
                    <div className="h-full overflow-hidden rounded-xl border border-white/10 bg-black/40 relative">
                        <div className="absolute inset-0">
                            {/* Pass setRegion to map so clicking enables drill-down */}
                            <WorldMap
                                countryData={countryTrends}
                                year={currentYear}
                                onCountryClick={(name) => setRegion(name)}
                                activeRegion={selectedRegion}
                            />
                        </div>
                    </div>
                </div>

                {/* Main Trend Chart */}
                <div className="xl:col-span-6 h-[500px] flex flex-col gap-4">
                    <div className="grid grid-cols-3 gap-1 bg-white/5 p-1 rounded-lg border border-white/10 shrink-0">
                        <FilterBtn label="Temp" active={activeMetrics === 'temp'} onClick={() => setActiveMetrics('temp')} />
                        <FilterBtn label="CO₂" active={activeMetrics === 'co2'} onClick={() => setActiveMetrics('co2')} />
                        <FilterBtn label="Sea Lvl" active={activeMetrics === 'sea'} onClick={() => setActiveMetrics('sea')} />
                    </div>

                    <div className="flex-1 min-h-0">
                        <GlobalTrendChart
                            data={globalTrends}
                            metric={activeMetrics}
                            selectedRegion={selectedRegion}
                            countryData={countryTrends}
                        />
                    </div>
                </div>

                {/* Secondary Rows: Flat Grid for uniformity */}
                <div className="xl:col-span-4 h-[400px]">
                    <CorrelationChart
                        data={globalTrends}
                        currentYear={currentYear}
                    />
                </div>
                <div className="xl:col-span-4 h-[400px]">
                    <AccelerationHeatmap countryData={countryTrends} />
                </div>
                <div className="xl:col-span-4 h-[400px]">
                    <RegionalRisksChart countryData={countryTrends} />
                </div>

            </div>
        </div>
    );
}

// ... existing helper components ...
function StatCard({ label, value, icon }: { label: string, value: string, icon: React.ReactNode }) {
    return (
        <Card className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors">
            <CardContent className="p-3 flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                    {icon}
                </div>
                <div>
                    <div className="text-[10px] text-gray-400 uppercase tracking-widest font-medium">{label}</div>
                    <div className="text-xl font-bold text-white tracking-tight leading-none mt-0.5">{value}</div>
                </div>
            </CardContent>
        </Card>
    )
}

function FilterBtn({ label, active, onClick }: { label: string, active: boolean, onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "py-1.5 text-xs font-medium rounded-md transition-all",
                active ? "bg-blue-600 text-white shadow-lg" : "text-gray-400 hover:text-white hover:bg-white/5"
            )}
        >
            {label}
        </button>
    )
}
