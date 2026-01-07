'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine, ComposedChart, Area, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';

interface GlobalTrendChartProps {
    data: any[];
    metric: 'temp' | 'co2' | 'sea';
    selectedRegion?: string | null;
    countryData?: any;
}

const metricConfig = {
    temp: { label: 'Temperature Anomaly', unit: '°C', color: '#fbbf24', barName: 'Temp Anomaly' },
    co2: { label: 'CO₂ Concentration', unit: 'ppm', color: '#10b981', barName: 'CO₂ Level' },
    sea: { label: 'Sea Level Rise', unit: 'mm', color: '#3b82f6', barName: 'Sea Level' }
};

export function GlobalTrendChart({ data, metric, selectedRegion, countryData }: GlobalTrendChartProps) {
    // Baseline logic only applies strictly to Temp for "anomaly", but for CO2/Sea we can show raw or delta.
    // To keep it simple and consistent:
    // Temp -> Anomaly (2000-2010 baseline)
    // CO2 -> Raw Value (Bar) + Trend (Line)
    // Sea -> Raw Value

    // For Temp, we calculate anomaly. For others, we map raw value to "anomaly" key for chart reusability 
    // OR we just interpret "anomaly" as "value" for chart.

    const baselineData = data.filter(d => d.year >= 2000 && d.year <= 2010);
    const baselineTemp = baselineData.reduce((acc, curr) => acc + curr.temp, 0) / (baselineData.length || 1);

    // Determine source data: specific country or global
    let sourceData = data;
    if (selectedRegion && countryData && countryData[selectedRegion]) {
        sourceData = countryData[selectedRegion];
    }

    const processedData = sourceData.map((d: any) => {
        // Match years if comparing
        const globalRecord = data.find(g => g.year === d.year);

        let val = 0;
        let globalVal = 0;

        if (metric === 'temp') {
            val = +(d.temp - baselineTemp).toFixed(3); // Apply same global baseline for fair comparison
            globalVal = globalRecord ? +(globalRecord.temp - baselineTemp).toFixed(3) : 0;
        } else if (metric === 'co2') {
            val = d.co2;
            globalVal = globalRecord ? globalRecord.co2 : 0;
        } else {
            val = d.sea;
            globalVal = globalRecord ? globalRecord.sea : 0;
        }

        return {
            ...d,
            chartValue: val,
            globalBaseline: globalVal,
            // Pass through uncertainty bounds if available in data
            [`${metric}_ub`]: d[`${metric}_ub`] ? +(d[`${metric}_ub`] - (metric === 'temp' ? baselineTemp : 0)).toFixed(3) : undefined,
            [`${metric}_lb`]: d[`${metric}_lb`] ? +(d[`${metric}_lb`] - (metric === 'temp' ? baselineTemp : 0)).toFixed(3) : undefined,
        };
    });

    const config = metricConfig[metric];

    return (
        <Card className="bg-white/5 border-white/10 text-white shadow-xl h-full flex flex-col">
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <CardTitle>{config.label}</CardTitle>
                </div>
                <CardDescription className="text-gray-400 text-xs">
                    {metric === 'temp'
                        ? `Deviation from 2000-2010 baseline (${baselineTemp.toFixed(2)}°C).`
                        : `Global annual average measurements.`}
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 min-h-0 p-0">
                <div className="h-full w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={processedData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorUncertainty" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={config.color} stopOpacity={0.2} />
                                    <stop offset="95%" stopColor={config.color} stopOpacity={0.05} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                            <XAxis dataKey="year" stroke="#9ca3af" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                            <YAxis
                                stroke="#9ca3af"
                                tickLine={false}
                                axisLine={false}
                                tick={{ fontSize: 12 }}
                                domain={['auto', 'auto']}
                                label={{ value: config.unit, angle: -90, position: 'insideLeft', fill: '#9ca3af', fontSize: 10 }}
                            />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', color: '#f4f4f5' }}
                                itemStyle={{ color: '#f4f4f5' }}
                                cursor={{ fill: 'transparent' }}
                            />
                            <ReferenceLine y={0} stroke="#4b5563" strokeDasharray="3 3" />

                            {/* Confidence Band (Area) - Only show if NO region selected (Global View) */}
                            {!selectedRegion && (
                                <Area
                                    type="monotone"
                                    dataKey={`${metric}_ub`}
                                    stroke="none"
                                    fill="url(#colorUncertainty)"
                                    connectNulls
                                />
                            )}

                            {/* Main Line */}
                            <Line
                                type="monotone"
                                dataKey="chartValue"
                                stroke={config.color}
                                strokeWidth={2}
                                dot={false}
                                name={selectedRegion ? selectedRegion : "Global Average"}
                            />

                            {/* Comparison Line (if selectedRegion) */}
                            {selectedRegion && countryData && (
                                <Line
                                    type="monotone"
                                    dataKey="globalBaseline"
                                    stroke="#64748b"
                                    strokeWidth={2}
                                    strokeDasharray="5 5"
                                    dot={false}
                                    name="Global Baseline"
                                />
                            )}
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
