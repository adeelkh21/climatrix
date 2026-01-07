'use client';

import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface WorldMapProps {
    countryData: any;
    year: number;
    onCountryClick?: (name: string) => void;
    activeRegion?: string | null;
}

export function WorldMap({ countryData, year, onCountryClick, activeRegion }: WorldMapProps) {
    const svgRef = useRef<SVGSVGElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const [geoData, setGeoData] = useState<any>(null);
    const [tooltip, setTooltip] = useState<{ x: number, y: number, content: string | null }>({ x: 0, y: 0, content: null });
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    useEffect(() => {
        const resizeObserver = new ResizeObserver((entries) => {
            if (entries[0]) {
                const { width, height } = entries[0].contentRect;
                setDimensions({ width, height });
            }
        });

        if (wrapperRef.current) {
            resizeObserver.observe(wrapperRef.current);
        }

        return () => resizeObserver.disconnect();
    }, []);

    useEffect(() => {
        fetch('/data/world.geojson')
            .then(res => res.json())
            .then(data => setGeoData(data));
    }, []);

    useEffect(() => {
        if (!geoData || !svgRef.current || !wrapperRef.current || dimensions.width === 0 || dimensions.height === 0) return;

        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        const { width, height } = dimensions;

        // Responsive projection using fitSize to maximize filling the container
        const projection = d3.geoMercator()
            .fitSize([width, height], geoData);

        const path = d3.geoPath().projection(projection);

        // Add zoom behavior
        const zoom = d3.zoom<SVGSVGElement, unknown>()
            .scaleExtent([1, 8])
            .on('zoom', (event) => {
                g.attr('transform', event.transform);
            });

        svg.call(zoom);

        // Create a group for the map paths
        const g = svg.append("g");

        // Color Scale - Domain based on typical temperature range
        const colorScale = d3.scaleSequential(d3.interpolateSpectral)
            .domain([30, -10]); // Inverted for Spectral (Red = Hot)

        // Draw Map
        g.selectAll("path")
            .data(geoData.features)
            .join("path")
            .attr("d", path as any)
            .attr("fill", (d: any) => {
                const countryName = d.properties.name;
                const record = countryData[countryName]?.find((r: any) => r.year === year);
                return record ? colorScale(record.temp) : '#27272a'; // Neutral gray for no data
            })
            .attr("stroke", "#18181b")
            .attr("stroke-width", 0.5)
            .style("cursor", "pointer")
            .on("click", (event, d: any) => {
                if (onCountryClick) {
                    onCountryClick(d.properties.name);
                }
            })
            .on("mousemove", function (event, d: any) {
                const countryName = d.properties.name;
                const record = countryData[countryName]?.find((r: any) => r.year === year);

                let content = '';
                if (record) {
                    content = `
                <div class="font-bold">${countryName}</div>
                <div class="text-sm">Temperature: ${record.temp.toFixed(1)}°C</div>
                <div class="text-xs text-gray-400">Year: ${year}</div>
            `;
                } else {
                    content = `<div class="font-bold">${countryName}</div><div class="text-xs text-gray-500">No data</div>`;
                }

                d3.select(this).attr("stroke", "#fff").attr("stroke-width", 1.5);
                setTooltip({
                    x: event.pageX,
                    y: event.pageY,
                    content
                });
            })
            .on("mouseout", function () {
                d3.select(this).attr("stroke", "#18181b").attr("stroke-width", 0.5);
                setTooltip({ x: 0, y: 0, content: null });
            });


    }, [geoData, countryData, year, dimensions]);

    return (
        <Card className="bg-white/5 border-white/10 text-white shadow-xl relative overflow-hidden h-full flex flex-col">
            <CardHeader>
                <CardTitle>Geospatial Temperature Distribution</CardTitle>
                <CardDescription>Average annual temperature by country for {year}</CardDescription>
            </CardHeader>
            <CardContent className="p-0 flex-1 min-h-0">
                <div ref={wrapperRef} className="w-full h-full relative bg-[#0a0a0a]">
                    <svg ref={svgRef} width="100%" height="100%" className="block" />

                    {/* Custom Tooltip Portal */}
                    {tooltip.content && (
                        <div
                            className="fixed z-50 bg-black/90 border border-white/20 p-3 rounded-lg shadow-2xl pointer-events-none transform -translate-x-1/2 -translate-y-full mb-2"
                            style={{ left: tooltip.x, top: tooltip.y }}
                            dangerouslySetInnerHTML={{ __html: tooltip.content }}
                        />
                    )}

                    {/* Legend Overlay */}
                    <div className="absolute bottom-4 left-4 bg-black/80 p-3 rounded-md border border-white/10 text-xs">
                        <div className="mb-1 font-semibold">Temp (°C)</div>
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-[#d53e4f]"></div> &gt; 25°C</div>
                            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-[#fee08b]"></div> 10 - 25°C</div>
                            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-[#3288bd]"></div> &lt; 10°C</div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
