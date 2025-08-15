import React from 'react';

const Features = () => {
    const features = [
        {
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                </svg>
            ),
            title: "Live Prices",
            description: "Real-time cryptocurrency prices updated every second. Never miss a market movement."
        },
        {
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
            ),
            title: "Portfolio P/L",
            description: "Track your gains and losses across all holdings with detailed profit/loss calculations."
        },
        {
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
            ),
            title: "Sparklines",
            description: "Visual price trends at a glance. Spot patterns and momentum with mini charts."
        },
        {
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            ),
            title: "Local Persistence",
            description: "Your data stays private and secure. Everything is stored locally on your device."
        }
    ];

    return (
        <section className="py-20 bg-transparent">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                        Everything you need to track crypto
                    </h2>
                    <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto font-light">
                        Professional-grade tools that make cryptocurrency tracking simple and powerful.
                    </p>
                </div>
                
                {/* Features Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                    {features.map((feature, index) => (
                        <div key={index} className="bg-gray-700/50 backdrop-blur-sm border border-gray-600/50 rounded-2xl p-6 lg:p-8 hover:bg-gray-700/70 hover:border-gray-500/50 transition-all duration-300 group shadow-lg hover:shadow-xl transform hover:-translate-y-2">
                            {/* Icon */}
                            <div className="w-14 h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-transform duration-300 shadow-lg">
                                {feature.icon}
                            </div>
                            
                            {/* Title */}
                            <h3 className="text-lg lg:text-xl font-semibold text-white mb-4">
                                {feature.title}
                            </h3>
                            
                            {/* Description */}
                            <p className="text-gray-400 leading-relaxed text-sm lg:text-base">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;
