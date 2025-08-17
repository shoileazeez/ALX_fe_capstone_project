import axios from "axios"

const MarketTable = async (params={}) => {
    try {
        const defaultParams = {
            vs_currency: 'usd',
            order: 'market_cap_desc',
            per_page: 10,
            page: 1,
            price_change_percentage: '24h,7d',
            sparkline: true
        };

        // Merge user params with defaults
        const finalParams = { ...defaultParams, ...params };
        
        console.log("Making API request with params:", finalParams);
        
        // Use axios params to handle URL encoding properly
        const response = await axios.get("https://api.coingecko.com/api/v3/coins/markets", {
            params: finalParams,
            timeout: 10000, // 10 second timeout
        });
        
        console.log("API response received, data length:", response.data?.length);
        return response.data || [];
    }
    catch (error) {
        console.error("Error fetching market data:", error);
        if (error.response) {
            console.error("Response data:", error.response.data);
            console.error("Response status:", error.response.status);
        }
        throw error;
    }
}

export default MarketTable;