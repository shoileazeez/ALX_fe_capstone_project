import axios from "axios"

const coinDetails = async (coinId) => {
    try {
         const response = await axios.get(`https://api.coingecko.com/api/v3/coins/${coinId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=true`);
         return response.data;
    }
    catch (error) {
        console.log("error fetching coin details", error);
        throw error;
    }
}

export default coinDetails;