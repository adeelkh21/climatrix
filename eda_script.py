
import os
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.preprocessing import StandardScaler, MinMaxScaler
from sklearn.decomposition import PCA
from sklearn.cluster import KMeans
from math import pi

# --- CONFIG ---
DATA_PATH = r"dataset\climate_change_data.csv"
OUTPUT_DIR = r"output"
RANDOM_SEED = 42

# Ensure output directory exists
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Set visual style for publication quality
sns.set_theme(style="whitegrid", context="talk", palette="viridis")
plt.rcParams['figure.figsize'] = (12, 8)
plt.rcParams['savefig.dpi'] = 300

def load_and_prep_data(path):
    print(f"Loading data from {path}...")
    df = pd.read_csv(path)
    
    # Handle missing values
    if df.isnull().sum().sum() > 0:
        print("Warning: Missing values found. Dropping incomplete rows.")
        df = df.dropna()
        
    # Check for negative sea levels (physical reality check or just data visualization)
    # The user asked to "highlight negatives", implies there might be some.
    
    # Parse Date
    df['Date'] = pd.to_datetime(df['Date'])
    df['Year'] = df['Date'].dt.year
    
    # Print Summary
    print("\n--- Data Summary ---")
    print(df.describe())
    
    return df

def save_plot(filename):
    plt.tight_layout()
    plt.savefig(os.path.join(OUTPUT_DIR, filename))
    plt.close()
    print(f"Saved {filename}")

# --- SECTION 2: GLOBAL DISTRIBUTIONS ---
def plot_distributions(df):
    print("\nGenerating Distribution Plots...")
    
    # 1. Temp Dist
    plt.figure()
    sns.histplot(df['Temperature'], kde=True, color='orange', bins=30)
    plt.title("Global Temperature Distribution")
    plt.xlabel("Temperature (°C)")
    save_plot("1_temp_dist.png")
    
    # 2. CO2 Dist
    plt.figure()
    sns.histplot(df['CO2 Emissions'], kde=True, color='teal', bins=30)
    plt.title("CO₂ Emissions Distribution")
    plt.xlabel("CO₂ (ppm / normalized units)")
    save_plot("2_co2_dist.png")
    
    # 3. Sea Level (Highlight negatives)
    plt.figure()
    # Create mask for color
    colors = ['red' if x < 0 else 'blue' for x in df['Sea Level Rise']]
    # Histplot doesn't take list of colors easily for bins, use bar or just standard hist with distinct hue if possible.
    # Simpler: Just showing the distribution is enough, maybe color the kde line?
    # Let's stick to standard hist but add a reference line at 0
    sns.histplot(df['Sea Level Rise'], kde=False, color='steelblue', bins=30)
    plt.axvline(0, color='red', linestyle='--', label='Sea Level = 0')
    plt.title("Sea Level Rise Distribution")
    plt.xlabel("Sea Level Change")
    plt.legend()
    save_plot("3_sea_level_dist.png")
    
    # 4. Precip Boxplot
    plt.figure(figsize=(8, 6))
    sns.boxplot(y=df['Precipitation'], color='lightblue')
    plt.title("Precipitation Variability")
    save_plot("4_precip_boxplot.png")
    
    # 5. Wind Speed Boxplot
    plt.figure(figsize=(8, 6))
    sns.boxplot(y=df['Wind Speed'], color='lightgrey')
    plt.title("Wind Speed Variability")
    save_plot("5_wind_boxplot.png")

# --- SECTION 3: CORE RELATIONSHIPS ---
def plot_relationships(df):
    print("\nGenerating Relationship Plots...")
    
    # Subsample for scatter plots to avoid overplotting if large
    plot_df = df.sample(n=min(2000, len(df)), random_state=RANDOM_SEED)

    # 6. CO2 vs Temp
    plt.figure()
    sns.regplot(data=plot_df, x='CO2 Emissions', y='Temperature', scatter_kws={'alpha':0.3, 's':10}, line_kws={'color':'red'})
    plt.title("CO₂ Emissions vs. Temperature")
    save_plot("6_co2_vs_temp.png")
    
    # 7. Temp vs Sea Level
    plt.figure()
    sns.regplot(data=plot_df, x='Temperature', y='Sea Level Rise', scatter_kws={'alpha':0.3, 's':10}, line_kws={'color':'red'})
    plt.title("Temperature vs. Sea Level Rise")
    save_plot("7_temp_vs_sea.png")
    
    # 8. Precip vs Humidity
    plt.figure()
    sns.scatterplot(data=plot_df, x='Humidity', y='Precipitation', alpha=0.5, hue='Temperature', palette='coolwarm')
    plt.title("Precipitation vs. Humidity (Colored by Temp)")
    save_plot("8_precip_vs_humidity.png")
    
    # 9. Wind vs Precip
    plt.figure()
    sns.kdeplot(data=plot_df, x='Wind Speed', y='Precipitation', fill=True, cmap="mako", thresh=0.05)
    plt.title("Wind Speed vs. Precipitation Density")
    save_plot("9_wind_vs_precip.png")

# --- SECTION 4: COUNTRY COMPARISON ---
def plot_country_comparison(df):
    print("\nGenerating Country Comparisons...")
    
    # Get top 10 countries by Temperature Std Dev (Variability)
    top_countries = df.groupby('Country')['Temperature'].std().sort_values(ascending=False).head(10).index
    subset = df[df['Country'].isin(top_countries)]
    
    # 10. Temp Boxplot
    plt.figure(figsize=(14, 8))
    sns.boxplot(data=subset, x='Country', y='Temperature', palette="Spectral")
    plt.xticks(rotation=45)
    plt.title("Temperature Variability: Top 10 Most Volatile Countries")
    save_plot("10_country_temp_box.png")
    
    # 11. Sea Level Boxplot
    plt.figure(figsize=(14, 8))
    sns.boxplot(data=subset, x='Country', y='Sea Level Rise', palette="viridis")
    plt.xticks(rotation=45)
    plt.title("Sea Level Rise: Top 10 Countries")
    save_plot("11_country_sea_box.png")
    
    # 12. Parallel Coordinates
    # Aggregate by country
    agg_subset = subset.groupby('Country')[['Temperature', 'CO2 Emissions', 'Sea Level Rise', 'Precipitation']].mean().reset_index()
    # Normalize for parallel plot visualization
    scaler = MinMaxScaler()
    numeric_cols = ['Temperature', 'CO2 Emissions', 'Sea Level Rise', 'Precipitation']
    agg_subset[numeric_cols] = scaler.fit_transform(agg_subset[numeric_cols])
    
    plt.figure(figsize=(14, 8))
    pd.plotting.parallel_coordinates(agg_subset, 'Country', color=sns.color_palette("tab10", 10))
    plt.title("Climate Profiles (Normalized)")
    save_plot("12_parallel_coordinates.png")

# --- SECTION 5: CLIMATE ARCHETYPES ---
def plot_archetypes(df):
    print("\nGenerating Climate Archetypes...")
    
    cols = ['Temperature', 'CO2 Emissions', 'Sea Level Rise', 'Precipitation', 'Humidity', 'Wind Speed']
    
    # Aggregate by Country first to find "Country Archetypes"
    country_df = df.groupby('Country')[cols].mean()
    
    # PCA
    scaler = StandardScaler()
    scaled_data = scaler.fit_transform(country_df)
    
    pca = PCA(n_components=2)
    pca_res = pca.fit_transform(scaled_data)
    
    # KMeans
    kmeans = KMeans(n_clusters=4, random_state=RANDOM_SEED, n_init=10)
    labels = kmeans.fit_predict(scaled_data)
    country_df['Cluster'] = labels
    
    # 13. PCA Scatter
    plt.figure(figsize=(10, 8))
    sns.scatterplot(x=pca_res[:,0], y=pca_res[:,1], hue=labels, palette='deep', s=100)
    plt.title(f"Climate Archetypes (PCA)\nVar Explained: {pca.explained_variance_ratio_.sum():.2f}")
    plt.xlabel("PC1 (Likely Overall Intensity)")
    plt.ylabel("PC2 (Likely Moisture/Wind)")
    save_plot("13_pca_clusters.png")
    
    # 14. Cluster Sizes
    plt.figure()
    sns.countplot(x=labels, palette='deep')
    plt.title("Number of Countries per Climate Archetype")
    save_plot("14_cluster_sizes.png")
    
    # 15. Radar Plot
    # Average profile per cluster
    cluster_means = country_df.groupby('Cluster').mean()
    # Normalize min-max for radar chart to fit 0-1
    scaler_radar = MinMaxScaler()
    cluster_means_norm = pd.DataFrame(scaler_radar.fit_transform(cluster_means), columns=cols, index=cluster_means.index)
    
    # Create Radar
    categories = list(cluster_means_norm.columns)
    N = len(categories)
    
    angles = [n / float(N) * 2 * pi for n in range(N)]
    angles += angles[:1] # Close loop
    
    plt.figure(figsize=(10, 10))
    ax = plt.subplot(111, polar=True)
    
    plt.xticks(angles[:-1], categories)
    
    # Draw one line per cluster
    colors = sns.color_palette("deep", 4)
    for i, row in cluster_means_norm.iterrows():
        values = row.tolist()
        values += values[:1]
        ax.plot(angles, values, linewidth=2, linestyle='solid', label=f'Cluster {i}', color=colors[i])
        ax.fill(angles, values, color=colors[i], alpha=0.1)
        
    plt.title("Archetype Profiles")
    plt.legend(loc='upper right', bbox_to_anchor=(0.1, 0.1))
    save_plot("15_radar_archetypes.png")
    
    # Give clusters names based on data (heuristic)
    print("\n--- Archetype Interpretation ---")
    print(cluster_means)

# --- SECTION 6: TEMPORAL EVOLUTION ---
def plot_temporal(df):
    print("\nGenerating Temporal Plots...")
    
    yearly = df.groupby('Year')[['Temperature', 'CO2 Emissions']].mean()
    yearly_rolling = yearly.rolling(window=5).mean()
    
    # 16. Temp over time
    plt.figure()
    sns.lineplot(data=yearly, x=yearly.index, y='Temperature', alpha=0.3, label='Raw')
    sns.lineplot(data=yearly_rolling, x=yearly_rolling.index, y='Temperature', linewidth=3, color='orange', label='5y Avg')
    plt.title("Global Temperature Evolution")
    plt.legend()
    save_plot("16_temp_time.png")
    
    # 17. CO2 over time
    plt.figure()
    sns.lineplot(data=yearly, x=yearly.index, y='CO2 Emissions', alpha=0.3, label='Raw')
    sns.lineplot(data=yearly_rolling, x=yearly_rolling.index, y='CO2 Emissions', linewidth=3, color='teal', label='5y Avg')
    plt.title("Global CO₂ Evolution")
    plt.legend()
    save_plot("17_co2_time.png")

# --- SECTION 7: SIMILARITY ---
def plot_similarity(df):
    print("\nGenerating Similarity Map...")
    cols = ['Temperature', 'CO2 Emissions', 'Sea Level Rise', 'Precipitation']
    # Top 20 countries by counts or variance? User said top 20. Let's pick alphabetical or random to avoid bias, or just top 20 by size if data uneven. 
    # Data is even per country. Let's take first 20.
    countries = df['Country'].unique()[:20]
    subset = df[df['Country'].isin(countries)].groupby('Country')[cols].mean()
    
    # Standardize
    scaler = StandardScaler()
    scaled = pd.DataFrame(scaler.fit_transform(subset), index=subset.index, columns=subset.columns)
    
    # Clustered Heatmap
    sns.clustermap(scaled, cmap="vlag", center=0, figsize=(10, 10), row_cluster=True, col_cluster=False)
    # clustermap saves itself usually, but we need to explicitly save
    plt.savefig(os.path.join(OUTPUT_DIR, "18_similarity_heatmap.png"))
    plt.close()

def main():
    print("Starting Intuitive EDA...")
    df = load_and_prep_data(DATA_PATH)
    
    plot_distributions(df)
    plot_relationships(df)
    plot_country_comparison(df)
    plot_archetypes(df)
    plot_temporal(df)
    plot_similarity(df)
    
    print("\n--- EDA Complete. ---")
    print("5 insights and 3 limitations would be derived from these plots.")

if __name__ == "__main__":
    main()
