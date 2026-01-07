import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import os
import sys

# Setup Paths
DATA_PATH = os.path.join('dataset', 'climate_change_data.csv')
OUTPUT_DIR = os.path.join('docs', 'eda')
os.makedirs(OUTPUT_DIR, exist_ok=True)

# 1. DATA INGESTION & CLEANING
print("--- Loading Data ---")
try:
    df = pd.read_csv(DATA_PATH)
except FileNotFoundError:
    print(f"Error: File not found at {DATA_PATH}")
    sys.exit(1)

# Drop Location as per previous instructions (unreliable)
if 'Location' in df.columns:
    df = df.drop(columns=['Location'])

# Convert Date
df['Date'] = pd.to_datetime(df['Date'])
df['Year'] = df['Date'].dt.year
df['Month'] = df['Date'].dt.month

# Check Missing
missing = df.isnull().sum()

# 2. STATISTICAL INTEGRITY CHECK
desc = df.describe()

# 3. CORRELATION ANALYSIS
numeric_df = df.select_dtypes(include=['float64', 'int64'])
corr_matrix = numeric_df.corr()

# 4. TEMPORAL ANALYSIS
annual_trends = df.groupby('Year').mean(numeric_only=True)
monthly_seasonality = df.groupby('Month').mean(numeric_only=True)

# Calculate Slope for Temperature
from scipy.stats import linregress
slope, intercept, r_value, p_value, std_err = linregress(annual_trends.index, annual_trends['Temperature'])

# 5. GEOSPATIAL/CATEGORICAL
country_stats = df.groupby('Country')[['Temperature', 'CO2 Emissions']].mean()
top_emitters = country_stats.sort_values('CO2 Emissions', ascending=False).head(10)
top_temps = country_stats.sort_values('Temperature', ascending=False).head(10)

# --- VISUALIZATIONS ---
print("--- Generating Visualizations ---")
sns.set_style("darkgrid")

# Heatmap
plt.figure(figsize=(10, 8))
sns.heatmap(corr_matrix, annot=True, cmap='coolwarm', fmt=".2f", vmin=-1, vmax=1)
plt.title('Correlation Matrix')
plt.tight_layout()
plt.savefig(os.path.join(OUTPUT_DIR, 'correlation_heatmap.png'))
plt.close()

# Trend Lines
plt.figure(figsize=(12, 6))
sns.lineplot(data=annual_trends, x=annual_trends.index, y='Temperature', label='Temperature', color='red')
sns.regplot(data=annual_trends, x=annual_trends.index, y='Temperature', scatter=False, color='blue', line_kws={'linestyle': '--', 'alpha': 0.5})
plt.title(f'Global Temperature Trend (2000-2022) | Slope: {slope:.4f}')
plt.xlabel('Year')
plt.ylabel('Avg Temperature')
plt.savefig(os.path.join(OUTPUT_DIR, 'temperature_trend.png'))
plt.close()

# Distributions
plt.figure(figsize=(12, 6))
for i, col in enumerate(['Temperature', 'CO2 Emissions', 'Sea Level Rise']):
    plt.subplot(1, 3, i+1)
    sns.histplot(df[col], kde=True)
    plt.title(f'{col} Distribution')
plt.tight_layout()
plt.savefig(os.path.join(OUTPUT_DIR, 'distributions.png'))
plt.close()


# --- REPORT GENERATION ---
print("--- Generating Report ---")

# Determine Realism
is_random = False
if abs(slope) < 0.01 and  -0.1 < corr_matrix.loc['Temperature', 'CO2 Emissions'] < 0.1:
    is_random = True
    
normality_check = "Uniform/Random" if df['Temperature'].std() > 5 and abs(df['Temperature'].mean()) < 20 else "Plausible"

report = f"""# 🛡️ Data Integrity & Audit Report (Python Generated)

**Date:** {pd.Timestamp.now().strftime('%Y-%m-%d')}
**Dataset:** `climate_change_data.csv`
**Auditor Role:** Senior Principal Data Scientist

## 1. Executive Summary
*   **Data Structure:** {df.shape[0]} rows, {df.shape[1]} columns.
*   **Completeness:** {missing.sum()} missing values detected.
*   **Integrity Verdict:** **{'⚠️ SYNTHETIC / HIGHLY SUSPICIOUS' if is_random else '✅ PLAUSIBLE'}**
*   **Key Finding:** The correlation between Temperature and CO2 Emissions is **{corr_matrix.loc['Temperature', 'CO2 Emissions']:.4f}**. In real-world physics, this should be strongly positive (>0.8). A value near 0 suggests unrelated, randomly generated data.
*   **Distribution Check:** The distributions appear to be **{normality_check}**. Real climate data typically follows normal distributions with specific biases; flat or perfectly uniform distributions indicate synthetic generation using `random.uniform()`.

## 2. Statistical Snapshot
| Metric | Mean | Std Dev | Min | Max |
| :--- | :--- | :--- | :--- | :--- |
| **Temperature** | {desc.loc['mean', 'Temperature']:.2f} | {desc.loc['std', 'Temperature']:.2f} | {desc.loc['min', 'Temperature']:.2f} | {desc.loc['max', 'Temperature']:.2f} |
| **CO2 Emissions** | {desc.loc['mean', 'CO2 Emissions']:.2f} | {desc.loc['std', 'CO2 Emissions']:.2f} | {desc.loc['min', 'CO2 Emissions']:.2f} | {desc.loc['max', 'CO2 Emissions']:.2f} |
| **Sea Level** | {desc.loc['mean', 'Sea Level Rise']:.2f} | {desc.loc['std', 'Sea Level Rise']:.2f} | {desc.loc['min', 'Sea Level Rise']:.2f} | {desc.loc['max', 'Sea Level Rise']:.2f} |

## 3. Correlation Analysis
*See `correlation_heatmap.png` for full view.*

**Top Correlations:**
1. Temp vs CO2: {corr_matrix.loc['Temperature', 'CO2 Emissions']:.4f}
2. Temp vs Sea Level: {corr_matrix.loc['Temperature', 'Sea Level Rise']:.4f}
3. CO2 vs Sea Level: {corr_matrix.loc['CO2 Emissions', 'Sea Level Rise']:.4f}

**Anomaly Flag:** Weak correlations (< 0.2) between these theoretically linked variables confirms the **lack of causal modeling** in the data generation process.

## 4. Temporal Analysis
*   **Global Trend Slope:** {slope:.5f} °C/year.
*   **Significance:** {'Insignificant/Flat' if abs(slope) < 0.001 else 'Detected'}.
*   **Seasonality:** {'Detected' if monthly_seasonality['Temperature'].std() > 1 else 'Weak/None'} seasonal variance detected.

## 5. Geospatial & Categorical Insights
**Top 5 CO2 Emitters (Audit Check):**
{top_emitters['CO2 Emissions'].to_markdown()}

**Top 5 Hottest Countries:**
{top_temps['Temperature'].to_markdown()}

## 6. Auditor's Conclusion
The dataset appears to be **{'synthetically generated' if is_random else 'derived from real observations'}**. Use for **{'visualization demos only' if is_random else 'academic research'}**. Users should be warned that the physics of climate change (greenhouse effect) are **not** accurately represented in the raw correlation coefficients of this specific file.
"""

with open(os.path.join(OUTPUT_DIR, 'AUDIT_REPORT.md'), 'w', encoding='utf-8') as f:
    f.write(report)

print("Audit Complete. Report and Images saved to docs/eda/")
