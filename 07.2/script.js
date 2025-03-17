// script.js - Country Facts Application

document.addEventListener("DOMContentLoaded", async function () {
    // Fetch all countries data from the REST Countries API
    const res = await fetch("https://restcountries.com/v3.1/all");
    let data = [];
    if (res.ok) {
        data = await res.json(); // Convert the response to JSON
    }
    
    // Object to track hierarchy of regions, subregions, and countries
    const hierarchy = {};
    
    // Populate hierarchy object with data from API
    data.forEach((country) => {
        const region = country.region || "Unknown";
        const subregion = country.subregion || "Unknown";
        const countryName = country.name.common;
        
        if (!hierarchy[region]) {
            hierarchy[region] = {}; // Initialize region if not exists
        }
        
        if (!hierarchy[region][subregion]) {
            hierarchy[region][subregion] = {}; // Initialize subregion if not exists
        }
        
        hierarchy[region][subregion][countryName] = country; // Store country data
    });
    
    // Get dropdown elements
    const regionSelect = document.getElementById("regions");
    const subregionSelect = document.getElementById("subregions");
    const countrySelect = document.getElementById("countries");
    const factsTable = document.getElementById("facts");
    
    // Function to update regions dropdown
    function updateRegions() {
        regionSelect.innerHTML = "<option value=''>Select a region</option>";
        Object.keys(hierarchy).forEach(region => {
            const option = document.createElement("option");
            option.value = region;
            option.textContent = region;
            regionSelect.appendChild(option);
        });
    }
    
    // Function to update subregions dropdown based on selected region
    function updateSubregions(region) {
        subregionSelect.innerHTML = "<option value=''>Select a subregion</option>";
        if (hierarchy[region]) {
            Object.keys(hierarchy[region]).forEach(subregion => {
                const option = document.createElement("option");
                option.value = subregion;
                option.textContent = subregion;
                subregionSelect.appendChild(option);
            });
        }
    }
    
    // Function to update countries dropdown based on selected subregion
    function updateCountries(region, subregion) {
        countrySelect.innerHTML = "<option value=''>Select a country</option>";
        if (hierarchy[region] && hierarchy[region][subregion]) {
            Object.keys(hierarchy[region][subregion]).forEach(country => {
                const option = document.createElement("option");
                option.value = country;
                option.textContent = country;
                countrySelect.appendChild(option);
            });
        }
    }
    
    // Function to display facts of the selected country
    function updateFacts(region, subregion, country) {
        const countryData = hierarchy[region][subregion][country];
        factsTable.innerHTML = `
            <tr><td>Name</td><td>${countryData.name.common}</td></tr>
            <tr><td>Capital</td><td>${countryData.capital ? countryData.capital[0] : "N/A"}</td></tr>
            <tr><td>Population</td><td>${countryData.population.toLocaleString()}</td></tr>
            <tr><td>Area</td><td>${countryData.area.toLocaleString()} km²</td></tr>
            <tr><td>Region</td><td>${countryData.region}</td></tr>
            <tr><td>Subregion</td><td>${countryData.subregion || "N/A"}</td></tr>
            <tr><td>Currency</td><td>${Object.values(countryData.currencies || {})[0]?.name || "N/A"}</td></tr>
            <tr><td>Languages</td><td>${Object.values(countryData.languages || {}).join(", ") || "N/A"}</td></tr>
            <tr><td>Flag</td><td><img src="${countryData.flags.png}" alt="${countryData.name.common} flag" width="100"></td></tr>
        `;
    }
    
    // Event listener for region selection
    regionSelect.addEventListener("change", function () {
        updateSubregions(regionSelect.value);
        subregionSelect.innerHTML = "<option value=''>Select a subregion</option>";
        countrySelect.innerHTML = "<option value=''>Select a country</option>";
        factsTable.innerHTML = "";
    });
    
    // Event listener for subregion selection
    subregionSelect.addEventListener("change", function () {
        updateCountries(regionSelect.value, subregionSelect.value);
        countrySelect.innerHTML = "<option value=''>Select a country</option>";
        factsTable.innerHTML = "";
    });
    
    // Event listener for country selection
    countrySelect.addEventListener("change", function () {
        updateFacts(regionSelect.value, subregionSelect.value, countrySelect.value);
    });
    
    // Initialize the regions dropdown
    updateRegions();
});
