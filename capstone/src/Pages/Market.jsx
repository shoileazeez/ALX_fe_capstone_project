import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import NavBar from "../components/Navbar";
import MiniChart from "../components/MiniChart";
import MarketTable from "../api/MarketTable";

const Market = () => {
    const [coins, setCoins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("market_cap_desc");
    const [perPage, setPerPage] = useState(50);
    const [currentPage, setCurrentPage] = useState(1);
    const [filteredCoins, setFilteredCoins] = useState([]);
    
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    // Get initial params from URL
    useEffect(() => {
        const search = searchParams.get('search') || '';
        const sort = searchParams.get('sort') || 'market_cap_desc';
        const page = parseInt(searchParams.get('page')) || 1;
        const limit = parseInt(searchParams.get('limit')) || 50;
        
        setSearchTerm(search);
        setSortBy(sort);
        setCurrentPage(page);
        setPerPage(limit);
    }, [searchParams]);

    // Fetch market data
    useEffect(() => {
        const fetchMarketData = async () => {
            try {
                setLoading(true);
                const params = {
                    vs_currency: 'usd',
                    order: sortBy,
                    per_page: perPage,
                    page: currentPage,
                    price_change_percentage: '24h,7d',
                    sparkline: true
                };
                
                const data = await MarketTable(params);
                setCoins(data);
                setError(null);
            } catch (err) {
                setError('Failed to fetch market data');
                console.error('Error fetching market data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchMarketData();
    }, [sortBy, perPage, currentPage]);

    // Filter coins based on search term
    useEffect(() => {
        if (!searchTerm) {
            setFilteredCoins(coins);
        } else {
            const filtered = coins.filter(coin =>
                coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredCoins(filtered);
        }
    }, [coins, searchTerm]);

    // Update URL params
    const updateURLParams = (newParams) => {
        const current = Object.fromEntries(searchParams);
        const updated = { ...current, ...newParams };
        
        // Remove empty values
        Object.keys(updated).forEach(key => {
            if (!updated[key] || updated[key] === '' || updated[key] === 'market_cap_desc') {
                delete updated[key];
            }
        });
        
        setSearchParams(updated);
    };

    const handleSearch = (value) => {
        setSearchTerm(value);
        updateURLParams({ search: value });
    };

    const handleSortChange = (value) => {
        setSortBy(value);
        setCurrentPage(1);
        updateURLParams({ sort: value, page: 1 });
    };

    const handlePerPageChange = (value) => {
        setPerPage(parseInt(value));
        setCurrentPage(1);
        updateURLParams({ limit: value, page: 1 });
    };

    const handleCoinClick = (coinId) => {
        navigate(`/coin/${coinId}`);
    };

    const formatPrice = (price) => {
        if (price >= 1) {
            return `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        } else {
            return `$${price.toFixed(6)}`;
        }
    };

    const formatMarketCap = (marketCap) => {
        if (marketCap >= 1e12) {
            return `$${(marketCap / 1e12).toFixed(1)}T`;
        } else if (marketCap >= 1e9) {
            return `$${(marketCap / 1e9).toFixed(1)}B`;
        } else if (marketCap >= 1e6) {
            return `$${(marketCap / 1e6).toFixed(1)}M`;
        } else {
            return `$${marketCap.toLocaleString()}`;
        }
    };

    const formatPercentage = (percentage) => {
        if (percentage === null || percentage === undefined) return 'N/A';
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
                        <p className="text-gray-400 text-lg">Loading market data...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
                <NavBar />
                <div className="pt-24 flex items-center justify-center min-h-[60vh]">
                    <div className="text-center">
                        <div className="text-red-400 text-xl mb-4">⚠️ Error</div>
                        <p className="text-gray-400">{error}</p>
                        <button 
                            onClick={() => window.location.reload()} 
                            className="mt-4 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors"
                        >
                            Retry
                        </button>
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
                <div className="mb-8">
                    <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-4">
                        Markets
                    </h1>
                    <p className="text-gray-300 text-lg max-w-2xl leading-relaxed">
                        Browse and search top cryptocurrencies. Add coins to your portfolio with a single click.
                    </p>
                </div>

                {/* Filters and Search */}
                <div className="bg-gray-900/40 backdrop-blur-xl rounded-3xl p-6 border border-gray-700/50 shadow-2xl mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Search */}
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                placeholder="Search coins..."
                                value={searchTerm}
                                onChange={(e) => handleSearch(e.target.value)}
                                className="w-full bg-gray-800/70 backdrop-blur-sm border border-gray-600/50 text-white rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                            />
                        </div>

                        {/* Sort By */}
                        <div>
                            <select
                                value={sortBy}
                                onChange={(e) => handleSortChange(e.target.value)}
                                className="w-full bg-gray-800/70 backdrop-blur-sm border border-gray-600/50 text-white rounded-2xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none transition-all duration-300"
                            >
                                <option value="market_cap_desc">Market Cap Rank</option>
                                <option value="volume_desc">Volume (High to Low)</option>
                                <option value="price_change_percentage_24h_desc">24h Change (High to Low)</option>
                                <option value="price_change_percentage_24h_asc">24h Change (Low to High)</option>
                                <option value="id_asc">Name (A-Z)</option>
                                <option value="id_desc">Name (Z-A)</option>
                            </select>
                        </div>

                        {/* Per Page */}
                        <div>
                            <select
                                value={perPage}
                                onChange={(e) => handlePerPageChange(e.target.value)}
                                className="w-full bg-gray-800/70 backdrop-blur-sm border border-gray-600/50 text-white rounded-2xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none transition-all duration-300"
                            >
                                <option value="25">25</option>
                                <option value="50">50</option>
                                <option value="100">100</option>
                                <option value="250">250</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Market Table */}
                <div className="bg-gray-900/40 backdrop-blur-xl rounded-3xl border border-gray-700/50 shadow-2xl overflow-hidden">
                    <div className="p-6 border-b border-gray-700/50">
                        <h2 className="text-xl font-bold text-white mb-2">Top Cryptocurrencies</h2>
                        <p className="text-gray-400 text-sm">Showing {filteredCoins.length} of {coins.length} cryptocurrencies</p>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-700/50">
                                    <th className="text-left py-4 px-6 text-gray-400 font-medium">#</th>
                                    <th className="text-left py-4 px-6 text-gray-400 font-medium">Name</th>
                                    <th className="text-right py-4 px-6 text-gray-400 font-medium">Price</th>
                                    <th className="text-right py-4 px-6 text-gray-400 font-medium">24h %</th>
                                    <th className="text-right py-4 px-6 text-gray-400 font-medium">7d %</th>
                                    <th className="text-right py-4 px-6 text-gray-400 font-medium">Market Cap</th>
                                    <th className="text-center py-4 px-6 text-gray-400 font-medium">7d Trend</th>
                                    <th className="text-center py-4 px-6 text-gray-400 font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCoins.map((coin, index) => (
                                    <tr 
                                        key={coin.id}
                                        onClick={() => handleCoinClick(coin.id)}
                                        className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-all duration-300 cursor-pointer group"
                                    >
                                        <td className="py-4 px-6 text-gray-300">{coin.market_cap_rank}</td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center space-x-3">
                                                <img 
                                                    src={coin.image} 
                                                    alt={coin.name}
                                                    className="w-8 h-8 rounded-full"
                                                />
                                                <div>
                                                    <div className="text-white font-medium group-hover:text-blue-400 transition-colors">
                                                        {coin.name}
                                                    </div>
                                                    <div className="text-gray-400 text-sm uppercase">
                                                        {coin.symbol}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-right text-white font-medium">
                                            {formatPrice(coin.current_price)}
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            {formatPercentage(coin.price_change_percentage_24h)}
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            {formatPercentage(coin.price_change_percentage_7d_in_currency)}
                                        </td>
                                        <td className="py-4 px-6 text-right text-gray-300">
                                            {formatMarketCap(coin.market_cap)}
                                        </td>
                                        <td className="py-4 px-6 text-center">
                                            <div className="flex justify-center">
                                                <MiniChart 
                                                    sparklineData={coin.sparkline_in_7d?.price || []}
                                                    priceChange={coin.price_change_percentage_7d_in_currency || 0}
                                                />
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-center">
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    // Add to portfolio functionality
                                                    console.log(`Adding ${coin.name} to portfolio`);
                                                }}
                                                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl transition-all duration-300 text-sm font-medium hover:scale-105"
                                            >
                                                + Add
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {filteredCoins.length === 0 && (
                        <div className="p-12 text-center">
                            <div className="text-gray-400 text-lg mb-4">No cryptocurrencies found</div>
                            <p className="text-gray-500">Try adjusting your search or filters</p>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                <div className="mt-8 flex justify-center space-x-4">
                    <button
                        onClick={() => {
                            const newPage = Math.max(1, currentPage - 1);
                            setCurrentPage(newPage);
                            updateURLParams({ page: newPage });
                        }}
                        disabled={currentPage === 1}
                        className="px-6 py-3 bg-gray-800/70 hover:bg-gray-700/70 text-white rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Previous
                    </button>
                    <span className="px-6 py-3 bg-gray-900/70 text-white rounded-xl">
                        Page {currentPage}
                    </span>
                    <button
                        onClick={() => {
                            const newPage = currentPage + 1;
                            setCurrentPage(newPage);
                            updateURLParams({ page: newPage });
                        }}
                        className="px-6 py-3 bg-gray-800/70 hover:bg-gray-700/70 text-white rounded-xl transition-all duration-300"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Market;