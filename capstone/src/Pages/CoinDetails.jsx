import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NavBar from "../components/Navbar";
import PriceChart from "../components/PriceChart";
import coinDetails from "../api/CoinDetails";

const CoinDetails = () => {
    const [coin, setCoin] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { coinId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCoinDetails = async () => {
            try {
                setLoading(true);
                const data = await coinDetails(coinId);
                setCoin(data);
                setError(null);
            } catch (err) {
                setError('Failed to fetch coin details');
                console.error('Error fetching coin details:', err);
            } finally {
                setLoading(false);
            }
        };

        if (coinId) {
            fetchCoinDetails();
        }
    }, [coinId]);

    const formatPrice = (price) => {
        if (price >= 1) {
            return `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        } else {
            return `$${price.toFixed(8)}`;
        }
    };

    const formatMarketCap = (marketCap) => {
        if (marketCap >= 1e12) {
            return `$${(marketCap / 1e12).toFixed(2)}T`;
        } else if (marketCap >= 1e9) {
            return `$${(marketCap / 1e9).toFixed(2)}B`;
        } else if (marketCap >= 1e6) {
            return `$${(marketCap / 1e6).toFixed(2)}M`;
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
                        <p className="text-gray-400 text-lg">Loading coin details...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !coin) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
                <NavBar />
                <div className="pt-24 flex items-center justify-center min-h-[60vh]">
                    <div className="text-center">
                        <div className="text-red-400 text-xl mb-4">⚠️ Error</div>
                        <p className="text-gray-400 mb-4">{error || 'Coin not found'}</p>
                        <button 
                            onClick={() => navigate('/markets')} 
                            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors"
                        >
                            Back to Markets
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
            
            <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-24">
                {/* Back Button */}
                <button 
                    onClick={() => navigate('/markets')}
                    className="mb-6 flex items-center text-gray-400 hover:text-white transition-colors group"
                >
                    <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Markets
                </button>

                {/* Header */}
                <div className="bg-gray-900/40 backdrop-blur-xl rounded-3xl p-8 border border-gray-700/50 shadow-2xl mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-4">
                            <img 
                                src={coin.image?.large} 
                                alt={coin.name}
                                className="w-16 h-16 rounded-full"
                            />
                            <div>
                                <h1 className="text-3xl font-bold text-white mb-1">{coin.name}</h1>
                                <div className="flex items-center space-x-3">
                                    <span className="text-gray-400 text-lg uppercase">{coin.symbol}</span>
                                    <span className="text-gray-500">#{coin.market_cap_rank}</span>
                                </div>
                            </div>
                        </div>
                        <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl transition-all duration-300 font-medium hover:scale-105">
                            Add to Portfolio
                        </button>
                    </div>

                    {/* Price Info */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center">
                            <div className="text-4xl font-bold text-white mb-2">
                                {formatPrice(coin.market_data?.current_price?.usd)}
                            </div>
                            <div className="text-gray-400">Current Price</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl mb-2">
                                {formatPercentage(coin.market_data?.price_change_percentage_24h)}
                            </div>
                            <div className="text-gray-400">24h Change</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl mb-2">
                                {formatPercentage(coin.market_data?.price_change_percentage_7d)}
                            </div>
                            <div className="text-gray-400">7d Change</div>
                        </div>
                    </div>
                </div>

                {/* Price Chart */}
                <div className="mb-8">
                    <PriceChart coinId={coinId} />
                </div>

                {/* Market Statistics */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    <div className="bg-gray-900/40 backdrop-blur-xl rounded-3xl p-8 border border-gray-700/50 shadow-2xl">
                        <h2 className="text-xl font-bold text-white mb-6">Market Statistics</h2>
                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <span className="text-gray-400">Market Cap</span>
                                <span className="text-white">{formatMarketCap(coin.market_data?.market_cap?.usd)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">24h Volume</span>
                                <span className="text-white">{formatMarketCap(coin.market_data?.total_volume?.usd)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Circulating Supply</span>
                                <span className="text-white">{coin.market_data?.circulating_supply?.toLocaleString()} {coin.symbol?.toUpperCase()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Total Supply</span>
                                <span className="text-white">
                                    {coin.market_data?.total_supply ? 
                                        `${coin.market_data.total_supply.toLocaleString()} ${coin.symbol?.toUpperCase()}` : 
                                        'N/A'
                                    }
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">All-Time High</span>
                                <span className="text-white">{formatPrice(coin.market_data?.ath?.usd)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">All-Time Low</span>
                                <span className="text-white">{formatPrice(coin.market_data?.atl?.usd)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-900/40 backdrop-blur-xl rounded-3xl p-8 border border-gray-700/50 shadow-2xl">
                        <h2 className="text-xl font-bold text-white mb-6">Additional Information</h2>
                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <span className="text-gray-400">Genesis Date</span>
                                <span className="text-white">
                                    {coin.genesis_date ? new Date(coin.genesis_date).toLocaleDateString() : 'N/A'}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Categories</span>
                                <span className="text-white">
                                    {coin.categories?.slice(0, 2).join(', ') || 'N/A'}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Website</span>
                                <span className="text-white">
                                    {coin.links?.homepage?.[0] ? (
                                        <a 
                                            href={coin.links.homepage[0]} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="text-blue-400 hover:text-blue-300 transition-colors"
                                        >
                                            Visit
                                        </a>
                                    ) : 'N/A'}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Block Explorer</span>
                                <span className="text-white">
                                    {coin.links?.blockchain_site?.[0] ? (
                                        <a 
                                            href={coin.links.blockchain_site[0]} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="text-blue-400 hover:text-blue-300 transition-colors"
                                        >
                                            View
                                        </a>
                                    ) : 'N/A'}
                                </span>
                            </div>
                        </div>

                        {coin.links && (
                            <div className="mt-6 pt-6 border-t border-gray-700/50">
                                <h3 className="text-lg font-semibold text-white mb-4">Links</h3>
                                <div className="flex flex-wrap gap-3">
                                    {coin.links.twitter_screen_name && (
                                        <a 
                                            href={`https://twitter.com/${coin.links.twitter_screen_name}`}
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 rounded-xl transition-colors text-sm"
                                        >
                                            Twitter
                                        </a>
                                    )}
                                    {coin.links.subreddit_url && (
                                        <a 
                                            href={coin.links.subreddit_url}
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="px-4 py-2 bg-orange-600/20 hover:bg-orange-600/30 text-orange-400 rounded-xl transition-colors text-sm"
                                        >
                                            Reddit
                                        </a>
                                    )}
                                    {coin.links.repos_url?.github?.[0] && (
                                        <a 
                                            href={coin.links.repos_url.github[0]}
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="px-4 py-2 bg-gray-600/20 hover:bg-gray-600/30 text-gray-400 rounded-xl transition-colors text-sm"
                                        >
                                            GitHub
                                        </a>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Description */}
                {coin.description?.en && (
                    <div className="bg-gray-900/40 backdrop-blur-xl rounded-3xl p-8 border border-gray-700/50 shadow-2xl">
                        <h2 className="text-xl font-bold text-white mb-6">About {coin.name}</h2>
                        <div 
                            className="text-gray-300 leading-relaxed prose prose-invert max-w-none"
                            dangerouslySetInnerHTML={{ 
                                __html: coin.description.en.split('. ').slice(0, 3).join('. ') + '.'
                            }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default CoinDetails;
