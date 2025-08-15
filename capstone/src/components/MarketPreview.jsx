import React, { useState, useEffect } from 'react';
import MarketData from '../api/Market.js';

const MarketPreview = () => {
    const [cryptoData, setCryptoData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMarketData = async () => {
            try {
                setLoading(true);
                const data = await MarketData();
                setCryptoData(data);
                setError(null);
            } catch (err) {
                setError('Failed to fetch market data');
                console.error('Error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchMarketData();
    }, []);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: price < 1 ? 4 : 2
        }).format(price);
    };

    const formatPercentage = (percentage) => {
        const isPositive = percentage >= 0;
        return (
            <span className={`font-semibold ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                {isPositive ? '+' : ''}{percentage.toFixed(2)}%
            </span>
        );
    };

    if (loading) return (
        <div className="flex justify-center items-center py-12">
            <div className="text-lg text-gray-600">Loading market data...</div>
        </div>
    );
    
    if (error) return (
        <div className="flex justify-center items-center py-12">
            <div className="text-lg text-red-500">{error}</div>
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto p-6 bg-black">
            {/* Header Section */}
            <div className="mb-8 text-center">
                <h2 className="text-3xl font-bold text-white mb-2">Market at a glance</h2>
                <p className="text-gray-400">Top performing cryptocurrencies with live price data</p>
            </div>
            
            {/* Market Table */}
            <div className="bg-gray-900 rounded-lg shadow-lg border border-gray-800">
                <div className="px-6 py-4 border-b border-gray-800 bg-gray-800">
                    <h3 className="text-xl font-semibold text-white">Top 5 Cryptocurrencies</h3>
                </div>
                
                {/* Table Headers */}
                <div className="grid grid-cols-4 gap-4 px-6 py-3 bg-gray-800 border-b border-gray-700 font-semibold text-gray-300 text-sm">
                    <div>Name</div>
                    <div className="text-right">Price</div>
                    <div className="text-right">24h Change</div>
                    <div className="text-center">Trend</div>
                </div>

                {/* Crypto List */}
                <div className="divide-y divide-gray-800">
                    {cryptoData.map((crypto, index) => (
                        <div key={crypto.id} className="grid grid-cols-4 gap-4 px-6 py-4 hover:bg-gray-800 transition-colors">
                            {/* Name Column */}
                            <div className="flex items-center space-x-3">
                                <div className="flex items-center space-x-2">
                                    <span className="text-sm text-gray-400 font-medium w-6">{index + 1}</span>
                                    <img 
                                        src={crypto.image} 
                                        alt={crypto.name} 
                                        className="w-8 h-8 rounded-full"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-semibold text-white">{crypto.name}</span>
                                    <span className="text-sm text-gray-400 uppercase">{crypto.symbol}</span>
                                </div>
                            </div>
                            
                            {/* Price Column */}
                            <div className="text-right">
                                <span className="font-semibold text-white text-lg">
                                    {formatPrice(crypto.current_price)}
                                </span>
                            </div>
                            
                            {/* 24h Change Column */}
                            <div className="text-right">
                                {formatPercentage(crypto.price_change_percentage_24h)}
                            </div>
                            
                            {/* Trend Column */}
                            <div className="flex justify-center items-center">
                                <div className={`px-3 py-1 rounded-full text-sm ${
                                    crypto.price_change_percentage_24h >= 0 
                                        ? 'bg-green-900 text-green-400' 
                                        : 'bg-red-900 text-red-400'
                                }`}>
                                    {crypto.price_change_percentage_24h >= 0 ? '📈' : '📉'}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MarketPreview;