import { Link } from 'react-router-dom';

const CTA = () => {
    return (
        <section className="py-20 bg-white cta-section" style={{backgroundColor: '#ffffff'}}>
            <div className="max-w-4xl mx-auto px-6 text-center cta-container" style={{backgroundColor: 'transparent'}}>
                {/* Header */}
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    Start tracking in seconds — no sign-in required
                </h2>
                
                {/* Description */}
                <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                    Jump right into real-time crypto tracking. Your data stays private and secure 
                    on your device.
                </p>
                
                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Link 
                        to="/dashboard" 
                        className="bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold text-base hover:bg-gray-800 transition-colors shadow-lg"
                    >
                        Open Dashboard
                    </Link>
                    <Link 
                        to="/markets" 
                        className="border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold text-base hover:bg-gray-50 transition-colors"
                    >
                        Explore Markets
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default CTA;
