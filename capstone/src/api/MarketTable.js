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
        const response  = await axios.get("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd",{
            params: finalParams
        });
        return response.data;
    }
    catch (error) {
        console.log("Error fetching data", error);
        throw error;
    }
}

export default MarketTable;