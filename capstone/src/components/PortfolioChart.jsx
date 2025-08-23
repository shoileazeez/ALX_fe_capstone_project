import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const PortfolioChart = ({ transactions, type = 'allocation' }) => {
    // Add debugging
    console.log('PortfolioChart received transactions:', transactions);
    
    if (!transactions || transactions.length === 0) {
        return (
            <div className="flex items-center justify-center h-64 text-gray-400">
                <div className="text-center">
                    <svg className="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <p>No data to display</p>
                </div>
            </div>
        );
    }

    try {

    // Group transactions by coin and calculate totals
    const coinGroups = transactions.reduce((groups, tx) => {
        // Add safety checks for undefined properties
        const key = tx?.coinId || 'unknown';
        if (!groups[key]) {
            groups[key] = {
                name: tx?.coinName || 'Unknown Coin',
                symbol: tx?.coinSymbol || 'UNKNOWN',
                value: 0,
                quantity: 0,
                color: ''
            };
        }
        groups[key].value += (tx?.totalValue || 0);
        groups[key].quantity += (tx?.quantity || 0);
        return groups;
    }, {});

    // Convert to array and add colors
    const colors = [
        '#3B82F6', // Blue
        '#8B5CF6', // Purple
        '#EC4899', // Pink
        '#10B981', // Green
        '#F59E0B', // Yellow
        '#EF4444', // Red
        '#6366F1', // Indigo
        '#84CC16', // Lime
        '#F97316', // Orange
        '#14B8A6'  // Teal
    ];

    const data = Object.values(coinGroups).map((coin, index) => ({
        ...coin,
        color: colors[index % colors.length],
        percentage: 0 // Will be calculated below
    }));

    // Calculate percentages
    const totalValue = data.reduce((sum, coin) => sum + coin.value, 0);
    data.forEach(coin => {
        coin.percentage = totalValue > 0 ? (coin.value / totalValue) * 100 : 0;
    });

    // Sort by value (highest first)
    data.sort((a, b) => b.value - a.value);

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value);
    };

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0]?.payload || {};
            const name = data.name || 'Unknown';
            const value = data.value || 0;
            const percentage = data.percentage || 0;
            const quantity = data.quantity || 0;
            const symbol = data.symbol || '';
            const color = data.color || '#666';
            
            return (
                <div className="bg-gray-800/95 backdrop-blur-sm border border-gray-600/50 rounded-xl p-3 shadow-2xl">
                    <div className="flex items-center space-x-2 mb-2">
                        <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: color }}
                        ></div>
                        <span className="text-white font-medium text-sm">{name}</span>
                    </div>
                    <div className="text-gray-300 text-xs space-y-1">
                        <div>Value: {formatCurrency(value)}</div>
                        <div>Share: {percentage.toFixed(1)}%</div>
                        <div>Quantity: {quantity.toLocaleString()} {symbol}</div>
                    </div>
                </div>
            );
        }
        return null;
    };

    const CustomLegend = ({ payload }) => {
        if (!payload || !Array.isArray(payload)) {
            return null;
        }
        
        return (
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                {payload.slice(0, 6).map((entry, index) => {
                    const entryData = entry?.payload || entry || {};
                    const name = entryData.name || 'Unknown';
                    const percentage = entryData.percentage || 0;
                    const color = entryData.color || entry?.color || '#666';
                    
                    return (
                        <div key={index} className="flex items-center space-x-2 text-sm">
                            <div 
                                className="w-3 h-3 rounded-full flex-shrink-0" 
                                style={{ backgroundColor: color }}
                            ></div>
                            <span className="text-gray-300 truncate">
                                {name} ({percentage.toFixed(1)}%)
                            </span>
                        </div>
                    );
                })}
                {payload.length > 6 && (
                    <div className="text-gray-400 text-xs col-span-full">
                        +{payload.length - 6} more coins
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="w-full h-full">
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                </PieChart>
            </ResponsiveContainer>
            
            {/* Custom Legend */}
            <CustomLegend payload={data} />
            
            {/* Summary */}
            <div className="mt-4 text-center">
                <div className="text-gray-400 text-sm">Total Portfolio Value</div>
                <div className="text-white text-xl font-bold">{formatCurrency(totalValue)}</div>
            </div>
        </div>
    );
    } catch (error) {
        console.error('Error in PortfolioChart:', error);
        return (
            <div className="flex items-center justify-center h-64 text-red-400">
                <div className="text-center">
                    <svg className="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p>Error loading chart</p>
                </div>
            </div>
        );
    }
};

export default PortfolioChart;
