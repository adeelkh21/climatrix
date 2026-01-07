'use client';


import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useMemo } from 'react';

interface AccelerationHeatmapProps {
    countryData: Record<string, any[]>;
}

export function AccelerationHeatmap({ countryData }: AccelerationHeatmapProps) {
    // 1. Prepare Data: Calculate 2nd Derivative (Acceleration) of Temperature
    // Acceleration ~ (Temp(t) - Temp(t-1)) - (Temp(t-1) - Temp(t-2))

    // Select top 10 most volatile countries to keep heatmap readable
    const selectedCountries = useMemo(() => {
        return Object.entries(countryData)
            .map(([country, data]) => {
                const temps = data.map(d => d.temp);
                const variance = Math.max(...temps) - Math.min(...temps);
                return { country, variance, data };
            })
            .sort((a, b) => b.variance - a.variance)
            .slice(0, 10);
    }, [countryData]);

    const heatmapData = useMemo(() => {
        return selectedCountries.map(({ country, data }) => {
            const accelerationData = [];
            // Need at least 3 years for 2nd derivative
            for (let i = 2; i < data.length; i++) {
                const t = data[i].temp;
                const t_1 = data[i - 1].temp;
                const t_2 = data[i - 2].temp;

                const velocity_1 = t - t_1;
                const velocity_2 = t_1 - t_2;
                const acceleration = velocity_1 - velocity_2;

                accelerationData.push({
                    x: data[i].year.toString(),
                    y: acceleration
                });
            }

            return {
                id: country,
                data: accelerationData
            };
        });
    }, [selectedCountries]);

    if (!heatmapData.length) return null;

    return (
        <Card className="bg-white/5 border-white/10 text-white shadow-xl h-full flex flex-col">
            <CardHeader>
                <CardTitle>Climate Acceleration Matrix</CardTitle>
                <CardDescription className="text-gray-400">
                    2nd Derivative of Temperature (Speed of Change). Red = Accelerating Warming.
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 min-h-0 p-0 overflow-hidden">
                <div className="h-full w-full">
                    {/* @nivo/heatmap requires specific peer dependencies, using Recharts Scatter/Heatmap equivalent might be safer if nivo isn't installed. 
                        Let's check package.json first. If not present, I'll fallback to a custom SVG/HTML grid or Recharts ScatterGrid. 
                        Safe Assumption: Nivo is likely not installed. Let's use a simpler Recharts Scatter Plot designed as a Heatmap or a standard HTML Grid.
                        Actually, HTML Grid is robust and lightweight for this matrix.
                     */}
                    <div className="flex flex-col h-full overflow-hidden p-2">
                        {/* Header Row */}
                        <div className="flex border-b border-white/10 pb-2">
                            <div className="w-32 shrink-0 text-xs font-bold text-gray-400">Region</div>
                            {heatmapData[0].data.map((d: any) => (
                                <div key={d.x} className="flex-1 min-w-0 text-center text-[9px] text-gray-500 overflow-hidden flex items-end justify-center">
                                    <span className="-rotate-90 origin-center whitespace-nowrap mb-1">{d.x}</span>
                                </div>
                            ))}
                        </div>

                        {/* Rows */}
                        {heatmapData.map((row) => (
                            <div key={row.id} className="flex items-center border-b border-white/5 h-8">
                                <div className="w-32 shrink-0 text-xs font-medium text-gray-300 truncate pr-2" title={row.id}>{row.id}</div>
                                {row.data.map((cell: any) => {
                                    // Color Scale: -0.5 (Blue) to 0 (Gray) to +0.5 (Red)
                                    // acceleration is usually small, e.g. 0.1 deg/yr^2
                                    const val = cell.y;
                                    let bg = '#3f3f46'; // zinc-700 gray neutral
                                    if (val > 0) {
                                        // Red intensity
                                        const intensity = Math.min(Math.abs(val) * 5, 1);
                                        bg = `rgba(239, 68, 68, ${intensity})`; // red-500
                                    } else {
                                        // Blue intensity
                                        const intensity = Math.min(Math.abs(val) * 5, 1);
                                        bg = `rgba(59, 130, 246, ${intensity})`; // blue-500
                                    }

                                    return (
                                        <div key={cell.x} className="flex-1 min-w-0 h-full flex items-center justify-center relative group">
                                            <div className="w-full h-full" style={{ backgroundColor: bg, opacity: 0.8 }}></div>
                                            {/* Tooltip */}
                                            <div className="hidden group-hover:block absolute bottom-full mb-1 z-50 bg-black border border-white/20 p-2 rounded shadow-lg text-xs whitespace-nowrap right-0">
                                                {row.id} {cell.x}: {val.toFixed(3)}°C/yr²
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
