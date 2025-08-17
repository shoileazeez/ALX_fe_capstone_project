import React from 'react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

const MiniChart = ({ sparklineData, priceChange }) => {
    try {
        if (!sparklineData || sparklineData.length === 0) {
            return (
                <div className="w-24 h-12 flex items-center justify-center">
                    <div className="text-gray-500 text-xs">No data</div>
                </div>
            );
        }

        // Convert sparkline data to chart format
        const chartData = sparklineData.map((price, index) => ({
            index,
            price: price || 0
        }));

        // Determine line color based on price change
        const isPositive = priceChange >= 0;
        const lineColor = isPositive ? '#10B981' : '#EF4444';

        return (
            <div className="w-24 h-12">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                        <Line 
                            type="monotone" 
                            dataKey="price" 
                            stroke={lineColor}
                            strokeWidth={2}
                            dot={false}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        );
    } catch (error) {
        console.error('Error in MiniChart:', error);
        return (
            <div className="w-24 h-12 flex items-center justify-center">
                <div className="text-gray-500 text-xs">Chart error</div>
            </div>
        );
    }
};

export default MiniChart;
