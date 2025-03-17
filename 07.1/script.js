//Modify the Country Facts Application so that users can search for a country by name instead of selecting from a dropdown.

//Implement a search input field where users type a country name.
//Fetch data asynchronously from the REST Countries API.
//Display matching country facts dynamically in a table.
//If no matching country is found, show a warning message.
//Expected UI & Functionality:
//✅ User types in a country name.
//✅ Fetches data dynamically and displays facts.
//✅ Shows an error message if no country is found.


document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("search-country");
    const factsTable = document.getElementById("facts");

    async function fetchCountryData(countryName) {
        try {
            const res = await fetch(`https://restcountries.com/v3.1/name/${countryName}`);
            if (!res.ok) {
                throw new Error("Country not found.");
            }
            const data = await res.json();
            displayCountryFacts(data[0]); // Display the first matching country
        } catch (error) {
            factsTable.innerHTML = `<tr><td colspan="2">⚠️ ${error.message}</td></tr>`;
        }
    }

    function displayCountryFacts(country) {
        factsTable.innerHTML = `
            <tr><td>Name</td><td>${country.name.common}</td></tr>
            <tr><td>Capital</td><td>${country.capital ? country.capital[0] : "N/A"}</td></tr>
            <tr><td>Population</td><td>${country.population.toLocaleString()}</td></tr>
            <tr><td>Area</td><td>${country.area.toLocaleString()} km²</td></tr>
            <tr><td>Region</td><td>${country.region}</td></tr>
            <tr><td>Currency</td><td>${Object.values(country.currencies || {})[0]?.name || "N/A"}</td></tr>
            <tr><td>Languages</td><td>${Object.values(country.languages || {}).join(", ") || "N/A"}</td></tr>
            <tr><td>Flag</td><td><img src="${country.flags.png}" alt="Flag" width="100"></td></tr>
        `;
    }

    // Event Listener for search input
    searchInput.addEventListener("input", function () {
        const countryName = searchInput.value.trim();
        if (countryName) {
            fetchCountryData(countryName);
        } else {
            factsTable.innerHTML = ""; // Clear table if input is empty
        }
    });
});