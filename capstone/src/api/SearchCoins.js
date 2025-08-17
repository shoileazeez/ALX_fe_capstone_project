import axios from "axios";

const SearchCoins = async (query) => {
    try {
        if (!query || query.trim() === '') {
            return [];
        }

        // Use CoinGecko's search endpoint
        const response = await axios.get(`https://api.coingecko.com/api/v3/search?query=${encodeURIComponent(query)}`);
        
        // Extract coin data from search results
        const searchResults = response.data.coins || [];
        
        // Get detailed market data for the first 50 search results
        if (searchResults.length > 0) {
            const coinIds = searchResults.slice(0, 50).map(coin => coin.id).join(',');
            
            const marketResponse = await axios.get(`https://api.coingecko.com/api/v3/coins/markets`, {
                params: {
                    vs_currency: 'usd',
                    ids: coinIds,
                    order: 'market_cap_desc',
                    per_page: 50,
                    page: 1,
                    sparkline: true,
                    price_change_percentage: '24h,7d'
                }
            });
            
            return marketResponse.data;
        }
        
        return [];
    } catch (error) {
        console.error("Error searching coins:", error);
        throw error;
    }
};

export default SearchCoins;
