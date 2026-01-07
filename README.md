# CLIMATRIX
### Interactive Climate Change Dashboard
**Live Dashboard:** [Launch](https://climatrix-phi.vercel.app/)
**Data Visualization • Semester Project 2025**  
**Course Instructor:** Dr. Farah Saeed

**Team Members:**
- Muhammad Adeel 
- Nauman Ali Murad 

---

## 🌍 Abstract

CLIMATRIX is a research-grade interactive dashboard designed to visualize and analyze global climate change trends. It transforms complex environmental data into accessible insights through an innovative Bento Grid layout that simultaneously monitors key climate indicators.

The platform integrates a sophisticated AI-powered assistant leveraging Groq's Llama-3.3-70b model to provide real-time, context-aware answers about climate data patterns. This implementation bridges the gap between raw statistical information and actionable environmental knowledge, enabling researchers and policymakers to make data-driven decisions.

**Key monitored indicators** include temperature anomalies, atmospheric CO₂ concentrations, sea-level rise patterns, precipitation trends, and secondary meteorological variables across global and country-level granularity.

### Dashboard Highlights
- **23 Years** of Climate Data (2000-2022)
- **195+ Countries** with Spatial Coverage
- **6 Key Climate Indicators** Monitored
- **AI Assistant** Powered by Llama-3.3-70b

---

## 📊 Dataset

The research utilizes a comprehensive synthetic climate dataset spanning the period from 2000 to 2022, providing a controlled environment for visualization demonstration and algorithmic validation.

### Dataset Specifications
- **Source:** [Climate Insights Dataset (Kaggle)]
- **Temporal Coverage:** 2000-2022 (23 years)
- **Spatial Scale:** Global and Country-level granularity
- **Format:** CSV with consistent schema

### Key Variables
- **Temperature:** Global average surface temperature measured in degrees Celsius (°C)
- **CO₂ Emissions:** Atmospheric carbon dioxide concentration measured in parts per million (ppm)
- **Sea Level Rise:** Annual change in mean sea level measured in millimeters (mm)
- **Precipitation:** Annual rainfall totals measured in millimeters (mm)
- **Humidity:** Relative atmospheric humidity percentage
- **Wind Speed:** Average wind velocity in meters per second (m/s)

> **Data Integrity Note:** The dataset has been audited to ensure consistent formatting and completeness for visualization demonstration purposes. While it maintains realistic value ranges, it does not reflect actual physical relationships (e.g., the correlation between CO₂ and temperature is artificially decoupled for educational purposes).

---

## 🚀 Key Features

### Interactive Dashboard
- **Geospatial Visualization:** Interactive D3-based world map displaying annual temperature distributions by country
- **Dynamic Trend Analysis:** Multi-mode line charts allowing users to toggle between Temperature, CO₂, and Sea Level metrics
- **Correlation Analysis:** Scatter plots visualizing the relationship between CO₂ concentrations and global temperature anomalies
- **Regional Risk Assessment:** Ranked bar charts highlighting countries with the highest temperature volatility
- **Bento Grid Layout:** 12-column responsive system for simultaneous multi-metric monitoring

### AI Integration
- **Context-Aware Chatbot:** Built-in AI assistant powered by Groq (Llama-3.3-70b)
- **RAG Architecture:** Retrieval-Augmented Generation with custom audit context ensuring responses are grounded in the provided dataset
- **Real-time Inference:** Ultra-low latency responses for immediate data insights

### Technical Architecture
- **Responsive Design:** Optimized for large displays with responsive fallback for mobile devices
- **Performance:** Static Generation (SSG) for core dashboard views with client-side interactivity
- **Dark Mode:** Custom design system with Tailwind CSS utility-first approach

---

## 🛠️ Technologies & Architecture

The dashboard leverages a modern full-stack architecture combining cutting-edge frontend frameworks with high-performance AI inference capabilities.

### Frontend Framework
- **Next.js 16** - App Router with React Server Components
- **TypeScript** - Strict mode for type safety
- **Tailwind CSS** - Utility-first CSS with custom dark mode design system

### Data Visualization
- **Recharts** - Responsive line, bar, and scatter plots
- **D3.js** - Complex geospatial vector mapping and custom visualizations

### AI & Inference
- **Groq SDK** - Ultra-low latency inference
- **Llama-3.3-70b** - Large language model
- **RAG Architecture** - Retrieval-Augmented Generation with custom audit context

### Data Processing
- **Python (Pandas)** - Exploratory Data Analysis and preprocessing
- **Node.js** - Server-side data aggregation and API endpoints

---


---

## 📁 Project Structure

```
climatrix/
├── app/                    # Next.js App Router pages and API routes
│   ├── api/chat/          # AI assistant endpoint
│   ├── dashboard/         # Main dashboard page
│   ├── eda/              # Exploratory Data Analysis page
│   └── context/          # React Context providers
├── components/            # UI components
│   ├── charts/           # Visualization components (D3, Recharts)
│   └── ui/               # Reusable UI elements
├── public/data/          # JSON datasets and GeoJSON files
├── scripts/              # Data processing scripts (Node.js)
├── dataset/              # Raw CSV climate data
└── docs/                 # Documentation and EDA audit reports
```

---

## 🎓 Academic Context

**Course:** Data Visualization  
**Semester:** Spring 2025  
**Institution:** Ghulam Ishaq Khan Institute of Engineering Sciences and Technology
**Instructor:** Dr. Farah Saeed

This project serves as a comprehensive demonstration of modern data visualization techniques, combining interactive frontend design with AI-powered data interpretation for climate science applications.

---

## 📄 License

© 2025 CLIMATRIX Research Project. Licensed under MIT.

---

## 🔗 Links

- **Live Dashboard:** [Launch](https://climatrix-phi.vercel.app/)
- **GitHub Repository:** [View on GitHub](https://github.com/adeelkh21/climatrix)

---

**Built with Next.js • Deployed on Vercel • Data Analysis with Python**
