import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddTransactionModal = ({ isOpen, onClose, onTransactionAdded, preSelectedCoin }) => {
    const [formData, setFormData] = useState({
        cryptocurrency: '',
        quantity: '',
        averageCost: '',
        date: new Date().toISOString().split('T')[0],
        notes: ''
    });
    
    const [availableCoins, setAvailableCoins] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCoin, setSelectedCoin] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});

    // Fetch popular coins for the dropdown
    useEffect(() => {
        const fetchCoins = async () => {
            try {
                const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
                    params: {
                        vs_currency: 'usd',
                        order: 'market_cap_desc',
                        per_page: 100,
                        page: 1,
                        sparkline: false
                    }
                });
                setAvailableCoins(response.data);
            } catch (error) {
                console.error('Error fetching coins:', error);
                // Fallback coins if API fails
                setAvailableCoins([
                    { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', image: '' },
                    { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', image: '' },
                    { id: 'binancecoin', name: 'BNB', symbol: 'BNB', image: '' }
                ]);
            }
        };

        if (isOpen) {
            fetchCoins();
        }
    }, [isOpen]);

    // Handle pre-selected coin from market page
    useEffect(() => {
        if (preSelectedCoin && isOpen) {
            setSelectedCoin(preSelectedCoin);
            setSearchTerm(`${preSelectedCoin.name} (${preSelectedCoin.symbol?.toUpperCase()})`);
            handleInputChange('cryptocurrency', preSelectedCoin.id);
            
            // Auto-fill average cost with current price
            if (preSelectedCoin.current_price) {
                handleInputChange('averageCost', preSelectedCoin.current_price.toString());
            }
        }
    }, [preSelectedCoin, isOpen]);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.cryptocurrency) {
            newErrors.cryptocurrency = 'Please select a cryptocurrency';
        }
        
        if (!formData.quantity || parseFloat(formData.quantity) <= 0) {
            newErrors.quantity = 'Please enter a valid quantity';
        }
        
        if (!formData.averageCost || parseFloat(formData.averageCost) <= 0) {
            newErrors.averageCost = 'Please enter a valid cost';
        }
        
        if (!formData.date) {
            newErrors.date = 'Please select a date';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        setIsLoading(true);
        
        try {
            // Get selected coin details
            const selectedCoin = availableCoins.find(coin => coin.id === formData.cryptocurrency);
            
            // Create transaction object
            const transaction = {
                id: Date.now().toString(),
                coinId: formData.cryptocurrency,
                coinName: selectedCoin?.name || 'Unknown',
                coinSymbol: selectedCoin?.symbol?.toUpperCase() || 'UNKNOWN',
                coinImage: selectedCoin?.image || '',
                quantity: parseFloat(formData.quantity),
                averageCost: parseFloat(formData.averageCost),
                totalValue: parseFloat(formData.quantity) * parseFloat(formData.averageCost),
                date: formData.date,
                notes: formData.notes,
                createdAt: new Date().toISOString()
            };
            
            // Get existing transactions from localStorage
            const existingTransactions = JSON.parse(localStorage.getItem('cryptoTracker_transactions') || '[]');
            
            // Add new transaction
            const updatedTransactions = [...existingTransactions, transaction];
            
            // Save to localStorage
            localStorage.setItem('cryptoTracker_transactions', JSON.stringify(updatedTransactions));
            
            // Call callback function
            if (onTransactionAdded) {
                onTransactionAdded(transaction, updatedTransactions);
            }
            
            // Reset form
            setFormData({
                cryptocurrency: '',
                quantity: '',
                averageCost: '',
                date: new Date().toISOString().split('T')[0],
                notes: ''
            });
            setSearchTerm('');
            setSelectedCoin(null);
            
            // Close modal
            onClose();
            
        } catch (error) {
            console.error('Error adding transaction:', error);
            setErrors({ submit: 'Failed to add transaction. Please try again.' });
        } finally {
            setIsLoading(false);
        }
    };

    const filteredCoins = availableCoins.filter(coin =>
        coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (!isOpen) return null;

    return (
        <div className="add-transaction-backdrop fixed inset-0 bg-black/30 backdrop-blur-[2px] flex items-center justify-center z-50 p-4">
            <div className="add-transaction-modal add-transaction-content bg-gray-900/90 backdrop-blur-lg rounded-2xl p-6 max-w-md w-full border border-gray-700/50 shadow-2xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-white">Add Transaction</h2>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 bg-gray-800/70 hover:bg-gray-700/70 rounded-full flex items-center justify-center transition-all duration-300"
                    >
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <p className="text-gray-400 text-sm mb-5">Add a new cryptocurrency transaction to your portfolio.</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Cryptocurrency Selection */}
                    <div>
                        <label className="block text-white font-medium mb-2 text-sm">
                            Cryptocurrency <span className="text-red-400">*</span>
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search for a cryptocurrency"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-gray-800/70 backdrop-blur-sm border border-gray-600/50 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                            />
                            
                            {searchTerm && !formData.cryptocurrency && filteredCoins.length > 0 && (
                                <div className="absolute z-10 w-full mt-1 bg-gray-800/95 backdrop-blur-xl border border-gray-600/50 rounded-xl shadow-2xl max-h-48 overflow-y-auto">
                                    {filteredCoins.slice(0, 10).map((coin) => (
                                        <button
                                            key={coin.id}
                                            type="button"
                                            onClick={() => {
                                                handleInputChange('cryptocurrency', coin.id);
                                                setSelectedCoin(coin);
                                                setSearchTerm(`${coin.name} (${coin.symbol?.toUpperCase()})`);
                                                // Auto-fill average cost with current price
                                                if (coin.current_price) {
                                                    handleInputChange('averageCost', coin.current_price.toString());
                                                }
                                            }}
                                            className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-700/50 transition-all duration-300 text-left"
                                        >
                                            {coin.image && (
                                                <img src={coin.image} alt={coin.name} className="w-6 h-6 rounded-full" />
                                            )}
                                            <div className="flex-1">
                                                <div className="text-white font-medium text-sm">{coin.name}</div>
                                                <div className="text-gray-400 text-xs">{coin.symbol?.toUpperCase()}</div>
                                            </div>
                                            {coin.current_price && (
                                                <div className="text-green-400 text-sm font-medium">
                                                    ${coin.current_price.toLocaleString()}
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            )}
                            {searchTerm && !formData.cryptocurrency && filteredCoins.length === 0 && (
                                <div className="absolute z-10 w-full mt-1 bg-gray-800/95 backdrop-blur-xl border border-gray-600/50 rounded-xl shadow-2xl">
                                    <div className="px-4 py-3 text-gray-400 text-center text-sm">No coins found</div>
                                </div>
                            )}
                        </div>
                        {selectedCoin && (
                            <div className="mt-2 flex items-center space-x-2 text-xs text-gray-400">
                                <span>Current price:</span>
                                <span className="text-green-400 font-medium">
                                    ${selectedCoin.current_price?.toLocaleString() || 'N/A'}
                                </span>
                            </div>
                        )}
                        {errors.cryptocurrency && <p className="text-red-400 text-xs mt-1">{errors.cryptocurrency}</p>}
                    </div>

                    {/* Quantity */}
                    <div>
                        <label className="block text-white font-medium mb-2 text-sm">
                            Quantity <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="number"
                            step="0.00000001"
                            placeholder="0.00"
                            value={formData.quantity}
                            onChange={(e) => handleInputChange('quantity', e.target.value)}
                            className="w-full bg-gray-800/70 backdrop-blur-sm border border-gray-600/50 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                        />
                        {errors.quantity && <p className="text-red-400 text-xs mt-1">{errors.quantity}</p>}
                    </div>

                    {/* Average Cost */}
                    <div>
                        <label className="block text-white font-medium mb-2 text-sm">
                            Average Cost (USD) <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            value={formData.averageCost}
                            onChange={(e) => handleInputChange('averageCost', e.target.value)}
                            className="w-full bg-gray-800/70 backdrop-blur-sm border border-gray-600/50 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                        />
                        {errors.averageCost && <p className="text-red-400 text-xs mt-1">{errors.averageCost}</p>}
                    </div>

                    {/* Date */}
                    <div>
                        <label className="block text-white font-medium mb-2 text-sm">Date</label>
                        <input
                            type="date"
                            value={formData.date}
                            onChange={(e) => handleInputChange('date', e.target.value)}
                            max={new Date().toISOString().split('T')[0]}
                            className="w-full bg-gray-800/70 backdrop-blur-sm border border-gray-600/50 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                        />
                        {errors.date && <p className="text-red-400 text-xs mt-1">{errors.date}</p>}
                    </div>

                    {/* Notes */}
                    <div>
                        <label className="block text-white font-medium mb-2 text-sm">Notes (optional)</label>
                        <textarea
                            placeholder="Add any notes about this transaction..."
                            value={formData.notes}
                            onChange={(e) => handleInputChange('notes', e.target.value)}
                            rows={2}
                            className="w-full bg-gray-800/70 backdrop-blur-sm border border-gray-600/50 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 resize-none"
                        />
                    </div>

                    {/* Total Value Display */}
                    {formData.quantity && formData.averageCost && (
                        <div className="bg-blue-600/20 border border-blue-500/30 rounded-lg p-3">
                            <div className="text-blue-400 text-xs font-medium mb-1">Total Value</div>
                            <div className="text-white text-lg font-bold">
                                ${(parseFloat(formData.quantity) * parseFloat(formData.averageCost)).toLocaleString(undefined, {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2
                                })}
                            </div>
                        </div>
                    )}

                    {/* Error Message */}
                    {errors.submit && (
                        <div className="bg-red-600/20 border border-red-500/30 rounded-lg p-3">
                            <p className="text-red-400 text-xs">{errors.submit}</p>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 bg-gray-700/70 hover:bg-gray-600/70 text-white rounded-lg transition-all duration-300 font-medium text-sm"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-sm"
                        >
                            {isLoading ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            ) : (
                                'Add Transaction'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddTransactionModal;
