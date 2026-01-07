import Link from 'next/link';
import { ArrowRight, BarChart3, Globe, Activity, LineChart } from 'lucide-react';

export default function Home() {
  return (
    <div className="bg-background min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="relative pt-24 pb-32 overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-5xl font-bold tracking-tight text-foreground sm:text-7xl mb-6">
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-green-500">
                CLIMATRIX
              </span>
              Global Climate Analytics
            </h1>
            <p className="mt-6 text-xl leading-8 text-gray-400 max-w-2xl mx-auto">
              A high-precision, interactive research platform for exploring global climate change anomalies,
              CO2 emissions, and sea-level rise dynamics from 2000 to 2023.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/dashboard"
                className="rounded-full bg-blue-600 px-8 py-4 text-base font-semibold text-white shadow-lg hover:bg-blue-500 transition-all flex items-center gap-2"
              >
                Access Dashboard <ArrowRight className="h-5 w-5" />
              </Link>
              <Link href="#learn-more" className="text-base font-semibold leading-6 text-foreground hover:text-blue-400 transition-colors">
                Read methodology <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Background Grid Decoration */}
        <div className="absolute inset-0 -z-10 h-full w-full bg-grid"></div>
      </section>

      {/* Feature Grid */}
      <section className="py-24 bg-white/5 border-y border-white/10">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="space-y-4">
              <div className="h-12 w-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Activity className="h-6 w-6 text-blue-500" />
              </div>
              <h3 className="text-xl font-semibold text-white">Temporal Analysis</h3>
              <p className="text-gray-400">
                Analyze temperature anomalies and CO2 concentration trends over two decades with precise, interactive time-series visualizations.
              </p>
            </div>
            <div className="space-y-4">
              <div className="h-12 w-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                <Globe className="h-6 w-6 text-green-500" />
              </div>
              <h3 className="text-xl font-semibold text-white">Geospatial Insights</h3>
              <p className="text-gray-400">
                Explore country-level climate impacts through a high-fidelity interactive choropleth map with year-over-year comparison capabilities.
              </p>
            </div>
            <div className="space-y-4">
              <div className="h-12 w-12 rounded-lg bg-red-500/10 flex items-center justify-center">
                <LineChart className="h-6 w-6 text-red-500" />
              </div>
              <h3 className="text-xl font-semibold text-white">Multivariate Correlation</h3>
              <p className="text-gray-400">
                Understand the relationship between greenhouse gas emissions and global warming through direct correlation metrics and multivariate scaling.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Learn More / Methodology Section */}
      <section id="learn-more" className="py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-12">Methodology & Interpretation</h2>

            <div className="space-y-8">
              <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-3">Understanding Anomalies</h3>
                <p className="text-gray-400 leading-relaxed">
                  Global Temperature Anomaly refers to the deviation of the observed temperature from a specific long-term average (baseline).
                  A positive anomaly indicates observed temperatures were warmer than the baseline, while a negative anomaly indicates they were cooler.
                  This dashboard uses the 2000-2023 dataset average as the internal baseline for comparative visualization.
                </p>
              </div>

              <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-3">Data Sources</h3>
                <p className="text-gray-400 leading-relaxed">
                  The data presented in CLIMATRIX is derived from aggregate global climate records, processed to ensure consistency across temporal and spatial dimensions.
                  Metrics include Land Surface Temperature, CO2 Emissions (ppm), and Sea Level Rise (mm), standardized for analytical use.
                </p>
              </div>

              <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-3">Why This Matters</h3>
                <p className="text-gray-400 leading-relaxed">
                  Visualizing these trends is crucial for understanding the velocity of climate change.
                  The correlation between rising CO2 levels and temperature anomalies provides stark evidence of the greenhouse effect's impact on our global ecosystem.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
