
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useTransactionModal } from '../context/TransactionModalContext';

const NavBar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { openModal } = useTransactionModal();

    useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > 20;
            setScrolled(isScrolled);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <header className={`${
            scrolled 
                ? 'bg-black/80 backdrop-blur-2xl border-b border-gray-700/70 shadow-2xl' 
                : 'bg-black/20 backdrop-blur-xl border-b border-gray-800/50'
        } text-white fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo and Brand */}
                    <Link to="/" className="flex items-center gap-3 flex-shrink-0 group">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-blue-500/25 transition-all duration-300 group-hover:scale-105">
                            <span className="text-white font-bold text-xl">₿</span>
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                            CryptoTracker
                        </span>
                    </Link>

                    {/* Desktop Navigation Links */}
                    <nav className="hidden md:flex">
                        <ul className="flex items-center space-x-8">
                            <li>
                                <Link 
                                    to="/" 
                                    className="text-white hover:text-blue-400 transition-all duration-300 font-medium relative group py-2"
                                >
                                    Home
                                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-500 group-hover:w-full transition-all duration-300"></span>
                                </Link>
                            </li>
                            <li>
                                <Link 
                                    to="/dashboard" 
                                    className="text-gray-300 hover:text-blue-400 transition-all duration-300 font-medium relative group py-2"
                                >
                                    Dashboard
                                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-500 group-hover:w-full transition-all duration-300"></span>
                                </Link>
                            </li>
                            <li>
                                <Link 
                                    to="/markets" 
                                    className="text-gray-300 hover:text-blue-400 transition-all duration-300 font-medium relative group py-2"
                                >
                                    Markets
                                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-500 group-hover:w-full transition-all duration-300"></span>
                                </Link>
                            </li>
                            <li>
                                <Link 
                                    to="/portfolio" 
                                    className="text-gray-300 hover:text-blue-400 transition-all duration-300 font-medium relative group py-2"
                                >
                                    Portfolio
                                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-500 group-hover:w-full transition-all duration-300"></span>
                                </Link>
                            </li>
                            <li>
                                <Link 
                                    to="/settings" 
                                    className="text-gray-300 hover:text-blue-400 transition-all duration-300 font-medium relative group py-2"
                                >
                                    Settings
                                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-500 group-hover:w-full transition-all duration-300"></span>
                                </Link>
                            </li>
                        </ul>
                    </nav>

                    {/* Desktop Add Transaction Button */}
                    <button 
                        onClick={openModal}
                        className="hidden md:flex bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2.5 rounded-xl items-center space-x-2 transition-all duration-300 shadow-lg hover:shadow-blue-500/25 hover:scale-105"
                    >
                        <span className="text-lg font-bold">+</span>
                        <span className="font-medium">Add Transaction</span>
                    </button>

                    {/* Mobile menu button */}
                    <button
                        onClick={toggleMenu}
                        className="md:hidden flex items-center justify-center w-11 h-11 rounded-xl hover:bg-white/10 transition-all duration-300 backdrop-blur-sm border border-gray-700/50"
                    >
                        <svg
                            className={`w-6 h-6 transition-transform duration-300 ${isMenuOpen ? 'rotate-45' : ''}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            {isMenuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>

                {/* Mobile Navigation Menu */}
                <div className={`md:hidden transition-all duration-500 ease-in-out ${
                    isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
                }`}>
                    <div className="px-2 pt-4 pb-4 space-y-2 bg-black/40 backdrop-blur-xl rounded-2xl mt-4 border border-gray-800/50 shadow-2xl">
                        <Link
                            to="/"
                            className="block px-4 py-3 text-white hover:bg-gradient-to-r hover:from-blue-600/20 hover:to-purple-600/20 rounded-xl transition-all duration-300 font-medium border border-transparent hover:border-blue-500/30"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            🏠 Home
                        </Link>
                        <Link
                            to="/dashboard"
                            className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-blue-600/20 hover:to-purple-600/20 rounded-xl transition-all duration-300 font-medium border border-transparent hover:border-blue-500/30"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            📊 Dashboard
                        </Link>
                        <Link
                            to="/markets"
                            className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-blue-600/20 hover:to-purple-600/20 rounded-xl transition-all duration-300 font-medium border border-transparent hover:border-blue-500/30"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            📈 Markets
                        </Link>
                        <Link
                            to="/portfolio"
                            className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-blue-600/20 hover:to-purple-600/20 rounded-xl transition-all duration-300 font-medium border border-transparent hover:border-blue-500/30"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            💼 Portfolio
                        </Link>
                        <Link
                            to="/settings"
                            className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-blue-600/20 hover:to-purple-600/20 rounded-xl transition-all duration-300 font-medium border border-transparent hover:border-blue-500/30"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            ⚙️ Settings
                        </Link>
                        <div className="pt-2">
                            <button 
                                className="w-full text-left px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl transition-all duration-300 font-medium shadow-lg"
                                onClick={() => {
                                    setIsMenuOpen(false);
                                    openModal();
                                }}
                            >
                                ➕ Add Transaction
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default NavBar;