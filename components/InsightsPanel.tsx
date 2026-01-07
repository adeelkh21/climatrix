'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, Lightbulb } from 'lucide-react';
import insights from '@/public/data/insights.json';

export function InsightsPanel() {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextInsight = () => {
        setCurrentIndex((prev) => (prev + 1) % insights.length);
    };

    const prevInsight = () => {
        setCurrentIndex((prev) => (prev - 1 + insights.length) % insights.length);
    };

    const current = insights[currentIndex];

    return (
        <Card className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border-blue-500/30 text-white relative overflow-hidden h-full flex flex-col">
            <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
            <CardHeader className="pb-2 flex-shrink-0">
                <div className="flex items-center gap-2 text-blue-400 mb-1">
                    <Lightbulb className="h-5 w-5" />
                    <span className="text-sm font-semibold uppercase tracking-wider">Key Insight {currentIndex + 1}/{insights.length}</span>
                </div>
                <CardTitle className="text-xl md:text-2xl leading-none">{current.title}</CardTitle>
                <CardDescription className="text-blue-200/60 font-mono text-xs pt-1">
                    Metric: {current.metric}
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col min-h-0 pt-0 pb-4">
                <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar">
                    <p className="text-gray-300 leading-relaxed text-sm md:text-base pt-2">
                        {current.content}
                    </p>
                </div>

                <div className="flex items-center justify-between pt-4 mt-auto border-t border-white/5 shrink-0">
                    <button
                        onClick={prevInsight}
                        className="p-2 rounded-full hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
                        aria-label="Previous insight"
                    >
                        <ChevronLeft className="h-6 w-6" />
                    </button>

                    <div className="flex gap-1.5">
                        {insights.map((_, idx) => (
                            <div
                                key={idx}
                                className={`h-1.5 w-1.5 rounded-full transition-all ${idx === currentIndex ? 'bg-blue-500 w-3' : 'bg-white/20'}`}
                            />
                        ))}
                    </div>

                    <button
                        onClick={nextInsight}
                        className="p-2 rounded-full hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
                        aria-label="Next insight"
                    >
                        <ChevronRight className="h-6 w-6" />
                    </button>
                </div>
            </CardContent>
        </Card>
    );
}
