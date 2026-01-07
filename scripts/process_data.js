const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../dataset');
const OUTPUT_DIR = path.join(__dirname, '../public/data');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

function parseCSV(content) {
  const lines = content.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim());
  
  const data = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(','); // Assuming no commas in values based on file preview
    if (values.length !== headers.length) continue;
    
    const row = {};
    headers.forEach((h, index) => {
      let value = values[index].trim();
      if (h === 'Date') {
        value = new Date(value).toISOString();
      } else if (h === 'Country' || h === 'Location') {
        // Keep string
      } else {
        value = parseFloat(value);
      }
      row[h] = value;
    });
    delete row['Location']; // Drop erroneous column
    data.push(row);
  }
  return data;
}

function processData() {
  const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.csv'));
  
  let allData = [];
  
  for (const file of files) {
    console.log(`Processing ${file}...`);
    const content = fs.readFileSync(path.join(DATA_DIR, file), 'utf-8');
    const records = parseCSV(content);
    allData = allData.concat(records);
  }
  
  // Basic Sorting
  allData.sort((a, b) => new Date(a.Date) - new Date(b.Date));

  // Derived Metrics: Annual Averages
  const yearlyData = {};
  const countryData = {};

  allData.forEach(d => {
    const year = new Date(d.Date).getFullYear();
    
    // Global
    if (!yearlyData[year]) {
      yearlyData[year] = { count: 0, temp: 0, co2: 0, sea: 0, precip: 0, humidity: 0, wind: 0 };
    }
    yearlyData[year].count++;
    yearlyData[year].temp += d.Temperature;
    yearlyData[year].co2 += d['CO2 Emissions'];
    yearlyData[year].sea += d['Sea Level Rise'];
    yearlyData[year].precip += d.Precipitation;
    yearlyData[year].humidity += d.Humidity;
    yearlyData[year].wind += d['Wind Speed'];

    // Country
    const country = d.Country;
    if (!countryData[country]) countryData[country] = {};
    if (!countryData[country][year]) {
        countryData[country][year] = { count: 0, temp: 0, co2: 0, sea: 0 };
    }
    countryData[country][year].count++;
    countryData[country][year].temp += d.Temperature;
    countryData[country][year].co2 += d['CO2 Emissions'];
    countryData[country][year].sea += d['Sea Level Rise'];
  });

  const globalTrends = Object.keys(yearlyData).sort().map(year => {
    const y = yearlyData[year];
    return {
      year: parseInt(year),
      temp: y.temp / y.count,
      co2: y.co2 / y.count,
      sea: y.sea / y.count,
      precip: y.precip / y.count,
      humidity: y.humidity / y.count,
      wind: y.wind / y.count
    };
  });

  // Write outputs
  fs.writeFileSync(path.join(OUTPUT_DIR, 'raw_data.json'), JSON.stringify(allData));
  fs.writeFileSync(path.join(OUTPUT_DIR, 'global_trends.json'), JSON.stringify(globalTrends));
  
  // Aggregate country output
  const countryTrends = {};
  Object.keys(countryData).forEach(c => {
      countryTrends[c] = Object.keys(countryData[c]).map(y => ({
          year: parseInt(y),
          temp: countryData[c][y].temp / countryData[c][y].count,
          co2: countryData[c][y].co2 / countryData[c][y].count,
          sea: countryData[c][y].sea / countryData[c][y].count
      })).sort((a,b) => a.year - b.year);
  });
  
  fs.writeFileSync(path.join(OUTPUT_DIR, 'country_trends.json'), JSON.stringify(countryTrends));

  console.log('Data processing complete.');
}

processData();
