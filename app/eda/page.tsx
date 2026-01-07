
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, X } from 'lucide-react';
import { useState } from 'react';

const EDAPlots = [
    {
        file: '1_temp_dist.png',
        title: 'Global Temperature Distribution',
        desc: 'A histogram and KDE plot showing the spread of global temperatures. Note the central tendency and any skewness towards warmer extremes.'
    },
    {
        file: '2_co2_dist.png',
        title: 'CO₂ Emissions Distribution',
        desc: 'Distribution of Carbon Dioxide emissions. The shape reveals the frequency of different emission levels globally.'
    },
    {
        file: '3_sea_level_dist.png',
        title: 'Sea Level Rise Distribution',
        desc: 'Histogram highlighting Sea Level changes. The red reference line at 0 clearly separates rising (positive) vs falling (negative, rare) sea levels.'
    },
    {
        file: '4_precip_boxplot.png',
        title: 'Precipitation Variability',
        desc: 'Boxplot revealing the range, median, and outliers in global precipitation data, showing the diversity of rainfall patterns.'
    },
    {
        file: '5_wind_boxplot.png',
        title: 'Wind Speed Variability',
        desc: 'Boxplot of wind speeds, highlighting the interquartile range and extreme wind events across the dataset.'
    },
    {
        file: '6_co2_vs_temp.png',
        title: 'CO₂ vs. Temperature',
        desc: 'Scatter plot with regression line visualizing the correlation between CO₂ levels and Temperature. A key indicator of the greenhouse effect.'
    },
    {
        file: '7_temp_vs_sea.png',
        title: 'Temperature vs. Sea Level',
        desc: 'Regression analysis showing how rising temperatures correlate with sea level rise, a critical consequence of thermal expansion and ice melt.'
    },
    {
        file: '8_precip_vs_humidity.png',
        title: 'Precipitation vs. Humidity',
        desc: 'Scatter plot colored by temperature, showing the complex interplay between moisture (humidity) and rainfall.'
    },
    {
        file: '9_wind_vs_precip.png',
        title: 'Wind Speed vs. Precipitation',
        desc: 'Density plot (KDE) identifying the "stormy" quadrants where high wind and high precipitation tend to co-occur.'
    },
    {
        file: '10_country_temp_box.png',
        title: 'Temperature Volatility by Country',
        desc: 'Top 10 countries with the highest temperature standard deviation, highlighting regions with the most extreme weather fluctuations.'
    },
    {
        file: '11_country_sea_box.png',
        title: 'Sea Level Rise by Country',
        desc: 'Distribution of sea level rise impact for the top affected countries, showing the range of vulnerability.'
    },
    {
        file: '12_parallel_coordinates.png',
        title: 'Climate Profiles (Parallel Coords)',
        desc: 'Multivariate view of normalized climate metrics for top countries, allowing for side-by-side profile comparison.'
    },
    {
        file: '13_pca_clusters.png',
        title: 'Climate Archetypes (PCA)',
        desc: 'Principal Component Analysis reducing climate complexity to 2D. Distinct clusters represent different "types" of climate zones (e.g., Hot/Dry vs Cool/Wet).'
    },
    {
        file: '14_cluster_sizes.png',
        title: 'Archetype Prevalence',
        desc: 'Count of countries falling into each climate archetype cluster, showing the relative abundance of different climate profiles.'
    },
    {
        file: '15_radar_archetypes.png',
        title: 'Archetype Fingerprints',
        desc: 'Radar chart visualizing the average "personality" of each cluster. This clearly distinguishes what makes each climate type unique.'
    },
    {
        file: '16_temp_time.png',
        title: 'Global Temperature Trends',
        desc: 'Time-series showing raw yearly temperature (thin line) vs 5-year rolling average (bold), revealing the long-term warming trend.'
    },
    {
        file: '17_co2_time.png',
        title: 'CO₂ Emission Trends',
        desc: 'Time-series of CO₂ emissions. The rolling average smooths out yearly noise to show the clear upward trajectory.'
    },
    {
        file: '18_similarity_heatmap.png',
        title: 'Country Similarity Heatmap',
        desc: 'Clustered heatmap of the top 20 countries. Darker regions indicate higher similarity in climate profiles.'
    }
];

export default function EDAPage() {
    const [selectedImage, setSelectedImage] = useState<typeof EDAPlots[0] | null>(null);

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white p-6 md:p-12">
            <div className="max-w-7xl mx-auto space-y-12">

                {/* Header */}
                <div className="flex flex-col gap-4 border-b border-white/10 pb-8">
                    <Link href="/" className="flex items-center text-gray-400 hover:text-blue-400 transition-colors w-fit">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
                    </Link>
                    <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
                        Raw EDA & Insights
                    </h1>
                    <p className="text-xl text-gray-400 max-w-3xl">
                        A visual journey through the dataset. Click on any plot to view it in high resolution.
                    </p>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {EDAPlots.map((plot, idx) => (
                        <button
                            key={idx}
                            onClick={() => setSelectedImage(plot)}
                            className="text-left group bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-blue-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10 flex flex-col focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {/* Image Container */}
                            <div className="relative aspect-[4/3] w-full bg-white/5 overflow-hidden">
                                <Image
                                    src={`/eda/${plot.file}`}
                                    alt={plot.title}
                                    fill
                                    className="object-contain p-2 group-hover:scale-105 transition-transform duration-500"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                            </div>

                            {/* Content */}
                            <div className="p-6 flex-1 flex flex-col bg-[#0f0f0f] w-full">
                                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                                    {plot.title}
                                </h3>
                                <p className="text-sm text-gray-400 leading-relaxed">
                                    {plot.desc}
                                </p>
                            </div>
                        </button>
                    ))}
                </div>

                {/* Footer */}
                <div className="pt-12 border-t border-white/10 text-center text-gray-500 text-sm">
                    Generated via automated EDA pipeline using Python (Pandas, Seaborn, Scikit-Learn).
                </div>
            </div>

            {/* Lightbox / Modal */}
            {selectedImage && (
                <div
                    className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-200"
                    onClick={() => setSelectedImage(null)}
                >
                    <button
                        onClick={() => setSelectedImage(null)}
                        className="absolute top-4 right-4 md:top-8 md:right-8 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-50"
                    >
                        <X className="h-8 w-8" />
                    </button>

                    <div
                        className="relative w-full max-w-6xl max-h-full aspect-[16/9] md:aspect-auto h-auto flex flex-col"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="relative w-full h-[60vh] md:h-[80vh]">
                            <Image
                                src={`/eda/${selectedImage.file}`}
                                alt={selectedImage.title}
                                fill
                                className="object-contain"
                                quality={100}
                            />
                        </div>
                        <div className="mt-4 text-center">
                            <h2 className="text-2xl font-bold text-white">{selectedImage.title}</h2>
                            <p className="text-gray-400 max-w-2xl mx-auto mt-2">{selectedImage.desc}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
