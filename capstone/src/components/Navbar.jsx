
import { Link } from 'react-router-dom';
import { useState } from 'react';

const NavBar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <header className="bg-black text-white sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-14">
                    {/* Logo and Brand */}
                    <Link to="/" className="flex items-center gap-2 flex-shrink-0">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded flex items-center justify-center">
                            <span className="text-white font-bold text-lg">₿</span>
                        </div>
                        <span className="text-xl font-semibold text-white">CryptoTracker</span>
                    </Link>

                    {/* Desktop Navigation Links */}
                    <nav className="hidden md:flex">
                        <ul className="flex items-center space-x-6">
                            <li>
                                <Link 
                                    to="/" 
                                    className="text-white hover:text-gray-300 transition-colors duration-200 font-medium"
                                >
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link 
                                    to="/dashboard" 
                                    className="text-gray-400 hover:text-white transition-colors duration-200 font-medium"
                                >
                                    Dashboard
                                </Link>
                            </li>
                            <li>
                                <Link 
                                    to="/markets" 
                                    className="text-gray-400 hover:text-white transition-colors duration-200 font-medium"
                                >
                                    Markets
                                </Link>
                            </li>
                            <li>
                                <Link 
                                    to="/portfolio" 
                                    className="text-gray-400 hover:text-white transition-colors duration-200 font-medium"
                                >
                                    Portfolio
                                </Link>
                            </li>
                            <li>
                                <Link 
                                    to="/settings" 
                                    className="text-gray-400 hover:text-white transition-colors duration-200 font-medium"
                                >
                                    Settings
                                </Link>
                            </li>
                        </ul>
                    </nav>

                    {/* Desktop Add Transaction Button */}
                    <button className="hidden md:flex bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg items-center space-x-2 transition-colors duration-200">
                        <span className="text-lg">+</span>
                        <span>Add Transaction</span>
                    </button>

                    {/* Mobile menu button */}
                    <button
                        onClick={toggleMenu}
                        className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-800 transition-colors"
                    >
                        <svg
                            className={`w-6 h-6 transition-transform ${isMenuOpen ? 'rotate-45' : ''}`}
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
                <div className={`md:hidden transition-all duration-300 ease-in-out ${
                    isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
                }`}>
                    <div className="px-2 pt-2 pb-3 space-y-1 bg-gray-900 rounded-lg mt-2">
                        <Link
                            to="/"
                            className="block px-3 py-2 text-white hover:bg-gray-800 rounded-md transition-colors font-medium"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Home
                        </Link>
                        <Link
                            to="/dashboard"
                            className="block px-3 py-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-md transition-colors font-medium"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Dashboard
                        </Link>
                        <Link
                            to="/markets"
                            className="block px-3 py-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-md transition-colors font-medium"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Markets
                        </Link>
                        <Link
                            to="/portfolio"
                            className="block px-3 py-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-md transition-colors font-medium"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Portfolio
                        </Link>
                        <Link
                            to="/settings"
                            className="block px-3 py-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-md transition-colors font-medium"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Settings
                        </Link>
                        <button 
                            className="w-full text-left px-3 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-md transition-colors font-medium mt-2"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            + Add Transaction
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default NavBar;