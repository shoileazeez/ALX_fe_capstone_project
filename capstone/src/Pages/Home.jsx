import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import NavBar from "../components/Navbar";
import MarketPreview from "../components/MarketPreview";
import Features from "../components/Features";
import CTA from "../components/CTA";

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-black text-white">
            {/* Navigation */}
            <NavBar />
            
            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center bg-black">
                {/* Background Pattern/Grid */}
                <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
                
                <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                        Track Crypto Like a Pro
                    </h1>
                    
                    <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
                        Real-time prices, portfolio tracking, and market insights. Start 
                        monitoring your investments instantly — no sign-up required.
                    </p>
                    

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link 
                            to="/dashboard" 
                            className="bg-white text-gray-900 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors shadow-lg"
                        >
                            Open Dashboard
                        </Link>
                        <Link 
                            to="/markets" 
                            className="border-2 border-gray-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-800 transition-colors"
                        >
                            Explore Markets
                        </Link>
                    </div>
                </div>
                
                {/* Scroll Indicator */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
                    <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
                        <div className="w-1 h-3 bg-gray-400 rounded-full mt-2"></div>
                    </div>
                </div>
            </section>
            
            {/* Features Section - Moved before Market Preview */}
            <Features />
            
            {/* Market Preview Section */}
            <section className="bg-black text-white">
                <MarketPreview />
            </section>
            
            {/* CTA Section */}
            <CTA />
            
            {/* Footer */}
            <Footer />
        </div>
    );
}

export default LandingPage;