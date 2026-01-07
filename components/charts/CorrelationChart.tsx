'use client';

import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface CorrelationChartProps {
    data: any[];
    currentYear?: number;
}

export function CorrelationChart({ data, currentYear }: CorrelationChartProps) {
    return (
        <Card className="bg-white/5 border-white/10 text-white shadow-xl h-full flex flex-col">
            <CardHeader>
                <CardTitle>CO₂ vs Temperature Correlation</CardTitle>
                <CardDescription className="text-gray-400">
                    Examining the relationship between atmospheric CO₂ (ppm) and global temperature (°C).
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 min-h-0 p-0">
                <div className="h-full w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <ScatterChart margin={{ top: 40, right: 20, bottom: 60, left: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                            <XAxis
                                type="number"
                                dataKey="co2"
                                name="CO₂"
                                unit=" ppm"
                                stroke="#9ca3af"
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => value.toFixed(1)}
                                label={{ value: 'CO₂ (ppm)', position: 'bottom', offset: 0, fill: '#9ca3af' }}
                                domain={['auto', 'auto']}
                            />
                            <YAxis
                                type="number"
                                dataKey="temp"
                                name="Temperature"
                                stroke="#9ca3af"
                                tickLine={false}
                                axisLine={false}
                                domain={['dataMin - 0.2', 'dataMax + 0.2']}
                                tickCount={4}
                                tickFormatter={(value) => `${value.toFixed(1)}°C`}
                                label={{ value: 'Temperature (°C)', angle: -90, position: 'insideLeft', offset: 10, fill: '#9ca3af' }}
                            />
                            <Tooltip
                                cursor={{ strokeDasharray: '3 3' }}
                                contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', color: '#f4f4f5' }}
                                itemStyle={{ color: '#f4f4f5' }}
                                formatter={(value: any, name: any) => {
                                    if (name === 'Temperature') return [`${Number(value).toFixed(2)}°C`, name];
                                    if (name === 'CO₂') return [`${Number(value).toFixed(1)} ppm`, name];
                                    return [value, name];
                                }}
                            />
                            <Scatter name="Climate Data" data={data} fill="#8884d8">
                                {data.map((entry, index) => {
                                    const isCurrent = entry.year === currentYear;
                                    const opacity = currentYear ? (isCurrent ? 1 : 0.3) : 1;
                                    const fill = isCurrent ? '#ef4444' : '#3b82f6';
                                    const radius = isCurrent ? 6 : 3;

                                    return <Cell key={`cell-${index}`} fill={fill} fillOpacity={opacity} />;
                                })}
                            </Scatter>
                        </ScatterChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
