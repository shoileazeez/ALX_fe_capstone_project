import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import axios from 'axios';

const PriceChart = ({ coinId }) => {
    const [chartData, setChartData] = useState([]);
    const [timeFrame, setTimeFrame] = useState('7');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const timeFrames = [
        { label: '24H', value: '1' },
        { label: '7D', value: '7' },
        { label: '30D', value: '30' }
    ];

    useEffect(() => {
        fetchChartData();
    }, [coinId, timeFrame]);

    const fetchChartData = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await axios.get(
                `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${timeFrame}`
            );
            
            const prices = response.data.prices;
            const formattedData = prices.map((price, index) => {
                const date = new Date(price[0]);
                let label;
                
                if (timeFrame === '1') {
                    // For 24H, show hours
                    label = date.toLocaleTimeString('en-US', { 
                        hour: '2-digit', 
                        minute: '2-digit',
                        hour12: false 
                    });
                } else {
                    // For 7D and 30D, show days
                    const dayNumber = Math.floor(index / (prices.length / parseInt(timeFrame))) + 1;
                    label = `Day ${dayNumber}`;
                }
                
                return {
                    time: price[0],
                    price: price[1],
                    label: label,
                    formattedPrice: `$${price[1].toLocaleString(undefined, { 
                        minimumFractionDigits: 2, 
                        maximumFractionDigits: 2 
                    })}`
                };
            });

            // Sample data points for cleaner chart
            const sampleSize = timeFrame === '1' ? 24 : parseInt(timeFrame);
            const sampledData = [];
            const step = Math.floor(formattedData.length / sampleSize);
            
            for (let i = 0; i < formattedData.length; i += step) {
                sampledData.push(formattedData[i]);
            }

            setChartData(sampledData);
        } catch (err) {
            console.error('Error fetching chart data:', err);
            setError('Failed to load chart data');
        } finally {
            setLoading(false);
        }
    };

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            const date = new Date(data.time);
            
            return (
                <div className="bg-gray-800/90 backdrop-blur-sm border border-gray-600/50 rounded-xl p-3 shadow-lg">
                    <p className="text-gray-300 text-sm mb-1">
                        {date.toLocaleDateString()} {date.toLocaleTimeString()}
                    </p>
                    <p className="text-white font-medium text-lg">
                        {data.formattedPrice}
                    </p>
                </div>
            );
        }
        return null;
    };

    if (loading) {
        return (
            <div className="bg-gray-900/40 backdrop-blur-xl rounded-3xl p-8 border border-gray-700/50 shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white">Price Chart</h2>
                    <div className="flex space-x-2">
                        {timeFrames.map((tf) => (
                            <button
                                key={tf.value}
                                className="px-4 py-2 rounded-xl bg-gray-700/50 text-gray-400 text-sm"
                                disabled
                            >
                                {tf.label}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="h-80 flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                        <p className="text-gray-400">Loading chart...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-gray-900/40 backdrop-blur-xl rounded-3xl p-8 border border-gray-700/50 shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white">Price Chart</h2>
                    <div className="flex space-x-2">
                        {timeFrames.map((tf) => (
                            <button
                                key={tf.value}
                                onClick={() => setTimeFrame(tf.value)}
                                className={`px-4 py-2 rounded-xl text-sm transition-all duration-300 ${
                                    timeFrame === tf.value
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-700/50 text-gray-400 hover:bg-gray-600/50'
                                }`}
                            >
                                {tf.label}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="h-80 flex items-center justify-center">
                    <div className="text-center">
                        <div className="text-red-400 text-lg mb-2">⚠️ Error</div>
                        <p className="text-gray-400 mb-4">{error}</p>
                        <button 
                            onClick={fetchChartData}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors"
                        >
                            Retry
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Calculate price range for Y-axis
    const prices = chartData.map(d => d.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const priceRange = maxPrice - minPrice;
    const yAxisMin = minPrice - (priceRange * 0.1);
    const yAxisMax = maxPrice + (priceRange * 0.1);

    // Determine line color based on overall trend
    const firstPrice = chartData[0]?.price || 0;
    const lastPrice = chartData[chartData.length - 1]?.price || 0;
    const isPositive = lastPrice >= firstPrice;
    const lineColor = isPositive ? '#10B981' : '#EF4444';
    const gradientId = `gradient-${coinId}-${timeFrame}`;

    return (
        <div className="bg-gray-900/40 backdrop-blur-xl rounded-3xl p-8 border border-gray-700/50 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Price Chart</h2>
                <div className="flex space-x-2">
                    {timeFrames.map((tf) => (
                        <button
                            key={tf.value}
                            onClick={() => setTimeFrame(tf.value)}
                            className={`px-4 py-2 rounded-xl text-sm transition-all duration-300 ${
                                timeFrame === tf.value
                                    ? 'bg-blue-600 text-white shadow-lg'
                                    : 'bg-gray-700/50 text-gray-400 hover:bg-gray-600/50 hover:text-white'
                            }`}
                        >
                            {tf.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <defs>
                            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={lineColor} stopOpacity={0.3}/>
                                <stop offset="95%" stopColor={lineColor} stopOpacity={0.05}/>
                            </linearGradient>
                        </defs>
                        <XAxis 
                            dataKey="label"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#9CA3AF', fontSize: 12 }}
                            interval="preserveStartEnd"
                        />
                        <YAxis 
                            domain={[yAxisMin, yAxisMax]}
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#9CA3AF', fontSize: 12 }}
                            tickFormatter={(value) => `$${value.toLocaleString(undefined, { 
                                notation: 'compact', 
                                maximumFractionDigits: 1 
                            })}`}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Line 
                            type="monotone" 
                            dataKey="price" 
                            stroke={lineColor}
                            strokeWidth={3}
                            dot={false}
                            fill={`url(#${gradientId})`}
                            activeDot={{ 
                                r: 6, 
                                fill: lineColor,
                                stroke: '#1F2937',
                                strokeWidth: 2
                            }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Price Summary */}
            <div className="mt-6 pt-6 border-t border-gray-700/50">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                        <div className="text-gray-400 text-sm mb-1">Current</div>
                        <div className="text-white font-medium">
                            {chartData[chartData.length - 1]?.formattedPrice || 'N/A'}
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="text-gray-400 text-sm mb-1">High</div>
                        <div className="text-green-400 font-medium">
                            ${Math.max(...prices).toLocaleString(undefined, { 
                                minimumFractionDigits: 2, 
                                maximumFractionDigits: 2 
                            })}
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="text-gray-400 text-sm mb-1">Low</div>
                        <div className="text-red-400 font-medium">
                            ${Math.min(...prices).toLocaleString(undefined, { 
                                minimumFractionDigits: 2, 
                                maximumFractionDigits: 2 
                            })}
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="text-gray-400 text-sm mb-1">Change</div>
                        <div className={`font-medium flex items-center justify-center ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                            {isPositive ? '↗' : '↘'} 
                            {Math.abs(((lastPrice - firstPrice) / firstPrice) * 100).toFixed(2)}%
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PriceChart;
