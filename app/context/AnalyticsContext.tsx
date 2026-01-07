'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface AnalyticsState {
    // Views
    selectedRegion: string | null;
    viewMode: 'global' | 'country-detail';

    // Filters
    timeRange: [number, number];
    smoothing: 0 | 5 | 10;

    // Toggles
    showUncertainty: boolean;

    // Actions
    setRegion: (region: string | null) => void;
    setTimeRange: (range: [number, number]) => void;
    setSmoothing: (val: 0 | 5 | 10) => void;
    toggleUncertainty: () => void;
    resetFilters: () => void;
}

const AnalyticsContext = createContext<AnalyticsState | undefined>(undefined);

export function AnalyticsProvider({ children }: { children: ReactNode }) {
    const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
    const [timeRange, setTimeRange] = useState<[number, number]>([2000, 2022]); // Default based on data
    const [smoothing, setSmoothing] = useState<0 | 5 | 10>(0);
    const [showUncertainty, setShowUncertainty] = useState(false);

    // Derived state for View Mode
    const viewMode = selectedRegion ? 'country-detail' : 'global';

    const setRegion = (region: string | null) => {
        setSelectedRegion(region);
        // Auto-scroll to top or relevant section could happen here in a real app
    };

    const toggleUncertainty = () => setShowUncertainty(prev => !prev);

    const resetFilters = () => {
        setSelectedRegion(null);
        setTimeRange([2000, 2022]);
        setSmoothing(0);
        setShowUncertainty(false);
    };

    return (
        <AnalyticsContext.Provider value={{
            selectedRegion,
            viewMode,
            timeRange,
            smoothing,
            showUncertainty,
            setRegion,
            setTimeRange,
            setSmoothing,
            toggleUncertainty,
            resetFilters
        }}>
            {children}
        </AnalyticsContext.Provider>
    );
}

export function useAnalytics() {
    const context = useContext(AnalyticsContext);
    if (context === undefined) {
        throw new Error('useAnalytics must be used within an AnalyticsProvider');
    }
    return context;
}
