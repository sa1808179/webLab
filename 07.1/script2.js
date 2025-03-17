// Advanced Practice Question 2: Live Cryptocurrency Price Tracker
// Description: Fetches and updates real-time cryptocurrency prices.

document.addEventListener("DOMContentLoaded", function () {
    const cryptoList = document.getElementById("crypto-list");
    const refreshButton = document.getElementById("refresh-button");
    
    // Function to fetch cryptocurrency prices
    async function fetchCryptoPrices() {
        try {
            const res = await fetch("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd");
            if (!res.ok) {
                throw new Error("Failed to fetch crypto prices");
            }
            const data = await res.json();
            displayCryptoPrices(data);
        } catch (error) {
            cryptoList.innerHTML = `<p class='error'>⚠️ ${error.message}</p>`;
        }
    }
    
    // Function to display cryptocurrency prices
    function displayCryptoPrices(data) {
        cryptoList.innerHTML = ""; // Clear the list
        data.slice(0, 5).forEach(crypto => {
            const li = document.createElement("li");
            li.innerHTML = `
                <img src="${crypto.image}" width="30" alt="${crypto.name} logo"> 
                ${crypto.name} (${crypto.symbol.toUpperCase()}): $${crypto.current_price.toFixed(2)}
            `;
            cryptoList.appendChild(li);
        });
    }
    
    // Event listener for refresh button
    refreshButton.addEventListener("click", fetchCryptoPrices);
    
    fetchCryptoPrices(); // Fetch prices on page load
});
