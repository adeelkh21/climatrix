'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface RegionalRisksChartProps {
    countryData: Record<string, any[]>;
}

export function RegionalRisksChart({ countryData }: RegionalRisksChartProps) {
    // Calculate volatility (Max - Min temp) for each country
    const volatilityData = Object.entries(countryData).map(([country, items]) => {
        const temps = items.map((d: any) => d.temp);
        const max = Math.max(...temps);
        const min = Math.min(...temps);
        return {
            country,
            volatility: +(max - min).toFixed(2),
            mean: +(temps.reduce((a: number, b: number) => a + b, 0) / temps.length).toFixed(2)
        };
    })
        .sort((a, b) => b.volatility - a.volatility)
        .slice(0, 5); // Top 5

    return (
        <Card className="bg-white/5 border-white/10 text-white shadow-xl h-full flex flex-col">
            <CardHeader>
                <CardTitle>Regional Climate Risk</CardTitle>
                <CardDescription className="text-gray-400">
                    Countries with the highest temperature volatility (Max - Min).
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 min-h-0 p-0">
                <div className="h-full w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart layout="vertical" data={volatilityData} margin={{ top: 5, right: 30, left: 0, bottom: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#333" horizontal={true} vertical={false} />
                            <XAxis type="number" stroke="#9ca3af" tickLine={false} axisLine={false} unit="°C" />
                            <YAxis type="category" dataKey="country" stroke="#9ca3af" tickLine={false} axisLine={false} width={100} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', color: '#f4f4f5' }}
                                itemStyle={{ color: '#f4f4f5' }}
                                cursor={{ fill: 'white', opacity: 0.05 }}
                            />
                            <Bar dataKey="volatility" name="Temp Range" radius={[0, 4, 4, 0]}>
                                {volatilityData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={`hsl(${360 - (index * 20)}, 70%, 50%)`} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
