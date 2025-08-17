import React, { useState, useEffect } from "react";
import NavBar from "../components/Navbar";
import { useTransactionModal } from "../context/TransactionModalContext";
import { Link } from "react-router-dom"

const SettingsPage = () => {
    const [theme, setTheme] = useState('system');
    const [currency, setCurrency] = useState('usd');
    const [refreshInterval, setRefreshInterval] = useState(60);
    const [transactionCount, setTransactionCount] = useState(0);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [transactions, setTransactions] = useState([]);
    const { openModal } = useTransactionModal();

    useEffect(() => {
        // Load settings and transactions from localStorage
        loadTransactionsAndSettings();
        
        // Listen for global transaction added events
        const handleTransactionAdded = (event) => {
            const { updatedTransactions } = event.detail;
            setTransactions(updatedTransactions);
            setTransactionCount(updatedTransactions.length);
        };
        
        window.addEventListener('transactionAdded', handleTransactionAdded);
        
        return () => {
            window.removeEventListener('transactionAdded', handleTransactionAdded);
        };
    }, []);

    const loadTransactionsAndSettings = () => {
        const savedTransactions = JSON.parse(localStorage.getItem('cryptoTracker_transactions') || '[]');
        const savedTheme = localStorage.getItem('cryptoTracker_theme') || 'system';
        const savedCurrency = localStorage.getItem('cryptoTracker_currency') || 'usd';
        const savedRefreshInterval = parseInt(localStorage.getItem('cryptoTracker_refreshInterval')) || 60;
        
        setTransactions(savedTransactions);
        setTransactionCount(savedTransactions.length);
        setTheme(savedTheme);
        setCurrency(savedCurrency);
        setRefreshInterval(savedRefreshInterval);
    };

    const saveSettings = (key, value) => {
        // Save to localStorage
        localStorage.setItem(`cryptoTracker_${key}`, value);
        console.log(`Saved ${key}: ${value}`);
    };

    const handleThemeChange = (newTheme) => {
        setTheme(newTheme);
        saveSettings('theme', newTheme);
    };

    const handleCurrencyChange = (newCurrency) => {
        setCurrency(newCurrency);
        saveSettings('currency', newCurrency);
    };

    const handleIntervalChange = (newInterval) => {
        setRefreshInterval(newInterval);
        saveSettings('refreshInterval', newInterval.toString());
    };

    const handleExportData = () => {
        try {
            const exportData = {
                transactions: transactions,
                settings: { theme, currency, refreshInterval },
                metadata: {
                    version: '1.0.0',
                    exportedAt: new Date().toISOString(),
                    totalTransactions: transactions.length
                }
            };

            const dataStr = JSON.stringify(exportData, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(dataBlob);
            
            const link = document.createElement('a');
            link.href = url;
            link.download = `cryptotracker-backup-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            
            alert('Data exported successfully!');
        } catch (error) {
            console.error('Export failed:', error);
            alert('Export failed. Please try again.');
        }
    };

    const handleClearData = () => {
        try {
            // Clear all localStorage data
            localStorage.removeItem('cryptoTracker_transactions');
            localStorage.removeItem('cryptoTracker_theme');
            localStorage.removeItem('cryptoTracker_currency');
            localStorage.removeItem('cryptoTracker_refreshInterval');
            
            // Reset state
            setTransactions([]);
            setTransactionCount(0);
            setTheme('system');
            setCurrency('usd');
            setRefreshInterval(60);
            setShowConfirmDialog(false);
            
            alert('All data cleared successfully!');
        } catch (error) {
            console.error('Clear data failed:', error);
            alert('Failed to clear data. Please try again.');
        }
    };

    const ConfirmDialog = () => (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-lg flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900/90 backdrop-blur-xl rounded-3xl p-8 max-w-md w-full border border-gray-700/50 shadow-2xl animate-pulse">
                <div className="flex items-center mb-6">
                    <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-red-700 rounded-2xl flex items-center justify-center mr-4 shadow-xl">
                        <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-bold text-white">Confirm Data Deletion</h3>
                </div>
                <p className="text-gray-300 text-base mb-8 leading-relaxed">
                    This action will permanently delete all your portfolio data, settings, and transactions. 
                    This cannot be undone and all information will be lost forever.
                </p>
                <div className="flex gap-4">
                    <button
                        onClick={() => setShowConfirmDialog(false)}
                        className="flex-1 px-6 py-4 bg-gray-700/70 hover:bg-gray-600/70 text-white rounded-2xl transition-all duration-300 text-base font-medium backdrop-blur-sm"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleClearData}
                        className="flex-1 px-6 py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-2xl transition-all duration-300 text-base font-medium shadow-lg hover:shadow-red-500/25"
                    >
                        Delete All Data
                    </button>
                </div>
            </div>
        </div>
    );

    const SettingCard = ({ icon, title, description, children, gradient = "from-blue-500 to-purple-600" }) => (
        <div className="bg-gray-900/40 backdrop-blur-xl rounded-3xl p-8 border border-gray-700/50 shadow-2xl hover:bg-gray-900/60 hover:border-gray-600/50 transition-all duration-500 group hover:scale-[1.02] hover:shadow-3xl">
            <div className="flex items-center mb-6">
                <div className={`w-12 h-12 bg-gradient-to-br ${gradient} rounded-2xl flex items-center justify-center mr-4 shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:scale-110`}>
                    {icon}
                </div>
                <div>
                    <h2 className="text-xl font-bold text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-500 group-hover:bg-clip-text transition-all duration-300">{title}</h2>
                </div>
            </div>
            <p className="text-gray-400 mb-6 text-base leading-relaxed">{description}</p>
            {children}
        </div>
    );

    const SelectField = ({ label, value, onChange, options, note }) => (
        <div>
            <label className="block text-base font-semibold text-white mb-3">{label}</label>
            <div className="relative">
                <select 
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full bg-gray-800/70 backdrop-blur-sm border border-gray-600/50 text-white rounded-2xl px-6 py-4 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none transition-all duration-300 hover:border-gray-500/50 text-base font-medium"
                >
                    {options.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>
            {note && <p className="mt-3 text-sm text-gray-400 leading-relaxed">{note}</p>}
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute top-3/4 left-1/2 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
            </div>
            
            <NavBar />
            
            {showConfirmDialog && <ConfirmDialog />}
            
            <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-24">
                {/* Header */}
                <div className="mb-12 text-center">
                    <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-4 animate-pulse">
                        Settings
                    </h1>
                    <p className="text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed">
                        Customize your experience and manage your data with our advanced settings panel.
                    </p>
                    <div className="mt-6 w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto rounded-full"></div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Appearance */}
                    <SettingCard 
                        icon={<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" /></svg>}
                        title="Appearance"
                        description="Customize how the application looks and feels."
                        gradient="from-blue-500 via-blue-600 to-purple-600"
                    >
                        <SelectField 
                            label="Theme"
                            value={theme}
                            onChange={handleThemeChange}
                            options={[
                                { value: 'system', label: 'System' },
                                { value: 'dark', label: 'Dark' },
                                { value: 'light', label: 'Light' }
                            ]}
                            note="Theme will match your system preference when set to System"
                        />
                    </SettingCard>

                    {/* Currency */}
                    <SettingCard 
                        icon={<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" /></svg>}
                        title="Currency"
                        description="Choose your preferred currency for displaying prices and values."
                        gradient="from-green-500 via-emerald-500 to-teal-600"
                    >
                        <SelectField 
                            label="Display Currency"
                            value={currency}
                            onChange={handleCurrencyChange}
                            options={[
                                { value: 'usd', label: 'US Dollar (USD)' },
                                { value: 'ngn', label: 'Nigerian Naira (NGN) - Coming Soon' },
                                { value: 'eur', label: 'Euro (EUR) - Coming Soon ' },
                                { value: 'gbp', label: 'British Pound (GBP) - Coming Soon' }
                            ]}
                        />
                        <div className="mt-4 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 border border-blue-500/30 rounded-2xl p-4">
                            <div className="flex items-center text-xs text-gray-300">
                                <svg className="w-4 h-4 text-blue-400 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                NGN support is coming soon. All prices will continue to display in USD for now.
                            </div>
                        </div>
                    </SettingCard>

                    {/* Data & Performance */}
                    <SettingCard 
                        icon={<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>}
                        title="Data & Performance"
                        description="Control how often data is refreshed and optimize performance."
                        gradient="from-orange-500 via-red-500 to-pink-600"
                    >
                        <SelectField 
                            label="Data Refresh Interval"
                            value={refreshInterval}
                            onChange={(val) => handleIntervalChange(parseInt(val))}
                            options={[
                                { value: 30, label: '30 seconds' },
                                { value: 60, label: '60 seconds - Recommended' },
                                { value: 120, label: '2 minutes' },
                                { value: 300, label: '5 minutes' }
                            ]}
                            note="How often market data should be refreshed. Lower intervals may impact performance."
                        />
                    </SettingCard>

                    {/* Data Management */}
                    <SettingCard 
                        icon={<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
                        title="Data Management"
                        description="Export, backup, or clear your portfolio data."
                        gradient="from-purple-500 via-pink-500 to-rose-600"
                    >
                        <div className="space-y-6">
                            <div className="flex items-center justify-between py-4 bg-gray-800/30 backdrop-blur-sm rounded-2xl px-6 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300">
                                <div>
                                    <h3 className="text-white font-semibold text-base">Portfolio Transactions</h3>
                                    <p className="text-sm text-gray-400">{transactionCount} transactions stored locally</p>
                                </div>
                                <div className="flex gap-3">
                                    <button 
                                        onClick={openModal}
                                        className="flex items-center px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-green-500/25 hover:scale-105 text-sm font-medium"
                                    >
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                        Add Transaction
                                    </button>
                                    <button 
                                        onClick={handleExportData}
                                        className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-blue-500/25 hover:scale-105 text-sm font-medium"
                                    >
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        Export Data
                                    </button>
                                </div>
                            </div>

                            {/* Recent Transactions Preview */}
                            {transactions.length > 0 && (
                                <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
                                    <h4 className="text-white font-semibold mb-4 flex items-center">
                                        <svg className="w-5 h-5 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                        </svg>
                                        Recent Transactions
                                    </h4>
                                    <div className="space-y-3 max-h-48 overflow-y-auto">
                                        {transactions.slice(-5).reverse().map((transaction) => (
                                            <div key={transaction.id} className="flex items-center justify-between py-3 px-4 bg-gray-700/30 rounded-xl">
                                                <div className="flex items-center space-x-3">
                                                    {transaction.coinImage && (
                                                        <img src={transaction.coinImage} alt={transaction.coinName} className="w-8 h-8 rounded-full" />
                                                    )}
                                                    <div>
                                                        <div className="text-white font-medium text-sm">{transaction.coinName}</div>
                                                        <div className="text-gray-400 text-xs">{transaction.quantity} {transaction.coinSymbol}</div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-white font-medium text-sm">
                                                        ${transaction.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                    </div>
                                                    <div className="text-gray-400 text-xs">{new Date(transaction.date).toLocaleDateString()}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="border-t border-gray-700/50 pt-6">
                                <div className="bg-gradient-to-r from-red-900/30 via-red-800/20 to-pink-900/30 border border-red-600/50 rounded-2xl p-6">
                                    <h4 className="text-red-400 font-semibold mb-3 text-base flex items-center">
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                        </svg>
                                        Danger Zone
                                    </h4>
                                    <p className="text-sm text-gray-300 mb-4 leading-relaxed">Permanently delete all portfolio data and settings. This action cannot be undone.</p>
                                    <button 
                                        onClick={() => setShowConfirmDialog(true)}
                                        className="flex items-center px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-red-500/25 hover:scale-105 text-sm font-medium"
                                    >
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                        Clear All Data
                                    </button>
                                </div>
                            </div>
                        </div>
                    </SettingCard>

                    {/* About */}
                    <div className="lg:col-span-2">
                        <SettingCard 
                            icon={<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                            title="About"
                            description="Application information and important notices."
                            gradient="from-indigo-500 via-purple-500 to-pink-600"
                        >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300">
                                <h3 className="text-white font-semibold mb-2 text-base">Version</h3>
                                <p className="text-blue-400 text-base font-mono">v1.0.0</p>
                            </div>
                            <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300">
                                <h3 className="text-white font-semibold mb-2 text-base">Data Source</h3>
                                <a 
                                    href="https://www.coingecko.com/" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-green-400 text-base hover:text-green-300 transition-colors duration-300 flex items-center gap-2 group"
                                >
                                    CoinGecko API
                                    <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                </a>
                            </div>
                        </div>

                        <div className="space-y-6 text-sm">
                            <div className="bg-gradient-to-r from-blue-600/20 via-cyan-600/20 to-purple-600/20 border border-blue-500/30 rounded-2xl p-6 backdrop-blur-sm">
                                <h4 className="text-blue-400 font-semibold mb-3 text-base flex items-center">
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                    Privacy & Security
                                </h4>
                                <p className="text-gray-300 leading-relaxed">
                                    This application stores all data locally on your device. No personal information is collected 
                                    or transmitted to external servers. Your privacy is our top priority.
                                </p>
                            </div>
                            <div className="bg-gradient-to-r from-yellow-600/20 via-orange-600/20 to-red-600/20 border border-yellow-500/30 rounded-2xl p-6 backdrop-blur-sm">
                                <h4 className="text-yellow-400 font-semibold mb-3 text-base flex items-center">
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                    </svg>
                                    Investment Disclaimer
                                </h4>
                                <p className="text-gray-300 leading-relaxed">
                                    This tool is for informational purposes only. Cryptocurrency investments carry significant risk. 
                                    Always do your own research and consult with financial advisors before making investment decisions.
                                </p>
                            </div>
                        </div>
                        </SettingCard>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;