import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const PerformanceChart = ({ transactions }) => {
    // Add debugging
    console.log('PerformanceChart received transactions:', transactions);
    
    if (!transactions || transactions.length === 0) {
        return (
            <div className="flex items-center justify-center h-64 text-gray-400">
                <div className="text-center">
                    <svg className="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    <p>No transaction history</p>
                </div>
            </div>
        );
    }

    try {

    // Sort transactions by date
    const sortedTransactions = [...transactions].sort((a, b) => new Date(a?.date || 0) - new Date(b?.date || 0));
    
    // Create cumulative data points
    let cumulativeValue = 0;
    const chartData = sortedTransactions.map((tx, index) => {
        const txValue = tx?.totalValue || 0;
        cumulativeValue += txValue;
        return {
            date: tx?.date ? new Date(tx.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Unknown',
            fullDate: tx?.date || '',
            value: cumulativeValue,
            transactionValue: txValue,
            coinName: tx?.coinName || 'Unknown Coin',
            index: index + 1
        };
    });

    // Add a starting point if we have data
    if (chartData.length > 0) {
        chartData.unshift({
            date: 'Start',
            fullDate: chartData[0].fullDate,
            value: 0,
            index: 0
        });
    }

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value);
    };

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            const data = payload[0]?.payload || {};
            const value = data.value || 0;
            const transactionValue = data.transactionValue || 0;
            const coinName = data.coinName || 'Unknown';
            const index = data.index || 0;
            
            return (
                <div className="bg-gray-800/95 backdrop-blur-sm border border-gray-600/50 rounded-xl p-3 shadow-2xl">
                    <div className="text-white font-medium text-sm mb-2">{label || 'Unknown'}</div>
                    <div className="text-gray-300 text-xs space-y-1">
                        <div>Portfolio Value: {formatCurrency(value)}</div>
                        {transactionValue > 0 && (
                            <>
                                <div>Transaction: +{formatCurrency(transactionValue)}</div>
                                <div>Coin: {coinName}</div>
                            </>
                        )}
                        <div>Total Transactions: {index}</div>
                    </div>
                </div>
            );
        }
        return null;
    };

    const maxValue = Math.max(...chartData.map(d => d.value));
    const minValue = 0;

    return (
        <div className="w-full h-full">
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                    <XAxis 
                        dataKey="date" 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#9CA3AF', fontSize: 12 }}
                    />
                    <YAxis 
                        domain={[minValue, maxValue * 1.1]}
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#9CA3AF', fontSize: 12 }}
                        tickFormatter={formatCurrency}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#3B82F6"
                        strokeWidth={3}
                        dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2, fill: '#1E40AF' }}
                    />
                </LineChart>
            </ResponsiveContainer>
            
            {/* Chart Summary */}
            <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                <div>
                    <div className="text-gray-400 text-xs">Current Value</div>
                    <div className="text-white text-sm font-medium">{formatCurrency(maxValue)}</div>
                </div>
                <div>
                    <div className="text-gray-400 text-xs">Total Transactions</div>
                    <div className="text-white text-sm font-medium">{transactions.length}</div>
                </div>
                <div>
                    <div className="text-gray-400 text-xs">Growth</div>
                    <div className="text-green-400 text-sm font-medium">
                        {maxValue > 0 ? '+' + formatCurrency(maxValue) : formatCurrency(0)}
                    </div>
                </div>
            </div>
        </div>
    );
    } catch (error) {
        console.error('Error in PerformanceChart:', error);
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

export default PerformanceChart;
