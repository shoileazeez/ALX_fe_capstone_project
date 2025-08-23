import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/Navbar";
import PortfolioChart from "../components/PortfolioChart";
import PerformanceChart from "../components/PerformanceChart";
import { useTransactionModal } from "../context/TransactionModalContext";

const Portfolio = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [portfolioSummary, setPortfolioSummary] = useState({
        totalValue: 0,
        totalInvestment: 0,
        totalProfitLoss: 0,
        totalProfitLossPercentage: 0
    });
    
    const navigate = useNavigate();
    const { openModal } = useTransactionModal();

    useEffect(() => {
        loadTransactions();
        
        // Listen for global transaction added events
        const handleTransactionAdded = (event) => {
            const { updatedTransactions } = event.detail;
            setTransactions(updatedTransactions);
            calculatePortfolioSummary(updatedTransactions);
        };
        
        window.addEventListener('transactionAdded', handleTransactionAdded);
        
        return () => {
            window.removeEventListener('transactionAdded', handleTransactionAdded);
        };
    }, []);

    const loadTransactions = () => {
        try {
            const savedTransactions = JSON.parse(localStorage.getItem('cryptoTracker_transactions') || '[]');
            
            // Validate and clean transaction data
            const validTransactions = savedTransactions.filter(tx => {
                return tx && typeof tx === 'object' && tx.id;
            }).map(tx => ({
                ...tx,
                coinId: tx.coinId || 'unknown',
                coinName: tx.coinName || 'Unknown Coin',
                coinSymbol: tx.coinSymbol || 'UNKNOWN',
                coinImage: tx.coinImage || '',
                quantity: parseFloat(tx.quantity) || 0,
                totalValue: parseFloat(tx.totalValue) || 0,
                date: tx.date || new Date().toISOString().split('T')[0]
            }));
            
            setTransactions(validTransactions);
            calculatePortfolioSummary(validTransactions);
        } catch (error) {
            console.error('Error loading transactions:', error);
            setTransactions([]);
            calculatePortfolioSummary([]);
        } finally {
            setLoading(false);
        }
    };

    const calculatePortfolioSummary = (transactions) => {
        const totalInvestment = transactions.reduce((sum, tx) => sum + (tx?.totalValue || 0), 0);
        // For now, we'll show the investment value as current value
        // In a real app, you'd fetch current prices and calculate actual portfolio value
        const totalValue = totalInvestment;
        const totalProfitLoss = totalValue - totalInvestment;
        const totalProfitLossPercentage = totalInvestment > 0 ? (totalProfitLoss / totalInvestment) * 100 : 0;

        setPortfolioSummary({
            totalValue,
            totalInvestment,
            totalProfitLoss,
            totalProfitLossPercentage
        });
    };

    const handleDeleteTransaction = (transactionId) => {
        if (window.confirm('Are you sure you want to delete this transaction?')) {
            const updatedTransactions = transactions.filter(tx => tx.id !== transactionId);
            localStorage.setItem('cryptoTracker_transactions', JSON.stringify(updatedTransactions));
            setTransactions(updatedTransactions);
            calculatePortfolioSummary(updatedTransactions);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
    };

    const formatPercentage = (percentage) => {
        const isPositive = percentage >= 0;
        return (
            <span className={`flex items-center ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                {isPositive ? '↗' : '↘'} {Math.abs(percentage).toFixed(2)}%
            </span>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
                <NavBar />
                <div className="pt-24 flex items-center justify-center min-h-[60vh]">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
                        <p className="text-gray-400 text-lg">Loading portfolio...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute top-3/4 left-1/2 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
            </div>

            <NavBar />
            
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-24">
                {/* Header */}
                <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-4">
                            Portfolio
                        </h1>
                        <p className="text-gray-300 text-lg max-w-2xl leading-relaxed">
                            Track your cryptocurrency investments and monitor performance.
                        </p>
                    </div>
                    <button
                        onClick={openModal}
                        className="mt-4 md:mt-0 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl transition-all duration-300 font-medium hover:scale-105 shadow-lg"
                    >
                        + Add Transaction
                    </button>
                </div>

                {transactions.length === 0 ? (
                    // Empty State
                    <div className="bg-gray-900/40 backdrop-blur-xl rounded-3xl p-12 border border-gray-700/50 shadow-2xl text-center">
                        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-4">Start Your Portfolio</h2>
                        <p className="text-gray-400 text-lg mb-8 max-w-md mx-auto">
                            Add your first cryptocurrency transaction to begin tracking your investments.
                        </p>
                        <button
                            onClick={openModal}
                            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl transition-all duration-300 font-medium hover:scale-105 shadow-lg"
                        >
                            Add First Transaction
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Portfolio Summary */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            <div className="bg-gray-900/40 backdrop-blur-xl rounded-3xl p-6 border border-gray-700/50 shadow-2xl">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-gray-400 text-sm font-medium">Total Value</h3>
                                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="text-2xl font-bold text-white">{formatCurrency(portfolioSummary.totalValue)}</div>
                            </div>

                            <div className="bg-gray-900/40 backdrop-blur-xl rounded-3xl p-6 border border-gray-700/50 shadow-2xl">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-gray-400 text-sm font-medium">Total Investment</h3>
                                    <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="text-2xl font-bold text-white">{formatCurrency(portfolioSummary.totalInvestment)}</div>
                            </div>

                            <div className="bg-gray-900/40 backdrop-blur-xl rounded-3xl p-6 border border-gray-700/50 shadow-2xl">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-gray-400 text-sm font-medium">Profit/Loss</h3>
                                    <div className={`w-8 h-8 bg-gradient-to-br ${portfolioSummary.totalProfitLoss >= 0 ? 'from-green-500 to-green-600' : 'from-red-500 to-red-600'} rounded-lg flex items-center justify-center`}>
                                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={portfolioSummary.totalProfitLoss >= 0 ? "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" : "M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"} />
                                        </svg>
                                    </div>
                                </div>
                                <div className={`text-2xl font-bold ${portfolioSummary.totalProfitLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                    {formatCurrency(portfolioSummary.totalProfitLoss)}
                                </div>
                            </div>

                            <div className="bg-gray-900/40 backdrop-blur-xl rounded-3xl p-6 border border-gray-700/50 shadow-2xl">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-gray-400 text-sm font-medium">Return %</h3>
                                    <div className={`w-8 h-8 bg-gradient-to-br ${portfolioSummary.totalProfitLossPercentage >= 0 ? 'from-green-500 to-green-600' : 'from-red-500 to-red-600'} rounded-lg flex items-center justify-center`}>
                                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l6-6v13a6 6 0 0 1-6 6z" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="text-2xl font-bold">
                                    {formatPercentage(portfolioSummary.totalProfitLossPercentage)}
                                </div>
                            </div>
                        </div>

                        {/* Portfolio Visualization Charts */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                            {/* Portfolio Allocation Chart */}
                            <div className="bg-gray-900/40 backdrop-blur-xl rounded-3xl border border-gray-700/50 shadow-2xl p-6">
                                <div className="mb-6">
                                    <h2 className="text-xl font-bold text-white mb-2">Asset Allocation</h2>
                                    <p className="text-gray-400 text-sm">Breakdown of your cryptocurrency holdings</p>
                                </div>
                                <PortfolioChart transactions={transactions} />
                            </div>

                            {/* Performance Chart */}
                            <div className="bg-gray-900/40 backdrop-blur-xl rounded-3xl border border-gray-700/50 shadow-2xl p-6">
                                <div className="mb-6">
                                    <h2 className="text-xl font-bold text-white mb-2">Investment Timeline</h2>
                                    <p className="text-gray-400 text-sm">Your portfolio growth over time</p>
                                </div>
                                <PerformanceChart transactions={transactions} />
                            </div>
                        </div>

                        {/* Transactions Table */}
                        <div className="bg-gray-900/40 backdrop-blur-xl rounded-3xl border border-gray-700/50 shadow-2xl overflow-hidden">
                            <div className="p-6 border-b border-gray-700/50">
                                <h2 className="text-xl font-bold text-white mb-2">Transaction History</h2>
                                <p className="text-gray-400 text-sm">Showing {transactions.length} transactions</p>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-gray-700/50">
                                            <th className="text-left py-4 px-6 text-gray-400 font-medium">Asset</th>
                                            <th className="text-right py-4 px-6 text-gray-400 font-medium">Quantity</th>
                                            <th className="text-right py-4 px-6 text-gray-400 font-medium">Price</th>
                                            <th className="text-right py-4 px-6 text-gray-400 font-medium">Total Value</th>
                                            <th className="text-center py-4 px-6 text-gray-400 font-medium">Date</th>
                                            <th className="text-center py-4 px-6 text-gray-400 font-medium">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {transactions.map((transaction) => (
                                            <tr 
                                                key={transaction.id}
                                                className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-all duration-300"
                                            >
                                                <td className="py-4 px-6">
                                                    <div className="flex items-center space-x-3">
                                                        {transaction.coinImage && (
                                                            <img 
                                                                src={transaction.coinImage} 
                                                                alt={transaction.coinName}
                                                                className="w-8 h-8 rounded-full"
                                                            />
                                                        )}
                                                        <div>
                                                            <div className="text-white font-medium">{transaction.coinName}</div>
                                                            <div className="text-gray-400 text-sm uppercase">{transaction.coinSymbol}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6 text-right text-white font-medium">
                                                    {transaction.quantity.toLocaleString(undefined, { maximumFractionDigits: 8 })}
                                                </td>
                                                <td className="py-4 px-6 text-right text-white font-medium">
                                                    {formatCurrency(transaction.averageCost)}
                                                </td>
                                                <td className="py-4 px-6 text-right text-white font-bold">
                                                    {formatCurrency(transaction.totalValue)}
                                                </td>
                                                <td className="py-4 px-6 text-center text-gray-300">
                                                    {new Date(transaction.date).toLocaleDateString()}
                                                </td>
                                                <td className="py-4 px-6 text-center">
                                                    <button
                                                        onClick={() => handleDeleteTransaction(transaction.id)}
                                                        className="px-3 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 hover:text-red-300 rounded-lg transition-all duration-300 text-sm"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Portfolio;
