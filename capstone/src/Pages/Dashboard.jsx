import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/Navbar";
import AddTransactionModal from "../components/AddTransactionModal";
import PortfolioChart from "../components/PortfolioChart";
import PerformanceChart from "../components/PerformanceChart";
import { useTransactionModal } from "../context/TransactionModalContext";

const Dashboard = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [portfolioSummary, setPortfolioSummary] = useState({
        totalValue: 0,
        totalInvestment: 0,
        totalProfitLoss: 0,
        totalProfitLossPercentage: 0,
        topPerformer: null,
        totalCoins: 0
    });

    const navigate = useNavigate();
    const { isModalOpen, openModal, closeModal } = useTransactionModal();

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
        if (transactions.length === 0) {
            setPortfolioSummary({
                totalValue: 0,
                totalInvestment: 0,
                totalProfitLoss: 0,
                totalProfitLossPercentage: 0,
                topPerformer: null,
                totalCoins: 0
            });
            return;
        }

        const totalInvestment = transactions.reduce((sum, tx) => sum + (tx?.totalValue || 0), 0);
        
        // Group transactions by coin
        const coinGroups = transactions.reduce((groups, tx) => {
            const key = tx?.coinId || 'unknown';
            if (!groups[key]) {
                groups[key] = {
                    coinId: tx?.coinId || 'unknown',
                    coinName: tx?.coinName || 'Unknown Coin',
                    coinSymbol: tx?.coinSymbol || 'UNKNOWN',
                    coinImage: tx?.coinImage || '',
                    totalQuantity: 0,
                    totalInvestment: 0,
                    transactions: []
                };
            }
            groups[key].totalQuantity += (tx?.quantity || 0);
            groups[key].totalInvestment += (tx?.totalValue || 0);
            groups[key].transactions.push(tx);
            return groups;
        }, {});

        const uniqueCoins = Object.keys(coinGroups).length;
        
        // For now, we'll use investment value as current value
        // In a real app, you'd fetch current prices and calculate actual portfolio value
        const totalValue = totalInvestment;
        const totalProfitLoss = totalValue - totalInvestment;
        const totalProfitLossPercentage = totalInvestment > 0 ? (totalProfitLoss / totalInvestment) * 100 : 0;

        // Find top performer (coin with highest investment)
        const topPerformer = Object.values(coinGroups).reduce((top, coin) => {
            return (!top || coin.totalInvestment > top.totalInvestment) ? coin : top;
        }, null);

        setPortfolioSummary({
            totalValue,
            totalInvestment,
            totalProfitLoss,
            totalProfitLossPercentage,
            topPerformer,
            totalCoins: uniqueCoins
        });
    };

    const handleTransactionAdded = (transaction, allTransactions) => {
        setTransactions(allTransactions);
        calculatePortfolioSummary(allTransactions);
        
        // Dispatch custom event for other components
        window.dispatchEvent(new CustomEvent('transactionAdded', {
            detail: { transaction, updatedTransactions: allTransactions }
        }));
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
                        <p className="text-gray-400 text-lg">Loading dashboard...</p>
                    </div>
                </div>
            </div>
        );
    }

    // Empty state when no transactions
    if (transactions.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
                {/* Animated Background Elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
                    <div className="absolute top-3/4 left-1/2 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
                </div>

                <NavBar />
                
                <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-24">
                    <div className="text-center">
                        <div className="mb-8">
                            <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-4">
                                Welcome to Your Dashboard
                            </h1>
                            <p className="text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed">
                                Start building your cryptocurrency portfolio by adding your first transaction or explore the market.
                            </p>
                        </div>

                        {/* Empty State Card */}
                        <div className="bg-gray-900/40 backdrop-blur-xl rounded-3xl p-12 border border-gray-700/50 shadow-2xl mb-8">
                            <div className="mb-8">
                                <div className="w-24 h-24 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <h2 className="text-2xl font-bold text-white mb-4">No Transactions Yet</h2>
                                <p className="text-gray-400 mb-8 max-w-md mx-auto">
                                    You haven't added any cryptocurrency transactions to your portfolio yet. 
                                    Get started by adding your first transaction or exploring the market.
                                </p>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <button 
                                    onClick={openModal}
                                    className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl transition-all duration-300 font-medium hover:scale-105 flex items-center justify-center"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                    Add Transaction
                                </button>
                                <button 
                                    onClick={() => navigate('/markets')}
                                    className="px-8 py-4 bg-gray-800/70 hover:bg-gray-700/70 text-white rounded-xl transition-all duration-300 font-medium hover:scale-105 flex items-center justify-center"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                    View Markets
                                </button>
                            </div>
                        </div>

                        {/* Quick Stats Cards for Empty State */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-gray-900/40 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 text-center">
                                <div className="text-3xl font-bold text-gray-400 mb-2">$0.00</div>
                                <div className="text-gray-500 text-sm">Portfolio Value</div>
                            </div>
                            <div className="bg-gray-900/40 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 text-center">
                                <div className="text-3xl font-bold text-gray-400 mb-2">0</div>
                                <div className="text-gray-500 text-sm">Total Coins</div>
                            </div>
                            <div className="bg-gray-900/40 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 text-center">
                                <div className="text-3xl font-bold text-gray-400 mb-2">0%</div>
                                <div className="text-gray-500 text-sm">24h Change</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Add Transaction Modal */}
                <AddTransactionModal
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    onTransactionAdded={handleTransactionAdded}
                />
            </div>
        );
    }

    // Dashboard with transactions
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
                <div className="mb-8">
                    <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-4">
                        Dashboard
                    </h1>
                    <p className="text-gray-300 text-lg max-w-2xl leading-relaxed">
                        Track your cryptocurrency portfolio performance and manage your investments.
                    </p>
                </div>

                {/* Portfolio Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-gray-900/40 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 shadow-2xl">
                        <div className="flex items-center justify-between mb-4">
                            <div className="text-gray-400 text-sm font-medium">Total Value</div>
                            <div className="w-8 h-8 bg-blue-600/20 rounded-lg flex items-center justify-center">
                                <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                </svg>
                            </div>
                        </div>
                        <div className="text-2xl font-bold text-white mb-1">{formatCurrency(portfolioSummary.totalValue)}</div>
                        <div className="text-xs text-gray-500">Portfolio Value</div>
                    </div>

                    <div className="bg-gray-900/40 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 shadow-2xl">
                        <div className="flex items-center justify-between mb-4">
                            <div className="text-gray-400 text-sm font-medium">Investment</div>
                            <div className="w-8 h-8 bg-green-600/20 rounded-lg flex items-center justify-center">
                                <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                </svg>
                            </div>
                        </div>
                        <div className="text-2xl font-bold text-white mb-1">{formatCurrency(portfolioSummary.totalInvestment)}</div>
                        <div className="text-xs text-gray-500">Total Invested</div>
                    </div>

                    <div className="bg-gray-900/40 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 shadow-2xl">
                        <div className="flex items-center justify-between mb-4">
                            <div className="text-gray-400 text-sm font-medium">P&L</div>
                            <div className="w-8 h-8 bg-purple-600/20 rounded-lg flex items-center justify-center">
                                <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                        </div>
                        <div className="text-2xl font-bold text-white mb-1">{formatCurrency(portfolioSummary.totalProfitLoss)}</div>
                        <div className="text-xs">{formatPercentage(portfolioSummary.totalProfitLossPercentage)}</div>
                    </div>

                    <div className="bg-gray-900/40 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 shadow-2xl">
                        <div className="flex items-center justify-between mb-4">
                            <div className="text-gray-400 text-sm font-medium">Holdings</div>
                            <div className="w-8 h-8 bg-orange-600/20 rounded-lg flex items-center justify-center">
                                <svg className="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                            </div>
                        </div>
                        <div className="text-2xl font-bold text-white mb-1">{portfolioSummary.totalCoins}</div>
                        <div className="text-xs text-gray-500">Different Coins</div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-gray-900/40 backdrop-blur-xl rounded-3xl p-6 border border-gray-700/50 shadow-2xl mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-white">Quick Actions</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <button 
                            onClick={openModal}
                            className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl transition-all duration-300 font-medium hover:scale-105 flex items-center justify-center"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Add Transaction
                        </button>
                        <button 
                            onClick={() => navigate('/portfolio')}
                            className="p-4 bg-gray-800/70 hover:bg-gray-700/70 text-white rounded-xl transition-all duration-300 font-medium hover:scale-105 flex items-center justify-center"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                            View Portfolio
                        </button>
                        <button 
                            onClick={() => navigate('/markets')}
                            className="p-4 bg-gray-800/70 hover:bg-gray-700/70 text-white rounded-xl transition-all duration-300 font-medium hover:scale-105 flex items-center justify-center"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                            Browse Markets
                        </button>
                    </div>
                </div>

                {/* Portfolio Visualization Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Portfolio Allocation Chart */}
                    <div className="bg-gray-900/40 backdrop-blur-xl rounded-3xl border border-gray-700/50 shadow-2xl p-6">
                        <div className="mb-6">
                            <h2 className="text-xl font-bold text-white mb-2">Portfolio Allocation</h2>
                            <p className="text-gray-400 text-sm">Distribution of your cryptocurrency holdings</p>
                        </div>
                        <PortfolioChart transactions={transactions} />
                    </div>

                    {/* Performance Chart */}
                    <div className="bg-gray-900/40 backdrop-blur-xl rounded-3xl border border-gray-700/50 shadow-2xl p-6">
                        <div className="mb-6">
                            <h2 className="text-xl font-bold text-white mb-2">Portfolio Growth</h2>
                            <p className="text-gray-400 text-sm">Your investment progression over time</p>
                        </div>
                        <PerformanceChart transactions={transactions} />
                    </div>
                </div>

                {/* Recent Transactions */}
                <div className="bg-gray-900/40 backdrop-blur-xl rounded-3xl border border-gray-700/50 shadow-2xl overflow-hidden mb-8">
                    <div className="p-6 border-b border-gray-700/50">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-white">Recent Transactions</h2>
                            <button 
                                onClick={() => navigate('/portfolio')}
                                className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
                            >
                                View All
                            </button>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-700/50">
                                    <th className="text-left py-4 px-6 text-gray-400 font-medium text-sm">Coin</th>
                                    <th className="text-right py-4 px-6 text-gray-400 font-medium text-sm">Quantity</th>
                                    <th className="text-right py-4 px-6 text-gray-400 font-medium text-sm">Price</th>
                                    <th className="text-right py-4 px-6 text-gray-400 font-medium text-sm">Total</th>
                                    <th className="text-right py-4 px-6 text-gray-400 font-medium text-sm">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.slice(0, 5).map((transaction) => (
                                    <tr key={transaction.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
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
                                                    <div className="text-white font-medium text-sm">{transaction.coinName}</div>
                                                    <div className="text-gray-400 text-xs">{transaction.coinSymbol}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-right text-white text-sm">
                                            {transaction.quantity.toLocaleString()}
                                        </td>
                                        <td className="py-4 px-6 text-right text-white text-sm">
                                            {formatCurrency(transaction.averageCost)}
                                        </td>
                                        <td className="py-4 px-6 text-right text-white font-medium text-sm">
                                            {formatCurrency(transaction.totalValue)}
                                        </td>
                                        <td className="py-4 px-6 text-right text-gray-400 text-sm">
                                            {new Date(transaction.date).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Top Performer */}
                {portfolioSummary.topPerformer && (
                    <div className="bg-gray-900/40 backdrop-blur-xl rounded-3xl p-6 border border-gray-700/50 shadow-2xl">
                        <h2 className="text-xl font-bold text-white mb-6">Top Holding</h2>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                {portfolioSummary.topPerformer.coinImage && (
                                    <img 
                                        src={portfolioSummary.topPerformer.coinImage} 
                                        alt={portfolioSummary.topPerformer.coinName}
                                        className="w-12 h-12 rounded-full"
                                    />
                                )}
                                <div>
                                    <div className="text-white font-bold text-lg">{portfolioSummary.topPerformer.coinName}</div>
                                    <div className="text-gray-400 text-sm">{portfolioSummary.topPerformer.coinSymbol}</div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-white font-bold text-lg">
                                    {formatCurrency(portfolioSummary.topPerformer.totalInvestment)}
                                </div>
                                <div className="text-gray-400 text-sm">
                                    {portfolioSummary.topPerformer.totalQuantity.toLocaleString()} {portfolioSummary.topPerformer.coinSymbol}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Add Transaction Modal */}
            <AddTransactionModal
                isOpen={isModalOpen}
                onClose={closeModal}
                onTransactionAdded={handleTransactionAdded}
            />
        </div>
    );
};

export default Dashboard;